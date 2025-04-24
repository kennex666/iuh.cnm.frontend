import React, {useEffect, useRef, useState} from 'react';
import {Alert, Linking, StyleSheet, Text, View} from 'react-native';
import {BarcodeScanningResult, CameraView, useCameraPermissions} from "expo-camera";
import { navigate } from 'expo-router/build/global-state/routing';
import { router } from 'expo-router';
import { ConversationService } from '@/src/api/services/ConversationService';

interface QrScannerProps {
    onScan?: (data: string) => void;
    onPermissionDenied?: () => void;
    showDefaultAlert?: boolean;
    frameSize?: number;
    frameColor?: string;
    frameThickness?: number;
    overlayMessage?: string;
    lockScanTime?: number;
    conversationId?: string;
    participantId?: string;
    setShowQRScanner?: (show: boolean) => void;
}

export default function QRScanner({
                                      onScan,
                                      onPermissionDenied,
                                      showDefaultAlert = true,
                                      frameSize = 250,
                                      frameColor = '#fff',
                                      frameThickness = 4,
                                      overlayMessage = "Di chuyển camera đến mã QR",
                                      lockScanTime = 1000,
                                      setShowQRScanner
                                  }: QrScannerProps) {
    const [permission, requestPermission] = useCameraPermissions();
    const qrLock = useRef(false);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);

        if (!permission || permission.status !== 'granted') {
            (async () => {
                const cameraPermission = await requestPermission();
                if (!cameraPermission.granted && onPermissionDenied) {
                    onPermissionDenied();
                }
            })();
        }

        return () => setIsMounted(false);
    }, [permission]);

    const handleBarcodeScanned = (result: BarcodeScanningResult) => {
        const {data} = result;

        if (!data || qrLock.current) return;

        qrLock.current = true;

        if (onScan) {
            onScan(data);
        }

        if (showDefaultAlert) {
            setTimeout(() => {
                Alert.alert("QR Code", data, [
                    {text: "Thoát", onPress: () => (qrLock.current = false)},
                    {
                        text: "Tham gia nhóm",
                        onPress: () => {
                            Alert.alert("Đang yêu cầu", "Chuyển đến màn hình nhóm", [
                                {
                                    text: "Đồng ý",
                                    onPress: () => {
                                        if (data) {
                                            const conversation = ConversationService.joinGroupByUrl(data);
                                            setShowQRScanner && setShowQRScanner(false)
                                            router.replace("/(main)");
                                        } else {
                                            Alert.alert("Error", `Không tìm thấy nhóm ${data}`, );
                                            qrLock.current = false;
                                        }
                                        qrLock.current = false;
                                    },
                                },
                                {
                                    text: "Hủy",
                                    onPress: () => (qrLock.current = false),
                                    style: "cancel",
                                },
                            ]);
                        },
                    },
                ]);
            }, 500);
        } else {
            setTimeout(() => {
                qrLock.current = false;
            }, lockScanTime);
        }
    };

    if (!permission) {
        return (
            <View style={styles.permissionContainer}>
                <Text style={styles.permissionText}>Đang kiểm tra quyền camera...</Text>
            </View>
        );
    }

    if (permission.status !== 'granted') {
        return (
            <View style={styles.permissionContainer}>
                <Text style={styles.permissionText}>Vui lòng cấp quyền truy cập camera.</Text>
                <Text
                    style={styles.permissionButton}
                    onPress={requestPermission}
                >
                    Cấp quyền
                </Text>
            </View>
        );
    }

    if (!isMounted) {
        return (
            <View style={styles.permissionContainer}>
                <Text style={styles.permissionText}>Đang kết nối camera...</Text>
            </View>
        );
    }

    const CORNER_SIZE = frameSize / 8;

    return (
        <View style={styles.container}>
            <CameraView
                style={StyleSheet.absoluteFillObject}
                facing="back"
                onBarcodeScanned={handleBarcodeScanned}
                barcodeScannerSettings={{
                    barcodeTypes: ["qr"]
                }}
            />

            <View style={styles.overlay}>
                <Text style={styles.text}>{overlayMessage}</Text>
            </View>

            <View style={[
                styles.frame,
                {
                    width: frameSize,
                    height: frameSize,
                    marginLeft: -frameSize / 2,
                    marginTop: -frameSize / 2
                }
            ]}>
                <View style={[
                    styles.corner,
                    {
                        width: CORNER_SIZE,
                        height: CORNER_SIZE,
                        borderColor: frameColor,
                        borderTopWidth: frameThickness,
                        borderLeftWidth: frameThickness
                    },
                    styles.topLeft
                ]}/>
                <View style={[
                    styles.corner,
                    {
                        width: CORNER_SIZE,
                        height: CORNER_SIZE,
                        borderColor: frameColor,
                        borderTopWidth: frameThickness,
                        borderRightWidth: frameThickness
                    },
                    styles.topRight
                ]}/>
                <View style={[
                    styles.corner,
                    {
                        width: CORNER_SIZE,
                        height: CORNER_SIZE,
                        borderColor: frameColor,
                        borderBottomWidth: frameThickness,
                        borderLeftWidth: frameThickness
                    },
                    styles.bottomLeft
                ]}/>
                <View style={[
                    styles.corner,
                    {
                        width: CORNER_SIZE,
                        height: CORNER_SIZE,
                        borderColor: frameColor,
                        borderBottomWidth: frameThickness,
                        borderRightWidth: frameThickness
                    },
                    styles.bottomRight
                ]}/>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
    },
    permissionContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f9f9f9',
    },
    permissionText: {
        fontSize: 16,
        color: '#333',
        textAlign: 'center',
        marginBottom: 16,
    },
    permissionButton: {
        fontSize: 16,
        color: '#fff',
        backgroundColor: '#2196F3',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 6,
        overflow: 'hidden',
    },
    overlay: {
        position: 'absolute',
        top: 40,
        alignSelf: 'center',
        backgroundColor: 'rgba(0,0,0,0.6)',
        padding: 8,
        borderRadius: 8,
        zIndex: 10,
    },
    text: {
        color: '#fff',
        fontSize: 16,
    },
    frame: {
        position: 'absolute',
        top: '50%',
        left: '50%',
    },
    corner: {
        position: 'absolute',
    },
    topLeft: {
        top: 0,
        left: 0,
    },
    topRight: {
        top: 0,
        right: 0,
    },
    bottomLeft: {
        bottom: 0,
        left: 0,
    },
    bottomRight: {
        bottom: 0,
        right: 0,
    },
});
