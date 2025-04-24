import axios from 'axios';
import {Attachment} from '@/src/models/Attachment';
import {ApiEndpoints} from "@/src/constants/ApiConstant";

interface AttachmentService {
    getAttachmentByMessageId: (messageId: string) => Promise<{
        success: boolean;
        data?: Attachment[];
        statusMessage: string;
    }>;
}

export const AttachmentService: AttachmentService = {
    async getAttachmentByMessageId(messageId: string) {
        try {
            const response = await axios.get(`${ApiEndpoints.API_ATTACHMENTS}/message/${messageId}`);

            if (response.data.success) {
                return {
                    success: true,
                    data: response.data.data as Attachment[],
                    statusMessage: response.data.message,
                };
            } else {
                return {
                    success: false,
                    statusMessage: response.data.message || 'Failed to fetch attachment',
                };
            }
        } catch (error) {
            console.error('Error fetching attachment:', error);
            return {
                success: false,
                statusMessage: 'Không thể lấy thông tin file. Vui lòng thử lại sau.',
            };
        }
    }
}
