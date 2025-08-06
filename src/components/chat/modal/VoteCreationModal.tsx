import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface VoteCreationModalProps {
  visible: boolean;
  onClose: () => void;
  onCreateVote: (question: string, options: string[], allowMultiple: boolean) => void;
}

const VoteCreationModal: React.FC<VoteCreationModalProps> = ({
  visible,
  onClose,
  onCreateVote
}) => {
  const [voteQuestion, setVoteQuestion] = useState('');
  const [voteOptions, setVoteOptions] = useState(['', '']);
  const [allowMultipleVotes, setAllowMultipleVotes] = useState(false);

  const addVoteOption = () => {
    setVoteOptions([...voteOptions, '']);
  };

  const handleVoteOptionChange = (index: number, value: string) => {
    const newOptions = [...voteOptions];
    newOptions[index] = value;
    setVoteOptions(newOptions);
  };

  const handleSubmit = () => {
    // Check for valid data
    if (!voteQuestion.trim()) {
      return;
    }

    // Filter out empty options
    const filteredOptions = voteOptions.filter(opt => opt.trim());

    if (filteredOptions.length < 2) {
      return;
    }

    onCreateVote(voteQuestion, filteredOptions, allowMultipleVotes);

    // Reset the form
    setVoteQuestion('');
    setVoteOptions(['', '']);
    setAllowMultipleVotes(false);
  };

  if (!visible) return null;

  return (
    <View className="absolute inset-0 bg-black/60 z-50 flex items-center justify-center">
      <View className="bg-white rounded-2xl p-5 w-[90%] max-w-md">
        <View className="flex-row justify-between items-center mb-6">
          <Text className="text-xl font-semibold">Tạo bình chọn</Text>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Vote Question */}
        <View className="mb-5">
          <Text className="text-gray-500 mb-2">Chủ đề bình chọn</Text>
          <TextInput
            className="border border-gray-300 rounded-lg p-3 min-h-[45px] text-base"
            placeholder="Đặt câu hỏi bình chọn"
            value={voteQuestion}
            onChangeText={setVoteQuestion}
            multiline
            maxLength={200}
          />
          <Text className="text-right text-gray-500 mt-1">{voteQuestion.length}/200</Text>
        </View>

        {/* Vote Options */}
        <View className="mb-5">
          <Text className="text-gray-500 mb-2">Các lựa chọn</Text>
          {voteOptions.map((option, index) => (
            <TextInput
              key={`option-${index}`}
              className="border border-gray-300 rounded-lg p-3 mb-3 min-h-[45px] text-base"
              placeholder={`Lựa chọn ${index + 1}`}
              value={option}
              onChangeText={(text) => handleVoteOptionChange(index, text)}
            />
          ))}

          {/* Add option button */}
          <TouchableOpacity
            className="flex-row items-center"
            onPress={addVoteOption}
          >
            <Ionicons name="add-circle-outline" size={24} color="#3B82F6" />
            <Text className="ml-2 text-blue-500">Thêm lựa chọn</Text>
          </TouchableOpacity>
        </View>

        <View className="flex-row items-center mb-5">
          <Switch
            value={allowMultipleVotes}
            onValueChange={setAllowMultipleVotes}
            trackColor={{ false: "#d1d5db", true: "#bfdbfe" }}
            thumbColor={allowMultipleVotes ? "#3B82F6" : "#9ca3af"}
          />
          <Text className="ml-2 text-gray-700">Cho phép chọn nhiều lựa chọn</Text>
        </View>

        {/* Footer buttons */}
        <View className="flex-row justify-end mt-2">
          <TouchableOpacity
            className="px-5 py-2 mr-2 rounded-lg bg-gray-100"
            onPress={onClose}
          >
            <Text className="font-medium text-gray-700">Hủy</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="px-5 py-2 rounded-lg bg-blue-500"
            onPress={handleSubmit}
          >
            <Text className="font-medium text-white">Tạo bình chọn</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default VoteCreationModal;