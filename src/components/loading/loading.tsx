import React, { Component } from 'react'
import { Text, View, ActivityIndicator } from 'react-native'

export class loading extends Component {
  render() {
    return (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#0068FF" />
          <Text className="mt-4 text-gray-500">Đang xử lý...</Text>
        </View>
    )
  }
}

export default loading
