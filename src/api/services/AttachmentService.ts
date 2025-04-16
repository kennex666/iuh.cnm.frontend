import axios from "axios";


export class AttachmentService {
    static async uploadAttachment(formData: FormData) {
        try {
            const response = await axios.post('/attachments', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
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
            return response.data;
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
            return response.data;
        } catch (error) {
            console.error('Error deleting attachment:', error);
            return {
                success: false,
                statusMessage: 'Không thể xóa file. Vui lòng thử lại sau.'
            };
        }
    }
}
