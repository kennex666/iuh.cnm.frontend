import React, {useState} from 'react'
import {
    Image,
    ImageSourcePropType,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    useWindowDimensions,
    View
} from 'react-native'
import {Ionicons} from '@expo/vector-icons';
import {shadows} from '@/src/styles/shadow';

interface Category {
    id: string;
    icon: string;
    name: string;
    color: string;
    stickers: {
        [key: string]: ImageSourcePropType;
    };
}

interface StickerPickerProps {
    setMessage: React.Dispatch<React.SetStateAction<string>>;
    toggleModelSticker: () => void;
}

const STICKER_CATEGORIES = [
    {
        id: 'Pets',
        icon: '🐾',
        name: 'Pets',
        color: '#FFB6C1', // Light Pink
        stickers: {
            adopt: require('@/resources/assets/stickers/pets/adopt.png'),
            bath: require('@/resources/assets/stickers/pets/bath.png'),
            cat: require('@/resources/assets/stickers/pets/cat.png'),
            dog: require('@/resources/assets/stickers/pets/dog.png'),
            pet_food: require('@/resources/assets/stickers/pets/pet_food.png'),
            good_morning: require('@/resources/assets/stickers/pets/good_morning.png'),
            have_a_nice_day: require('@/resources/assets/stickers/pets/have_a_nice_day.png'),
        }
    },
    {
        id: 'Christmas',
        icon: '🎄',
        name: 'Christmas',
        color: '#FF4500', // Orange Red
        stickers: {
            adopt: require('@/resources/assets/stickers/pets/adopt.png'),
            bath: require('@/resources/assets/stickers/pets/bath.png'),
            cat: require('@/resources/assets/stickers/pets/cat.png'),
            dog: require('@/resources/assets/stickers/pets/dog.png'),
            pet_food: require('@/resources/assets/stickers/pets/pet_food.png'),
            good_morning: require('@/resources/assets/stickers/pets/good_morning.png'),
            have_a_nice_day: require('@/resources/assets/stickers/pets/have_a_nice_day.png'),
        }
    },
    {
        id: 'Home',
        icon: '🏡',
        name: 'Home',
        color: '#FFD700', // Gold
        stickers: {
            adopt: require('@/resources/assets/stickers/pets/adopt.png'),
            bath: require('@/resources/assets/stickers/pets/bath.png'),
            cat: require('@/resources/assets/stickers/pets/cat.png'),
            dog: require('@/resources/assets/stickers/pets/dog.png'),
            pet_food: require('@/resources/assets/stickers/pets/pet_food.png'),
            good_morning: require('@/resources/assets/stickers/pets/good_morning.png'),
            have_a_nice_day: require('@/resources/assets/stickers/pets/have_a_nice_day.png'),
        }
    },
    {
        id: 'Love',
        icon: '❤️',
        name: 'Love',
        color: '#FF69B4', // Hot Pink
        stickers: {
            adopt: require('@/resources/assets/stickers/pets/adopt.png'),
            bath: require('@/resources/assets/stickers/pets/bath.png'),
            cat: require('@/resources/assets/stickers/pets/cat.png'),
            dog: require('@/resources/assets/stickers/pets/dog.png'),
            pet_food: require('@/resources/assets/stickers/pets/pet_food.png'),
            good_morning: require('@/resources/assets/stickers/pets/good_morning.png'),
            have_a_nice_day: require('@/resources/assets/stickers/pets/have_a_nice_day.png'),
        }
    },
    {
        id: 'celebrating',
        icon: '🎉',
        name: 'Celebrating',
        color: '#90EE90', // Light Green
        stickers: {
            adopt: require('@/resources/assets/stickers/pets/adopt.png'),
            bath: require('@/resources/assets/stickers/pets/bath.png'),
            cat: require('@/resources/assets/stickers/pets/cat.png'),
            dog: require('@/resources/assets/stickers/pets/dog.png'),
            pet_food: require('@/resources/assets/stickers/pets/pet_food.png'),
            good_morning: require('@/resources/assets/stickers/pets/good_morning.png'),
            have_a_nice_day: require('@/resources/assets/stickers/pets/have_a_nice_day.png'),
        }
    },
    {
        id: 'active',
        icon: '⚡',
        name: 'Active',
        color: '#87CEEB', // Sky Blue
        stickers: {
            adopt: require('@/resources/assets/stickers/pets/adopt.png'),
            bath: require('@/resources/assets/stickers/pets/bath.png'),
            cat: require('@/resources/assets/stickers/pets/cat.png'),
            dog: require('@/resources/assets/stickers/pets/dog.png'),
            pet_food: require('@/resources/assets/stickers/pets/pet_food.png'),
            good_morning: require('@/resources/assets/stickers/pets/good_morning.png'),
            have_a_nice_day: require('@/resources/assets/stickers/pets/have_a_nice_day.png'),
        }
    },
];

