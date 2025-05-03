import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';

interface PollOption {
    text: string;
    voters: string[];
}

interface PollData {
    question: string;
    options: string[];
    votes: {
        [optionIndex: string]: string[] // array of user IDs
    }
}

interface PollMessageContentProps {
    messageId: string;
    pollData: PollData;
    userId: string;
    onVote: (messageId: string, optionIndex: number) => void;
}

const PollMessageContent: React.FC<PollMessageContentProps> = ({
                                                                   messageId,
                                                                   pollData,
                                                                   userId,
                                                                   onVote
                                                               }) => {
    // Tìm xem người dùng đã bình chọn chưa
    const userVotedOptionIndex = Object.entries(pollData.votes).find(
        ([optIndex, voters]) => voters.includes(userId)
    )?.[0];

    const hasVoted = userVotedOptionIndex !== undefined;

    // Tính tổng số phiếu bầu
    const totalVotes = Object.values(pollData.votes)
        .reduce((sum, voters) => sum + voters.length, 0);

    return (
        <View className="w-full p-3 bg-white rounded-lg">
            <Text className="font-semibold text-base text-gray-800 mb-2">
                {pollData.question}
            </Text>

            <Text className="text-blue-500 text-xs mb-2">
                Đã có {totalVotes} lượt bình chọn
            </Text>

            {pollData.options.map((option, index) => {
                const votes = pollData.votes[index.toString()] || [];
                const isSelected = votes.includes(userId);
                const percentage = totalVotes > 0
                    ? Math.round((votes.length / totalVotes) * 100)
                    : 0;

                return (
                    <TouchableOpacity
                        key={index}
                        className={`mb-2 p-3 rounded-md ${isSelected ? 'bg-blue-100' : 'bg-gray-100'}`}
                        onPress={() => onVote(messageId, index)}
                        disabled={hasVoted && !isSelected}
                    >
                        <View className="flex-row justify-between items-center">
                            <Text className={isSelected ? 'text-blue-700' : 'text-gray-800'}>
                                {option}
                            </Text>
                            <Text className="text-gray-500">{votes.length}</Text>
                        </View>
                    </TouchableOpacity>
                );
            })}

            <TouchableOpacity
                className="mt-2 py-2 bg-white border border-gray-200 rounded-md items-center"
            >
                <Text className="text-blue-500">Xem lựa chọn</Text>
            </TouchableOpacity>
        </View>
    );
};

export default PollMessageContent;