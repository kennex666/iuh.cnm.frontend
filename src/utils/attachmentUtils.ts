// src/utils/attachmentUtils.ts
import { Attachment } from '@/src/models/Attachment';
import { AttachmentService } from '@/src/api/services/AttachmentService';

export const getAttachmentByMessageId = async (
    messageId: string,
    currentAttachments: { [key: string]: Attachment }
): Promise<Attachment | null> => {
    try {
        // Check if we already have the attachment in local state
        if (currentAttachments[messageId]) {
            return currentAttachments[messageId];
        }

        // If not, fetch it from the server
        const response = await AttachmentService.getAttachmentByMessageId(messageId);

        if (response.success && response.data && response.data.length > 0) {
            const attachment = response.data[0]; // Get the first attachment if there are multiple
            return attachment;
        }

        return null;
    } catch (error) {
        console.error('Error fetching attachment:', error);
        return null;
    }
};

export const isFileTooLarge = (size: number | undefined, maxSizeInMB: number = 10): boolean => {
    if (size === undefined) return false;
    return size > maxSizeInMB * 1024 * 1024;
};