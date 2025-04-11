import React, {useEffect, useState} from 'react';
import {Modal, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import Toast from '@/src/components/ui/Toast';
import Button from '@/src/components/ui/Button';
import {AuthService} from '@/src/api/services/AuthService';
import {useAuth} from '@/src/contexts/UserContext';
import {router} from "expo-router";

interface Device {
    id: string;
    name: string;
    deviceType: 'mobile' | 'tablet' | 'desktop' | 'other';
    lastActive: string;
    isCurrentDevice: boolean;
}

interface DeviceAccessModalDesktopProps {
    visible: boolean;
    onClose: () => void;
}

export default function DeviceAccessModalDesktop({visible, onClose}: DeviceAccessModalDesktopProps) {
    const [loading, setLoading] = useState(false);
    const {logout} = useAuth();
    const [showConfirmLogout, setShowConfirmLogout] = useState(false);
    const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
    const [toast, setToast] = useState({
        visible: false,
        message: '',
        type: 'success' as 'success' | 'error'
    });

    // Mock data for devices
    const [devices, setDevices] = useState<Device[]>([]);


    useEffect(() => {
        // API
        AuthService
            .getDevices()
            .then((response) => {
                if (response.success) {
                    if (!response.data) {
                        setDevices([]); // Reset devices if no data
                        return;
                    }
                    response.data = response.data.map((value: any) => {
                        return {
                            id: value.jwtId,
                            name: value.deviceName || "Thiết bị không xác định",
                            deviceType: value.deviceType || "desktop",
                            lastActive: new Date(
                                value.createdAt
                            ).toLocaleDateString("vi-VN", {
                                year: "numeric",
                                month: "2-digit",
                                day: "2-digit",
                                hour: "2-digit",
                                minute: "2-digit",
                            }),
                            isCurrentDevice: value.isCurrentDevice || false,
                        };
                    });
                    setDevices(response.data);
                } else {
                    setToast({
                        visible: true,
                        message:
                            response.message || "Fail to get current devices",
                        type: "error",
                    });
                }
            })
            .catch((error) => {
                console.error("Error fetching devices:", error);
                setToast({
                    visible: true,
                    message: "Có lỗi xảy ra, vui lòng thử lại",
                    type: "error",
                });
            });
    }, []);

    const getDeviceIcon = (deviceType: string) => {
        switch (deviceType) {
            case 'mobile':
                return 'phone-portrait-outline';
            case 'tablet':
                return 'tablet-portrait-outline';
            case 'desktop':
                return 'desktop-outline';
            default:
                return 'hardware-chip-outline';
        }
    };

    const handleLogoutDevice = (device: Device) => {
        if (device.isCurrentDevice) {
            setToast({
                visible: true,
                message: 'Không thể đăng xuất thiết bị hiện tại',
                type: 'error'
            });
            return;
        }

        setSelectedDevice(device);
        setShowConfirmLogout(true);
    };

    const confirmLogoutDevice = async () => {
        if (!selectedDevice) return;

        setLoading(true);
        try {
            // TODO: Implement API call to logout device
            const response = await AuthService.logoutDevice({deviceId: selectedDevice.id});

            if (!response.success) {
                setToast({
                    visible: true,
                    message: response.message || 'Có lỗi xảy ra, vui lòng thử lại',
                    type: 'error'
                });
                return;
            }

            setDevices(devices.filter(device => device.id !== selectedDevice.id));
            setToast({
                visible: true,
                message: 'Đã đăng xuất thiết bị thành công',
                type: 'success'
            });

            setShowConfirmLogout(false);
            setSelectedDevice(null);
        } catch (error) {
            setToast({
                visible: true,
                message: 'Có lỗi xảy ra, vui lòng thử lại',
                type: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleLogoutAllDevices = async () => {
        setLoading(true);
        try {
            // TODO: Implement API call to logout all devices
            const response = await AuthService.logoutAll();

            if (!response.success) {
                setToast({
                    visible: true,
                    message:
                        response.message || "Có lỗi xảy ra, vui lòng thử lại",
                    type: "error",
                });
                return;
            }

            // Keep only current device
            setToast({
                visible: true,
                message:
                    "Đã đăng xuất tất cả thiết bị thành công. Vui lòng đăng nhập lại!",
                type: "success",
            });
            await logout();
            setTimeout(() => {
                router.replace("/(auth)");
            }, 3000);
        } catch (error) {
            setToast({
                visible: true,
                message: "Có lỗi xảy ra, vui lòng thử lại",
                type: "error",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Modal
                visible={visible}
                transparent={true}
                animationType="fade"
            >
                <View className="flex-1 justify-center items-center bg-black/50">
                    <View className="bg-white rounded-xl w-[90%] max-w-[800px] max-h-[80vh]">
                        <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
                            <Text className="text-xl font-semibold">Quản lý thiết bị</Text>
                            <TouchableOpacity onPress={onClose}>
                                <Ionicons name="close" size={24} color="#6B7280"/>
                            </TouchableOpacity>
                        </View>

                        <View className="p-6">
                            <Text className="text-base text-gray-700 mb-6">
                                Dưới đây là danh sách các thiết bị đã đăng nhập vào tài khoản của bạn. Bạn có thể đăng
                                xuất các thiết bị không còn sử dụng.
                            </Text>

                            <View className="mb-6">
                                <View className="grid grid-cols-12 gap-4 mb-3 text-sm font-medium text-gray-500">
                                    <View className="col-span-5">Thiết bị</View>
                                    <View className="col-span-3">Loại</View>
                                    <View className="col-span-3">Hoạt động cuối</View>
                                    <View className="col-span-1"></View>
                                </View>

                                <ScrollView className="max-h-[300px]">
                                    {devices.map(device => (
                                        <View key={device.id}
                                              className="grid grid-cols-12 gap-4 py-3 border-b border-gray-100 items-center">
                                            <View className="col-span-5 flex-row items-center">
                                                <View
                                                    className="w-10 h-10 bg-blue-100 rounded-full items-center justify-center mr-3">
                                                    <Ionicons name={getDeviceIcon(device.deviceType)} size={20}
                                                              color="#3B82F6"/>
                                                </View>
                                                <View>
                                                    <Text className="text-base font-medium text-gray-800">
                                                        {device.name}
                                                        {device.isCurrentDevice && (
                                                            <Text className="text-xs text-blue-500 ml-2">(Thiết bị hiện
                                                                tại)</Text>
                                                        )}
                                                    </Text>
                                                </View>
                                            </View>
                                            <View className="col-span-3">
                                                <Text className="text-sm text-gray-600">
                                                    {device.deviceType === 'mobile' ? 'Điện thoại' :
                                                        device.deviceType === 'tablet' ? 'Máy tính bảng' :
                                                            device.deviceType === 'desktop' ? 'Máy tính' : 'Thiết bị khác'}
                                                </Text>
                                            </View>
                                            <View className="col-span-3">
                                                <Text className="text-sm text-gray-600">{device.lastActive}</Text>
                                            </View>
                                            <View className="col-span-1">
                                                {!device.isCurrentDevice && (
                                                    <TouchableOpacity
                                                        onPress={() => handleLogoutDevice(device)}
                                                        className="p-2"
                                                    >
                                                        <Ionicons name="log-out-outline" size={20} color="#EF4444"/>
                                                    </TouchableOpacity>
                                                )}
                                            </View>
                                        </View>
                                    ))}
                                </ScrollView>
                            </View>

                            <View className="flex-row justify-end">
                                <Button
                                    title="Đăng xuất tất cả thiết bị khác"
                                    onPress={handleLogoutAllDevices}
                                    loading={loading}
                                    variant="outline"
                                />
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Confirmation Modal */}
            <Modal
                visible={showConfirmLogout}
                transparent={true}
                animationType="fade"
            >
                <View className="flex-1 justify-center items-center bg-black/50">
                    <View className="bg-white rounded-xl p-6 w-[90%] max-w-[500px]">
                        <Text className="text-xl font-semibold text-center mb-2">Xác nhận đăng xuất</Text>
                        <Text className="text-base text-gray-600 text-center mb-6">
                            Bạn có chắc chắn muốn đăng xuất thiết bị "{selectedDevice?.name}" không?
                        </Text>

                        <View className="flex-row space-x-4 justify-center">
                            <Button
                                title="Hủy"
                                onPress={() => {
                                    setShowConfirmLogout(false);
                                    setSelectedDevice(null);
                                }}
                                variant="outline"
                                className="w-32"
                            />
                            <Button
                                title="Xác nhận"
                                onPress={confirmLogoutDevice}
                                loading={loading}
                                className="w-32"
                            />
                        </View>
                    </View>
                </View>
            </Modal>

            <Toast
                visible={toast.visible}
                message={toast.message}
                type={toast.type}
                onHide={() => setToast(prev => ({...prev, visible: false}))}
            />
        </>
    );
} 