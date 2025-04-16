import axios from "axios";
import { Attachment } from "@/src/models/Attachment";

export class AttachmentService {
    static async uploadAttachment(formData: FormData) {
        try {
            const response = await axios.post('/attachments', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            
            if (response.data.success) {
                return {
                    success: true,
                    data: response.data.data as Attachment,
                    statusMessage: response.data.message
                };
            } else {
                return {
                    success: false,
                    statusMessage: response.data.message || 'Upload failed'
                };
            }
        } catch (error) {
            console.error('Error uploading attachment:', error);
            
            return {
                success: false,
                statusMessage: 'Không thể tải file lên. Vui lòng thử lại sau.'
            };
        }
    }

    static async getAttachmentByMessageId(messageId: string) {
        try {
            const response = await axios.get(`/attachments/message/${messageId}`);
            
            if (response.data.success) {
                return {
                    success: true,
                    data: response.data.data as Attachment[],
                    statusMessage: response.data.message
                };
            } else {
                return {
                    success: false,
                    statusMessage: response.data.message || 'Failed to fetch attachment'
                };
            }
        } catch (error) {
            console.error('Error fetching attachment:', error);
            return {
                success: false,
                statusMessage: 'Không thể lấy thông tin file. Vui lòng thử lại sau.'
            };
        }
    }

    static async deleteAttachment(attachmentId: string) {
        try {
            const response = await axios.delete(`/attachments/${attachmentId}`);
            
            if (response.data.success) {
                return {
                    success: true,
                    data: response.data.data,
                    statusMessage: response.data.message
                };
            } else {
                return {
                    success: false,
                    statusMessage: response.data.message || 'Failed to delete attachment'
                };
            }
        } catch (error) {
            console.error('Error deleting attachment:', error);
            return {
                success: false,
                statusMessage: 'Không thể xóa file. Vui lòng thử lại sau.'
            };
        }
    }
}