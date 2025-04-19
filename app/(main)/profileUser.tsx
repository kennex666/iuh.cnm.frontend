import React, {useEffect, useRef, useState} from "react";
import {
    Animated,
    Dimensions,
    ImageSourcePropType,
    Modal,
    SafeAreaView,
    TouchableWithoutFeedback,
    View
} from "react-native";
import Toast from '@/src/components/ui/Toast';
import ProfileUserInfo from "./profileUserInfo";
import ProfileUserEdit from "./profileUserEdit";
import {pickAvatar, pickCover} from '@/src/utils/ImagePicker';
import {useRouter} from "expo-router";
import {useUser} from "@/src/contexts/UserContext";
import {validateAvatar, validateCover} from "@/src/utils/ImageValidator";

type ProfileModalProps = {
    visible: boolean;
    onClose: () => void;
};

export default function ProfileModal({visible, onClose}: ProfileModalProps) {
    const router = useRouter();
    const {user, update} = useUser();
    const {user: fetchedUser} = useUser();
    const [editMode, setEditMode] = useState(false);
    const [avatarUri, setAvatarUri] = useState<string | null>("");
    const [coverUri, setCoverUri] = useState<string | null>("");
    const [editUser, setEditUser] = useState({...fetchedUser});
    const [toast, setToast] = useState({
        visible: false,
        message: '',
        type: 'success' as 'success' | 'error'
    });

    // Animation values
    const slideAnim = useRef(new Animated.Value(0)).current;
    const [animating, setAnimating] = useState(false);

    const {width, height} = Dimensions.get('window');
    const modalWidth = width >= 768 ? width * 0.25 : width * 0.8;
    const modalHeight = height * 0.8;

    // Handle animation when editMode changes
    useEffect(() => {
        if (editMode) {
            setAnimating(true);
            Animated.timing(slideAnim, {
                toValue: -1,
                duration: 300,
                useNativeDriver: true
            }).start(() => {
                setAnimating(false);
            });
        } else {
            setAnimating(true);
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true
            }).start(() => {
                setAnimating(false);
            });
        }
    }, [editMode]);

    const handlePickAvatar = async () => {
        const result = await pickAvatar();
        if (result.success) {
            setAvatarUri(result.uri);

            await update({
                ...user,
                avatarURL: result.uri || fetchedUser?.avatarURL
            });

            setToast({
                visible: true,
                message: result.message,
                type: 'success'
            });

            setTimeout(() => {
                router.replace('/(main)');
            }, 2000);
        }
    };

    const handlePickCover = async () => {
        const result = await pickCover();
        if (result.success) {
            setCoverUri(result.uri);

            await update({
                ...user,
                coverURL: result.uri || fetchedUser?.coverURL
            });

            setToast({
                visible: true,
                message: result.message,
                type: 'success'
            });

            setTimeout(() => {
                router.replace('/(main)');
            }, 2000);
        }
    };

    const [avatar, setAvatar] = useState<ImageSourcePropType>({uri: ""});
    const [cover, setCover] = useState<ImageSourcePropType>({uri: ""});

    useEffect(() => {
        validateAvatar(avatarUri || "").then((validatedAvatar) => {
            setAvatar(validatedAvatar);
        });

        validateCover(coverUri || "").then((validatedCover) => {
            setCover(validatedCover);
        });
    }, [fetchedUser]);

    const handleEdit = async () => {
        console.log('Saving user profile changes:', editUser);

        // Validation
        if (!editUser?.name?.trim()) {
            setToast({
                visible: true,
                message: 'Tên hiển thị không được để trống',
                type: 'error'
            });
            return;
        }

        try {
            setToast({
                visible: true,
                message: 'Đang cập nhật thông tin...',
                type: 'success'
            });

            const updateData = {
                name: editUser.name,
                gender: editUser.gender,
                dob: editUser.dob
            };

            console.log('Sending update request with data:', updateData);
            const result = await update(updateData);
            console.log('Update result:', result);

            if (result.success) {
                setToast({
                    visible: true,
                    message: result.message || 'Cập nhật thông tin thành công!',
                    type: 'success'
                });

                setEditMode(false);
                setTimeout(() => {router.replace('/(main)')}, 1000);
            } else {
                setToast({
                    visible: true,
                    message: result.message || 'Cập nhật thông tin thất bại!',
                    type: 'error'
                });
            }
        } catch (error) {
            console.error('Error during profile update:', error);
            setToast({
                visible: true,
                message: 'Đã xảy ra lỗi khi cập nhật thông tin.',
                type: 'error'
            });
        }
    };

    const handleCancel = () => {
        setEditUser({...fetchedUser});
        setEditMode(false);
    };

    const toggleEdit = () => {
        setEditUser({...fetchedUser});
        setEditMode(true);
    };

    const closeModal = () => {
        setEditMode(false);
        onClose();
    };

    // Calculate transform values for the animation
    const infoTranslateX = slideAnim.interpolate({
        inputRange: [-1, 0],
        outputRange: [-(modalWidth), 0]
    });

    const editTranslateX = slideAnim.interpolate({
        inputRange: [-1, 0],
        outputRange: [0, modalWidth]
    });

    return (
        <>
            <Modal
                animationType="fade"
                transparent={true}
                visible={visible}
                onRequestClose={closeModal}
            >
                <TouchableWithoutFeedback onPress={closeModal}>
                    <View style={{
                        flex: 1,
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <TouchableWithoutFeedback>
                            <View style={{
                                width: modalWidth,
                                height: modalHeight,
                                backgroundColor: '#ffffff',
                                borderRadius: 8,
                                overflow: 'hidden'
                            }}>
                                <SafeAreaView className="flex-1">
                                    <View style={{flex: 1, position: 'relative'}}>
                                        {/* Always render both screens but control visibility with animation */}
                                        {(editMode || animating) && (
                                            <Animated.View
                                                style={{
                                                    position: 'absolute',
                                                    width: '100%',
                                                    height: '100%',
                                                    transform: [{translateX: editTranslateX}]
                                                }}
                                            >
                                                <ProfileUserEdit
                                                    editUser={editUser}
                                                    onSave={handleEdit}
                                                    onCancel={handleCancel}
                                                    onChangeUser={setEditUser}
                                                />
                                            </Animated.View>
                                        )}

                                        {(!editMode || animating) && (
                                            <Animated.View
                                                style={{
                                                    position: 'absolute',
                                                    width: '100%',
                                                    height: '100%',
                                                    transform: [{translateX: infoTranslateX}]
                                                }}
                                            >
                                                <ProfileUserInfo
                                                    user={fetchedUser}
                                                    avatar={avatar}
                                                    cover={cover}
                                                    onPickAvatar={handlePickAvatar}
                                                    onPickCover={handlePickCover}
                                                    onEditPress={toggleEdit}
                                                    onClose={closeModal}
                                                />
                                            </Animated.View>
                                        )}
                                    </View>
                                </SafeAreaView>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
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