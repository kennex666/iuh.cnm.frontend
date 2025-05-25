import React, { Component } from 'react'
import { Text, View } from 'react-native'

export default class miniapp extends Component {
  render() {
    return (
      <View className='flex-1 bg-white px-6 pt-14'>
        <Text className='text-3xl font-extrabold text-gray-900 mb-8'> 
            miniapp
        </Text>
      </View>
    )
  }
}