const STICKER_SIZE = 70; // Tăng kích thước sticker
const STICKER_SPACING = 12; // Tăng khoảng cách giữa các sticker

export default function StickerPicker({setMessage, toggleModelSticker}: StickerPickerProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const {width} = useWindowDimensions();

    // Tính toán kích thước container dựa trên màn hình
    const containerWidth = Math.min(width * 0.9, 400); // Giới hạn max width là 400px

    const filteredCategories = STICKER_CATEGORIES.filter(category =>
        category.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Chia categories thành 2 cột
    const leftColumn = filteredCategories.filter((_, i) => i % 2 === 0);
    const rightColumn = filteredCategories.filter((_, i) => i % 2 === 1);

    const renderCategoryButton = (category: Category) => (
        <TouchableOpacity
            key={category.id}
            className="mb-2 px-3 py-2 rounded-lg flex-1"
            style={{backgroundColor: category.color + '15'}}
            onPress={() => setSelectedCategory(category)}
        >
            <View className="flex-row items-center justify-start space-x-2">
                <Text className="text-base">{category.icon}</Text>
                <Text className="text-sm font-medium text-gray-700" numberOfLines={1}>
                    {category.name}
                </Text>
            </View>
        </TouchableOpacity>
    );

    const renderStickers = () => {
        if (!selectedCategory) return null;

        return (
            <View className="p-2">
                <View className="flex-row items-center mb-3">
                    <TouchableOpacity
                        onPress={() => setSelectedCategory(null)}
                        className="mr-2"
                    >
                        <Ionicons name="arrow-back" size={20} color="#666"/>
                    </TouchableOpacity>
                    <Text className="text-base font-medium text-gray-800">{selectedCategory.name}</Text>
                </View>
                <View className="flex-row flex-wrap justify-between">
                    {Object.entries(selectedCategory.stickers).map(([key, path], index) => (
                        <TouchableOpacity
                            key={key}
                            style={{
                                width: STICKER_SIZE,
                                height: STICKER_SIZE,
                                margin: STICKER_SPACING / 2,
                            }}
                            onPress={() => {
                                setMessage(prev => prev + `[sticker:${key}]`);
                                toggleModelSticker();
                            }}
                        >
                            <Image
                                source={path}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                }}
                                resizeMode="contain"
                            />
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        );
    };

    return (
        <View 
            style={{
                width: containerWidth,
                backgroundColor: 'white',
                borderRadius: 8,
                ...shadows.lg
            }}>
            {/* Search Bar - Chỉ hiển thị khi không có category được chọn */}
            {!selectedCategory && (
                <View className="p-2 border-b border-gray-200">
                    <View className="flex-row items-center bg-gray-100 rounded-lg px-2 py-1">
                        <Ionicons name="search-outline" size={14} color="#666"/>
                        <TextInput
                            className="flex-1 ml-2 text-sm text-gray-800"
                            placeholder="Search"
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            placeholderTextColor="#666"
                        />
                    </View>
                </View>
            )}

            {/* Content */}
            <ScrollView className="max-h-[300px]">
                {selectedCategory ? renderStickers() : (
                    <View className="p-2">
                        <View className="flex-row space-x-2">
                            <View className="flex-1 space-y-2">
                                {leftColumn.map(renderCategoryButton)}
                            </View>
                            <View className="flex-1 space-y-2">
                                {rightColumn.map(renderCategoryButton)}
                            </View>
                        </View>
                    </View>
                )}
            </ScrollView>
        </View>
    );
} 