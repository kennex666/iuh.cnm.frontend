import React, {useEffect, useRef, useState} from "react";
import {Animated, Dimensions, Modal, SafeAreaView, TouchableWithoutFeedback, View} from "react-native";
import Toast from '@/src/components/ui/Toast';
import {useUser} from "@/src/hooks/useUser";
import ProfileUserInfo from "./profileUserInfo";
import ProfileUserEdit from "./profileUserEdit";
import {pickAvatar, pickCover} from '@/src/utils/imagePicker';

type ProfileModalProps = {
    visible: boolean;
    onClose: () => void;
};

export default function ProfileModal({visible, onClose}: ProfileModalProps) {
    const {user: fetchedUser} = useUser();
    const [editMode, setEditMode] = useState(false);
    const [avatarUri, setAvatarUri] = useState<string | null>(null);
    const [coverUri, setCoverUri] = useState<string | null>(null);
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
        const uri = await pickAvatar();
        if (uri) {
            setAvatarUri(uri);
        }
    };

    const handlePickCover = async () => {
        const uri = await pickCover();
        if (uri) {
            setCoverUri(uri);
        }
    };

    const avatarSource = avatarUri
        ? {uri: avatarUri}
        : {uri: fetchedUser?.avatarURL};

    const coverSource = coverUri
        ? {uri: coverUri}
        : {uri: fetchedUser?.coverURL};

    const handleEdit = () => {
        setToast({
            visible: true,
            message: 'Cập nhật thông tin thành công!',
            type: 'success'
        });
        setEditMode(false);
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
                                                    avatarSource={avatarSource}
                                                    coverSource={coverSource}
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