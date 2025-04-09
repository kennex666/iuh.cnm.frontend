import React, { Component, useEffect, useRef, useState } from 'react';

import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Linking,
  Button,
  Alert
} from 'react-native';

// import { BarCodeScanner } from 'expo-barcode-scanner';

import { Camera, CameraView, useCameraPermissions } from "expo-camera";



export default function QrScanner() {
  const [permission, requestPermission] = useCameraPermissions();
  const qrLock = useRef(false);

  useEffect(() => {
    if (!permission || permission.status !== 'granted') {
      requestPermission();
    }
  }, [permission]);

  if (!permission) {
    return <Text>Đang kiểm tra quyền camera...</Text>;
  }

  if (permission.status !== 'granted') {
    return <Text>Không có quyền truy cập camera.</Text>;
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing="back"
        onBarcodeScanned={({ data }: any) => {
          if (data && !qrLock.current) {
            qrLock.current = true;
            setTimeout(() => {
              Alert.alert("QR Code", data, [
                { text: "OK", onPress: () => (qrLock.current = false) },
                {
                  text: "Open",
                  onPress: () => {
                    Linking.openURL(data).catch(err => console.error("Error opening URL:", err));
                    qrLock.current = false;
                  },
                },
              ]);
            }, 500);
          }
        }}
      />

      {/* Text hướng dẫn */}
      <View style={styles.overlay}>
        <Text style={styles.text}>Di chuyển camera đến mã QR</Text>
      </View>

      {/* 4 Góc QR frame */}
      <View style={styles.frame}>
        {/* Top-left */}
        <View style={[styles.corner, styles.topLeft]} />
        {/* Top-right */}
        <View style={[styles.corner, styles.topRight]} />
        {/* Bottom-left */}
        <View style={[styles.corner, styles.bottomLeft]} />
        {/* Bottom-right */}
        <View style={[styles.corner, styles.bottomRight]} />
      </View>
    </View>
  );
}

const FRAME_SIZE = 250;
const CORNER_SIZE = 30;
const CORNER_THICKNESS = 4;

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    width: FRAME_SIZE,
    height: FRAME_SIZE,
    top: '50%',
    left: '50%',
    marginLeft: -FRAME_SIZE / 2,
    marginTop: -FRAME_SIZE / 2,
  },
  corner: {
    width: CORNER_SIZE,
    height: CORNER_SIZE,
    borderColor: '#fff',
    position: 'absolute',
  },
  topLeft: {
    top: 0,
    left: 0,
    borderTopWidth: CORNER_THICKNESS,
    borderLeftWidth: CORNER_THICKNESS,
  },
  topRight: {
    top: 0,
    right: 0,
    borderTopWidth: CORNER_THICKNESS,
    borderRightWidth: CORNER_THICKNESS,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: CORNER_THICKNESS,
    borderLeftWidth: CORNER_THICKNESS,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: CORNER_THICKNESS,
    borderRightWidth: CORNER_THICKNESS,
  },
});