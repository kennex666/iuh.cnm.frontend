import React, { Component  , useState } from 'react'
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { Text, View , Image, TextInput, ScrollView, TouchableOpacity } from 'react-native'

export default function ChatArea() {
    const [searchQuery, setSearchQuery] = useState('');
          const [selectedChat, setSelectedChat] = useState(1);
          const [message, setMessage] = useState('');
        
          const conversations = [
            {
              id: 1,
              name: 'Le Nguyen Duy Khang',
              lastMessage: 'ok ok',
              time: '05:41',
              unread: 0,
              avatar: 'https://placehold.co/48x48/random/FFFFFF/png?text=LK',
              isGroup: false,
              isOnline: true
            },
            {
              id: 2,
              name: '420300154902_17B_HK2_20242025',
              lastMessage: 'Có gì link Drive: 1. Slides & books: https://drive.google...',
              time: '11:35',
              unread: 2,
              avatar: 'https://placehold.co/48x48/0068FF/FFFFFF/png?text=G',
              isGroup: true,
              members: '81 thành viên'
            }
          ];
        
          const messages = [
            {
              id: 1,
              sender: 'Le Nguyen Duy Khang',
              content: '50',
              time: '05:42',
              reactions: ['😆', '😭'],
              isSent: true
            },
            {
              id: 2,
              sender: 'You',
              content: 'ok ok',
              time: '05:41',
              isSent: true
            },
            {
              id: 3,
              sender: 'You',
              content: 'ngủ hơi sâu',
              time: '05:41',
              isSent: true
            }
          ];
        
          const selectedConversation = conversations.find(c => c.id === selectedChat);
        
    return (
        <View className="w-[50vw] flex-1 flex-col">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <View className="h-16 px-4 border-b border-gray-200 flex-row items-center justify-between">
              <View className="flex-row items-center">
                <Image
                  source={{ uri: selectedConversation.avatar }}
                  className="w-10 h-10 rounded-full"
                />
                <View className="ml-3">
                  <Text className="font-semibold text-gray-900">
                    {selectedConversation.name}
                  </Text>
                  {selectedConversation.isGroup && (
                    <Text className="text-sm text-gray-500">
                      {selectedConversation.members}
                    </Text>
                  )}
                </View>
              </View>
              <View className="flex-row items-center space-x-4">
                <TouchableOpacity>
                  <Ionicons name="call-outline" size={22} color="#666" />
                </TouchableOpacity>
                <TouchableOpacity>
                  <Ionicons name="videocam-outline" size={22} color="#666" />
                </TouchableOpacity>
                <TouchableOpacity>
                  <Ionicons name="information-circle-outline" size={24} color="#666" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Messages Area */}
            <ScrollView className="flex-1 p-4">
              {messages.map((msg) => (
                <View
                  key={msg.id}
                  className={`flex-row items-end mb-4 ${
                    msg.sender === 'You' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {msg.sender !== 'You' && (
                    <Image
                      source={{ uri: selectedConversation.avatar }}
                      className="w-8 h-8 rounded-full mr-2"
                    />
                  )}
                  <View>
                    <View
                      className={`rounded-2xl px-4 py-2 max-w-[70%] ${
                        msg.sender === 'You' ? 'bg-blue-500' : 'bg-gray-100'
                      }`}
                    >
                      <Text
                        className={msg.sender === 'You' ? 'text-white' : 'text-gray-900'}
                      >
                        {msg.content}
                      </Text>
                    </View>
                    {/* Message Time and Reactions (if any) */}
                    {/* <View className="flex-row items-center mt-1">
                      <Text className="text-xs text-gray-500 ml-2">{msg.time}</Text>
                      {msg.reactions?.map((reaction, index) => (
                        <Text key={index} className="ml-1">{reaction}</Text>
                      ))}
                    </View> */}
                  </View>
                </View>
              ))}
            </ScrollView>

            {/* Input Area */}
            <View className="border-t border-gray-200 p-4">
              <View className="flex-row items-center">
                <TouchableOpacity className="p-2">
                  <Ionicons name="add-circle-outline" size={24} color="#666" />
                </TouchableOpacity>
                <TouchableOpacity className="p-2">
                  <Ionicons name="image-outline" size={24} color="#666" />
                </TouchableOpacity>
                <View className="flex-1 bg-gray-100 rounded-full mx-2 px-4 py-2">
                  <TextInput
                    className="flex-1 text-base text-gray-800"
                    placeholder="Nhập tin nhắn..."
                    value={message}
                    onChangeText={setMessage}
                    multiline
                    placeholderTextColor="#666"
                  />
                </View>
                <TouchableOpacity className="p-2">
                  <Ionicons name="happy-outline" size={24} color="#666" />
                </TouchableOpacity>
                <TouchableOpacity className="p-2">
                  <Ionicons name="send" size={24} color="#0068FF" />
                </TouchableOpacity>
              </View>
            </View>
          </>
        ) : (
          <View className="flex-1 items-center justify-center">
            <Text className="text-gray-500">Chọn một cuộc trò chuyện để bắt đầu</Text>
          </View>
        )}
      </View>
    )
}
