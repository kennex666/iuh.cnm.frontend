import React, {Component} from 'react'
import {Platform, Text, View} from 'react-native'
import SettingsMobile from '@/src/components/settings/SettingsMobile'
import SettingsDesktop from '@/src/components/settings/SettingsDesktop'

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
                    <SettingsDesktop/>
                ) : (
                    <SettingsMobile/>
                )}
            </View>
        )
    }
}

export default settings