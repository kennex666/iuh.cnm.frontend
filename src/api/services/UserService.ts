import axios from 'axios';
import {User} from '@/src/models/User';
import {AuthStorage} from '@/src/services/AuthStorage';
import {Domains} from '@/src/constants/ApiConstant';

export const UserService = {
    async update(userData: Partial<User>): Promise<{ success: boolean; user?: User; message?: string; data?: any }> {
        try {
            console.log('Updating user with data:', userData);

            // Get the access token
            const token = await AuthStorage.getAccessToken();
            if (!token) {
                console.error('No access token found');
                return {success: false, message: 'Không tìm thấy token xác thực'};
            }

            // Format the data - convert timestamp to ISO date string if dob exists
            const formattedData = {...userData};
            if (formattedData.dob) {
                // Convert timestamp to ISO date format (YYYY-MM-DD)
                const date = new Date(formattedData.dob);
                formattedData.dob = date.toISOString().split('T')[0];
                console.log('Converted dob to ISO format:', formattedData.dob);
            }

            // Make the API request with authorization header
            const response = await axios.put(
                `${Domains.API_USER}/update`,
                formattedData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            console.log('Update API response:', response.data);

            if (response.data.success) {
                return {
                    success: true,
                    user: response.data.data,
                    message: response.data.errorMessage || 'Cập nhật thông tin thành công!',
                    data: response.data.data
                };
            } else {
                return {
                    success: false,
                    message: response.data.errorMessage || 'Cập nhật thông tin thất bại'
                };
            }
        } catch (error) {
            console.error('Error updating user:', error);
            return {
                success: false,
                message: error instanceof Error ? error.message : 'Lỗi không xác định khi cập nhật thông tin'
            };
        }
    }

};