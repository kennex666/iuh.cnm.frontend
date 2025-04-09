import { router } from 'expo-router'
import React, { Component, useEffect, useState } from 'react'
import { Text, TouchableOpacity, View, Platform, ScrollView } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useAuth } from '@/src/contexts/userContext'
import SettingsMobile from '@/src/components/settings/SettingsMobile'
export class settings extends Component {
  render() {
    return (
      <View className="flex-1 bg-white">
        {/* Header */}
        <View className="flex-row items-center justify-between p-4 border-b border-gray-200">
          <Text className="text-2xl font-bold">Cài đặt</Text>
        </View>

        {/* Content */}
        {Platform.OS === 'web' ? (
          <View className="p-4">
            <Text className="text-center text-lg text-gray-600">Cài đặt trên web</Text>
          </View>
        ) : (
          <SettingsMobile />
        )}
      </View>
    )
  }
}

export default settings