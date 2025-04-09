import React, { useState } from 'react';
import { Modal, Text, TouchableOpacity, View, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Toast from '@/src/components/ui/Toast';
import Button from '@/src/components/ui/Button';

interface Device {
  id: string;
  name: string;
  deviceType: 'mobile' | 'tablet' | 'desktop' | 'other';
  lastActive: string;
  isCurrentDevice: boolean;
}

interface DeviceAccessModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function DeviceAccessModal({ visible, onClose }: DeviceAccessModalProps) {
  const [loading, setLoading] = useState(false);
  const [showConfirmLogout, setShowConfirmLogout] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [toast, setToast] = useState({
    visible: false,
    message: '',
    type: 'success' as 'success' | 'error'
  });

  // Mock data for devices
  const [devices, setDevices] = useState<Device[]>([
    {
      id: '1',
      name: 'iPhone 13 Pro',
      deviceType: 'mobile',
      lastActive: 'Đang sử dụng',
      isCurrentDevice: true
    },
    {
      id: '2',
      name: 'MacBook Pro',
      deviceType: 'desktop',
      lastActive: '2 giờ trước',
      isCurrentDevice: false
    },
    {
      id: '3',
      name: 'Samsung Galaxy S21',
      deviceType: 'mobile',
      lastActive: '1 ngày trước',
      isCurrentDevice: false
    },
    {
      id: '4',
      name: 'iPad Pro',
      deviceType: 'tablet',
      lastActive: '3 ngày trước',
      isCurrentDevice: false
    }
  ]);

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
      await new Promise(resolve => setTimeout(resolve, 1000));
      
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
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Keep only current device
      setDevices(devices.filter(device => device.isCurrentDevice));
      setToast({
        visible: true,
        message: 'Đã đăng xuất tất cả thiết bị thành công',
        type: 'success'
      });
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

  return (
    <>
      <Modal
        visible={visible}
        transparent={true}
        animationType="slide"
      >
        <View className="flex-1 bg-black/50">
          <View className="flex-1 mt-20 bg-white rounded-t-3xl">
            <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
              <Text className="text-xl font-semibold">Quản lý thiết bị</Text>
              <TouchableOpacity onPress={onClose}>
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <ScrollView className="flex-1">
              <View className="p-4">
                <Text className="text-base text-gray-700 mb-4">
                  Dưới đây là danh sách các thiết bị đã đăng nhập vào tài khoản của bạn. Bạn có thể đăng xuất các thiết bị không còn sử dụng.
                </Text>

                <View className="space-y-4">
                  {devices.map(device => (
                    <View key={device.id} className="bg-gray-50 rounded-xl p-4">
                      <View className="flex-row items-center mb-3">
                        <View className="w-10 h-10 bg-blue-100 rounded-full items-center justify-center mr-3">
                          <Ionicons name={getDeviceIcon(device.deviceType)} size={20} color="#3B82F6" />
                        </View>
                        <View className="flex-1">
                          <Text className="text-base font-medium text-gray-800">
                            {device.name}
                            {device.isCurrentDevice && (
                              <Text className="text-xs text-blue-500 ml-2">(Thiết bị hiện tại)</Text>
                            )}
                          </Text>
                          <Text className="text-sm text-gray-500">
                            {device.deviceType === 'mobile' ? 'Điện thoại' : 
                             device.deviceType === 'tablet' ? 'Máy tính bảng' : 
                             device.deviceType === 'desktop' ? 'Máy tính' : 'Thiết bị khác'}
                          </Text>
                        </View>
                        {!device.isCurrentDevice && (
                          <TouchableOpacity 
                            onPress={() => handleLogoutDevice(device)}
                            className="p-2"
                          >
                            <Ionicons name="log-out-outline" size={20} color="#EF4444" />
                          </TouchableOpacity>
                        )}
                      </View>
                      <Text className="text-sm text-gray-600">
                        Hoạt động cuối: {device.lastActive}
                      </Text>
                    </View>
                  ))}
                </View>

                <View className="mt-6">
                  <Button
                    title="Đăng xuất tất cả thiết bị khác"
                    onPress={handleLogoutAllDevices}
                    loading={loading}
                    variant="outline"
                  />
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Confirmation Modal */}
      <Modal
        visible={showConfirmLogout}
        transparent={true}
        animationType="fade"
      >
        <View className="flex-1 justify-center items-center bg-black/50 px-4">
          <View className="bg-white rounded-xl p-6 w-full">
            <Text className="text-xl font-semibold text-center mb-2">Xác nhận đăng xuất</Text>
            <Text className="text-base text-gray-600 text-center mb-6">
              Bạn có chắc chắn muốn đăng xuất thiết bị "{selectedDevice?.name}" không?
            </Text>
            
            <View className="space-y-3">
              <Button
                title="Xác nhận"
                onPress={confirmLogoutDevice}
                loading={loading}
              />
              <Button
                title="Hủy"
                onPress={() => {
                  setShowConfirmLogout(false);
                  setSelectedDevice(null);
                }}
                variant="outline"
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