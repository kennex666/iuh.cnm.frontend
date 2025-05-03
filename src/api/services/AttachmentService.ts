import { ApiEndpoints } from "@/src/constants/ApiConstant";
import { Attachment } from '@/src/models/Attachment';
import { BaseService } from "./BaseService";

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
            const response = await BaseService.authenticatedRequest<Attachment[]>(
                'get',
                `${ApiEndpoints.API_ATTACHMENTS}/message/${messageId}`
            );

            if (!response.success) {
                return {
                    success: false,
                    statusMessage: response.message || 'Failed to fetch attachment'
                };
            }

            return {
                success: true,
                data: response.data || [],
                statusMessage: response.message || 'Successfully fetched attachments'
            };
        } catch (error: any) {
            console.error('Error fetching attachment:', error);
            return {
                success: false,
                data: [],
                statusMessage: error.message || 'Không thể lấy thông tin file. Vui lòng thử lại sau.'
            };
        }
    }
};