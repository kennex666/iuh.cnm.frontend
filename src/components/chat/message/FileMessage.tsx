import React from 'react';
import {View} from 'react-native';
import FileMessageContent from './FileMessageContent';

interface FileMessageProps {
    messageId: string;
    fileName: string;
    isSender: boolean;
    getAttachment: (messageId: string) => Promise<any>;
    onImagePress: (uri: string | null) => void;
}

const FileMessage: React.FC<FileMessageProps> = (
    {
        messageId,
        fileName,
        isSender,
        getAttachment,
        onImagePress
    }) => {
    return (
        <View className="flex-row items-center">
            <FileMessageContent
                messageId={messageId}
                fileName={fileName}
                isSender={isSender}
                getAttachment={getAttachment}
                onImagePress={onImagePress}
            />
        </View>
    );
};

export default FileMessage;