import React, {useState} from 'react'
import {ScrollView, Text, TextInput, TouchableOpacity, View} from 'react-native'
import {Ionicons} from '@expo/vector-icons';

interface EmojiPickerProps {
    setMessage: React.Dispatch<React.SetStateAction<string>>;
    toggleModelEmoji: () => void;
}

const CATEGORIES = [
    {
        icon: "😊",
        name: "Smileys & People",
        emojis: [
            "😀", "😃", "😄", "😁", "😅", "😂", "🤣", "😊",
            "😇", "🙂", "🙃", "😉", "😌", "😍", "🥰", "😘",
            "😗", "😙", "😚", "😋", "😛", "😝", "😜", "🤪",
            "🤨", "🧐", "🤓", "😎", "🤩", "🥳", "😏", "😒"
        ]
    },
    {
        icon: "🐱",
        name: "Animals & Nature",
        emojis: [
            "🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼",
            "🐨", "🐯", "🦁", "🐮", "🐷", "🐸", "🐵", "🐔"
        ]
    },
    {
        icon: "🍎",
        name: "Food & Drink",
        emojis: [
            "🍎", "🍐", "🍊", "🍋", "🍌", "🍉", "🍇", "🍓",
            "🍈", "🍒", "🍑", "🥭", "🍍", "🥥", "🥝", "🍅"
        ]
    },
    {
        icon: "⚽",
        name: "Activities",
        emojis: [
            "⚽", "🏀", "🏈", "⚾", "🥎", "🎾", "🏐", "🏉",
            "🎱", "🏓", "🏸", "🏒", "🏑", "🥍", "🏏", "⛳"
        ]
    },
    {
        icon: "🚗",
        name: "Travel & Places",
        emojis: [
            "🚗", "🚕", "🚙", "🚌", "🚎", "🏎", "🚓", "🚑",
            "🚒", "🚐", "🛻", "🚚", "🚛", "🚜", "🛵", "🏍"
        ]
    }
];

export default function EmojiPicker({setMessage, toggleModelEmoji}: EmojiPickerProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(0);

    // Filter emojis based on search query folowing the selected category
    const filteredEmojis = searchQuery ? CATEGORIES[selectedCategory].emojis.filter(emoji => emoji.includes(searchQuery)) : CATEGORIES[selectedCategory].emojis;
    return (
        <View className="bg-white">
            {/* Search Bar */}
            <View className="p-2 border-b border-gray-200">
                <View className="flex-row items-center bg-gray-100 rounded-full px-3 py-1">
                    <Ionicons name="search-outline" size={16} color="#666"/>
                    <TextInput
                        className="flex-1 ml-2 text-base text-gray-800"
                        placeholder="Search emoji"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        placeholderTextColor="#666"
                    />
                </View>
            </View>

            {/* Emoji Content */}
            <View className="h-[300px]">
                {/* Category Title */}
                {!searchQuery && (
                    <Text className="px-3 py-2 font-semibold text-gray-700">
                        {CATEGORIES[selectedCategory].name}
                    </Text>
                )}

                {/* Emojis Grid */}
                <ScrollView className="flex-1">
                    <View className="flex-row flex-wrap px-2">
                        {filteredEmojis.map((emoji, index) => (
                            <TouchableOpacity
                                key={index}
                                className="w-1/5 p-2 items-center"
                                onPress={() => {
                                    setMessage(prev => prev + emoji);
                                    toggleModelEmoji();
                                }}
                            >
                                <Text className="text-2xl">{emoji}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </ScrollView>

                {/* Bottom Categories */}
                <View className="flex-row justify-between px-2 py-1 border-t border-gray-200">
                    {CATEGORIES.map((category, index) => (
                        <TouchableOpacity
                            key={index}
                            className={`p-2 rounded-lg ${selectedCategory === index ? 'bg-gray-200' : ''}`}
                            onPress={() => setSelectedCategory(index)}
                        >
                            <Text className="text-xl">{category.icon}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        </View>
    );
}
