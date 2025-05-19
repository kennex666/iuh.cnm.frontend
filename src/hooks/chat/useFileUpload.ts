import {useState} from 'react';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import SocketService from '@/src/api/services/SocketService';
import {Platform} from "react-native";

export interface UploadState {
    fileUploading: boolean;
    uploadProgress: number;
    uploadStatusMessage: string;
    showUploadModal: boolean;
    error: string | null;
}

export const useFileUpload = (
    conversationId: string | undefined,
    userId: string | undefined,
    onUploadComplete: () => void
) => {
    const [uploadState, setUploadState] = useState<UploadState>({
        fileUploading: false,
        uploadProgress: 0,
        uploadStatusMessage: 'Preparing to upload...',
        showUploadModal: false,
        error: null,
    });

    const socketService = SocketService.getInstance();

    const resetUploadState = () => {
        setUploadState({
            fileUploading: false,
            uploadProgress: 0,
            uploadStatusMessage: 'Preparing to upload...',
            showUploadModal: false,
            error: null,
        });
    };

    const handleSelectFile = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: '*/*',
                copyToCacheDirectory: true,
            });

            if (result.canceled) {
                console.log('User cancelled file picker');
                return;
            }

            await uploadAndSendFile(result.assets[0]);
        } catch (error) {
            console.error('Error picking document:', error);
            setUploadState(prev => ({
                ...prev,
                error: 'Không thể chọn file. Vui lòng thử lại.',
            }));
        }
    };

    const uploadAndSendFile = async (fileAsset: DocumentPicker.DocumentPickerAsset) => {
        if (!conversationId || !userId) return;

        const isLargeFile = (fileAsset.size || 0) > 10 * 1024 * 1024;

        try {
            setUploadState(prev => ({
                ...prev,
                showUploadModal: true,
                fileUploading: true,
                error: null,
                uploadProgress: 0,
                uploadStatusMessage: 'Preparing file...',
            }));

            if (isLargeFile) {
                setUploadState(prev => ({
                    ...prev,
                    uploadStatusMessage: 'File too large. Please try again.',
                    error: 'Tệp quá lớn. Vui lòng thử lại.',
                }));
                return;
            }

            // Prepare file data for socket transmission
            let fileBuffer: ArrayBuffer;

            setUploadState(prev => ({
                ...prev,
                uploadProgress: 10,
                uploadStatusMessage: 'Reading file content...',
            }));

            // Read file content based on platform
            if (Platform.OS === 'web') {
                const response = await fetch(fileAsset.uri);
                const blob = await response.blob();
                fileBuffer = await blob.arrayBuffer();
            } else {
                const base64 = await FileSystem.readAsStringAsync(fileAsset.uri, {
                    encoding: FileSystem.EncodingType.Base64,
                });
                // Convert Base64 to ArrayBuffer
                const binaryString = atob(base64);
                const bytes = new Uint8Array(binaryString.length);
                for (let i = 0; i < binaryString.length; i++) {
                    bytes[i] = binaryString.charCodeAt(i);
                }
                fileBuffer = bytes.buffer;
            }

            setUploadState(prev => ({
                ...prev,
                uploadProgress: 40,
                uploadStatusMessage: 'Preparing to send file...',
            }));

            const fileData = {
                buffer: fileBuffer,
                fileName: fileAsset.name,
                contentType: fileAsset.mimeType || 'application/octet-stream',
            };

            setUploadState(prev => ({
                ...prev,
                uploadProgress: 50,
                uploadStatusMessage: 'Setting up connection...',
            }));

            const attachmentSentHandler = (data: { success: boolean; messageId: string }) => {
                console.log('Attachment sent successfully:', data);
                if (data.success) {
                    setUploadState(prev => ({
                        ...prev,
                        uploadProgress: 100,
                        uploadStatusMessage: 'File sent successfully!',
                    }));

                    onUploadComplete();

                    // Close modal after short delay to show success
                    setTimeout(() => {
                        resetUploadState();
                    }, 800);
                }
                socketService.removeAttachmentSentListener(attachmentSentHandler);
            };

            const attachmentErrorHandler = (error: { message: string }) => {
                console.error('Attachment error:', error.message);
                setUploadState(prev => ({
                    ...prev,
                    uploadStatusMessage: `Error: ${error.message}`,
                    error: `Không thể gửi tệp đính kèm: ${error.message}`,
                }));

                setTimeout(() => {
                    resetUploadState();
                }, 2000);

                socketService.removeAttachmentErrorListener(attachmentErrorHandler);
            };

            socketService.onAttachmentSent(attachmentSentHandler);
            socketService.onAttachmentError(attachmentErrorHandler);

            setUploadState(prev => ({
                ...prev,
                uploadProgress: 70,
                uploadStatusMessage: 'Sending file via socket...',
            }));

            // Send file through socket with optional reply ID
            socketService.sendAttachment(conversationId, fileData, undefined);

            setUploadState(prev => ({
                ...prev,
                uploadProgress: 80,
                uploadStatusMessage: 'Waiting for server confirmation...',
            }));

            console.log(`Sending file via socket: ${fileAsset.name}`);
        } catch (error) {
            console.error('Error uploading file:', error);
            const errorMessage =
                typeof error === 'string'
                    ? error
                    : error instanceof Error
                        ? error.message
                        : 'Không thể gửi file. Vui lòng thử lại.';

            setUploadState(prev => ({
                ...prev,
                uploadStatusMessage: 'Upload failed',
                error: errorMessage,
            }));

            setTimeout(() => {
                resetUploadState();
            }, 2000);
        }
    };

    return {
        ...uploadState,
        handleSelectFile,
        uploadAndSendFile,
        resetUploadState,
        closeUploadModal: () => setUploadState(prev => ({...prev, showUploadModal: false})),
    };
};