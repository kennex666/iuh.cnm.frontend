import React, {useEffect, useState, useCallback} from 'react';
import {
    ActivityIndicator,
    Image,
    Modal,
    ScrollView, 
    Text,
    TextInput, 
    TouchableOpacity, 
    View
} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import SocketService from '@/src/api/services/SocketService';
import { UserService } from '@/src/api/services/UserService';
import { useUser } from '@/src/contexts/user/UserContext';

interface VoteOption {
    id: string;
    text: string;
    votes: string[];
}

interface VoteData {
    question: string;
    options: VoteOption[];
    multiple: boolean;
}

interface VoteMessageContentProps {
    messageId: string;
    voteData: VoteData | string;
    userId: string;
    conversationId: string;
}

interface UserInfoWithAvatar {
    id: string;
    name: string;
    avatar?: string;
    avatarURL?: string;
}

const VoteMessageContent: React.FC<VoteMessageContentProps> = ({
    messageId,
    voteData,
    userId,
    conversationId
}) => {
    const [vote, setVote] = useState<VoteData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [userVoted, setUserVoted] = useState<boolean>(false);
    const [showVotersList, setShowVotersList] = useState<boolean>(false);
    const [showAddOption, setShowAddOption] = useState<boolean>(false);
    const [newOptionText, setNewOptionText] = useState<string>('');
    const [optionUsers, setOptionUsers] = useState<{[optionId: string]: UserInfoWithAvatar[]}>({});
    const [selectedOptionForVoters, setSelectedOptionForVoters] = useState<VoteOption | null>(null);
    const [votersListLoading, setVotersListLoading] = useState(false);
    const [activeOptionId, setActiveOptionId] = useState<string | null>(null);
    
    const { user } = useUser();
    const socketService = SocketService.getInstance();
    
    // Determine if the current user is an admin or moderator
    const isAdminOrMod = true; // This should be determined based on user role in the conversation

    useEffect(() => {
        // Parse vote data if it's a string
        if (typeof voteData === 'string') {
            try {
                const parsedData = JSON.parse(voteData);
                setVote(parsedData);
            } catch (err) {
                console.error('Error parsing vote data:', err);
                setError('Invalid vote data');
            }
        } else {
            setVote(voteData);
        }

        // Check if user has already voted
        if (vote) {
            const hasVoted = vote.options.some(option =>
                option.votes && option.votes.includes(userId)
            );
            setUserVoted(hasVoted);
        }

        // Set up socket listeners
        const handleVoteUpdated = (data: { conversationId: string, vote: any }) => {
            if (data.vote.id === messageId) {
                console.log('Vote updated:', data.vote);
                try {
                    const updatedVote = typeof data.vote.content === 'string'
                        ? JSON.parse(data.vote.content)
                        : data.vote.content;
                    setVote(updatedVote);

                    // Check if user has voted
                    const hasVoted = updatedVote.options.some((option: VoteOption) =>
                        option.votes && option.votes.includes(userId)
                    );
                    setUserVoted(hasVoted);

                    setLoading(false);
                } catch (err) {
                    console.error('Error parsing updated vote data:', err);
                    setLoading(false);
                }
            }
        };

        socketService.onVoteUpdated(handleVoteUpdated);
        socketService.onVoteResult(handleVoteUpdated); // Reuse the same handler

        // Request the latest vote data
        socketService.getVote({conversationId, voteId: messageId});

        return () => {
            socketService.removeVoteUpdatedListener(handleVoteUpdated);
            socketService.removeVoteResultListener(handleVoteUpdated);
        };
    }, [messageId, conversationId, userId]);

    // Load voter information when showing the voters list
    const loadVoterInfo = useCallback(async (option: VoteOption) => {
        setVotersListLoading(true);
        setSelectedOptionForVoters(option);
        
        try {
            const users: UserInfoWithAvatar[] = [];
            
            // Fetch user info for each voter in parallel
            const promises = option.votes.map(async (voterId) => {
                try {
                    const response = await UserService.getUserById(voterId);
                    if (response.success && response.user) {
                        return {
                            id: response.user.id,
                            name: response.user.name,
                            avatarURL: response.user.avatarURL
                        };
                    }
                    return null;
                } catch (error) {
                    console.error(`Error fetching user ${voterId}:`, error);
                    return null;
                }
            });
            
            const fetchedUsers = await Promise.all(promises);
            const validUsers = fetchedUsers.filter(u => u !== null) as UserInfoWithAvatar[];
            
            // Update the state with the fetched voter information
            setOptionUsers(prev => ({
                ...prev,
                [option.id]: validUsers
            }));
            
        } catch (error) {
            console.error("Error loading voter information:", error);
        } finally {
            setVotersListLoading(false);
        }
    }, []);

    const handleVote = (optionId: string) => {
        setLoading(true);
        socketService.submitVote({
            conversationId,
            voteId: messageId,
            optionId
        });
    };

    const handleAddOption = () => {
        if (!newOptionText.trim()) return;
        
        socketService.addVoteOption({
            messageId,
            optionText: newOptionText.trim()
        });
        
        setNewOptionText('');
        setShowAddOption(false);
    };

    const handleRemoveOption = (optionId: string) => {
        socketService.removeVoteOption({
            messageId,
            optionId
        });
    };

    const getTotalVotes = () => {
        if (!vote) return 0;
        
        // For multiple-choice polls, count each vote separately
        if (vote.multiple) {
            return vote.options.reduce((total, option) => 
                total + (option.votes ? option.votes.length : 0), 0
            );
        }
        
        // For single-choice polls, count unique voters
        const uniqueVoters = new Set<string>();
        vote.options.forEach(option => {
            if (option.votes) {
                option.votes.forEach(voterId => uniqueVoters.add(voterId));
            }
        });
        return uniqueVoters.size;
    };

    // Calculate percentage for each option
    const getPercentage = (votes: number) => {
        const total = getTotalVotes();
        if (total === 0) return 0;
        return Math.round((votes / total) * 100);
    };

    const showVoters = (option: VoteOption) => {
        loadVoterInfo(option);
        setShowVotersList(true);
    };

    if (error) {
        return (
            <View className="bg-red-50 p-4 rounded-lg">
                <Text className="text-red-500">Error: {error}</Text>
            </View>
        );
    }

    if (!vote) {
        return (
            <View className="p-4 items-center">
                <ActivityIndicator color="#3B82F6"/>
            </View>
        );
    }

    const totalVotes = getTotalVotes();

    return (
        <View className="w-full p-3 rounded-lg bg-gray-50">
            <Text className="font-medium text-base mb-3">{vote.question}</Text>

            {vote.options.map((option, index) => {
                const votesCount = option.votes ? option.votes.length : 0;
                const percentage = getPercentage(votesCount);
                const isSelected = option.votes && option.votes.includes(userId);

                return (
                    <View key={option.id || index} className="mb-2">
                        <TouchableOpacity
                            onPress={() => handleVote(option.id)}
                            disabled={loading}
                            className={`rounded-lg overflow-hidden border ${
                                isSelected ? 'border-blue-500' : 'border-gray-200'
                            }`}
                        >
                            <View className="relative w-full">
                                {/* Background progress bar */}
                                <View
                                    className={`absolute top-0 left-0 h-full ${
                                        isSelected ? 'bg-blue-100' : 'bg-gray-100'
                                    }`}
                                    style={{width: `${percentage}%`}}
                                />

                                {/* Option content */}
                                <View className="flex-row justify-between items-center p-3 z-10">
                                    <View className="flex-row items-center flex-1">
                                        {isSelected && (
                                            <Ionicons name="checkmark-circle" size={18} color="#3B82F6" className="mr-2"/>
                                        )}
                                        <Text className={`${isSelected ? 'font-medium' : ''}`}>{option.text}</Text>
                                    </View>

                                    <View className="flex-row items-center">
                                        <Text className="text-gray-500 text-sm mr-2">{percentage}% ({votesCount})</Text>
                                        
                                        {/* Option actions */}
                                        <TouchableOpacity 
                                            onPress={() => showVoters(option)}
                                            className="mr-1 p-1"
                                        >
                                            <Ionicons name="people-outline" size={16} color="#666"/>
                                        </TouchableOpacity>
                                        
                                        {isAdminOrMod && (
                                            <TouchableOpacity
                                                onPress={() => handleRemoveOption(option.id)}
                                                className="p-1"
                                                hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
                                            >
                                                <Ionicons name="close-circle-outline" size={16} color="#666"/>
                                            </TouchableOpacity>
                                        )}
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>
                );
            })}

            <View className="flex-row justify-between items-center mt-3">
                <Text className="text-gray-500 text-sm">
                    {totalVotes} {totalVotes === 1 ? 'vote' : 'votes'}
                    {vote.multiple && <Text> · Multiple choices allowed</Text>}
                </Text>
                
                {isAdminOrMod && (
                    <TouchableOpacity
                        onPress={() => setShowAddOption(true)}
                        className="flex-row items-center bg-blue-50 px-3 py-1 rounded-full"
                    >
                        <Ionicons name="add-circle-outline" size={16} color="#3B82F6"/>
                        <Text className="text-blue-500 text-sm ml-1">Add option</Text>
                    </TouchableOpacity>
                )}
            </View>

            {/* Add Option Modal */}
            <Modal
                visible={showAddOption}
                transparent
                animationType="fade"
                onRequestClose={() => setShowAddOption(false)}
            >
                <View className="flex-1 bg-black/30 justify-center items-center p-4">
                    <View className="bg-white rounded-xl w-full max-w-md p-4 shadow-lg">
                        <Text className="text-lg font-semibold mb-3">Add New Option</Text>
                        
                        <TextInput
                            className="border border-gray-300 rounded-lg p-3 mb-4"
                            placeholder="Enter option text"
                            value={newOptionText}
                            onChangeText={setNewOptionText}
                            autoFocus
                        />
                        
                        <View className="flex-row justify-end">
                            <TouchableOpacity
                                onPress={() => setShowAddOption(false)}
                                className="px-4 py-2 mr-2"
                            >
                                <Text className="text-gray-600">Cancel</Text>
                            </TouchableOpacity>
                            
                            <TouchableOpacity
                                onPress={handleAddOption}
                                disabled={!newOptionText.trim()}
                                className={`px-4 py-2 rounded-lg ${
                                    newOptionText.trim() ? 'bg-blue-500' : 'bg-blue-300'
                                }`}
                            >
                                <Text className="text-white">Add</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Voters List Modal */}
            <Modal
                visible={showVotersList}
                transparent
                animationType="slide"
                onRequestClose={() => setShowVotersList(false)}
            >
                <View className="flex-1 bg-black/30 justify-end">
                    <View className="bg-white rounded-t-xl w-full max-h-[70%] shadow-lg">
                        <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
                            <Text className="text-lg font-semibold">
                                Voters for "{selectedOptionForVoters?.text}"
                            </Text>
                            
                            <TouchableOpacity
                                onPress={() => setShowVotersList(false)}
                                hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
                            >
                                <Ionicons name="close" size={24} color="#666"/>
                            </TouchableOpacity>
                        </View>
                        
                        {votersListLoading ? (
                            <View className="p-4 items-center">
                                <ActivityIndicator color="#3B82F6"/>
                                <Text className="mt-2 text-gray-500">Loading voters...</Text>
                            </View>
                        ) : (
                            <ScrollView className="p-2 max-h-[500px]">
                                {selectedOptionForVoters && optionUsers[selectedOptionForVoters.id]?.length > 0 ? (
                                    optionUsers[selectedOptionForVoters.id].map((voter) => (
                                        <View 
                                            key={voter.id} 
                                            className="flex-row items-center p-3 border-b border-gray-100"
                                        >
                                            <Image
                                                source={{
                                                    uri: voter.avatarURL || 
                                                        `https://ui-avatars.com/api/?name=${encodeURIComponent(voter.name)}&background=0068FF&color=fff`
                                                }}
                                                className="w-10 h-10 rounded-full mr-3"
                                                resizeMode="cover"
                                            />
                                            <Text className="text-gray-800 font-medium">{voter.name}</Text>
                                        </View>
                                    ))
                                ) : (
                                    <View className="p-4 items-center">
                                        <Text className="text-gray-500">No voters for this option</Text>
                                    </View>
                                )}
                            </ScrollView>
                        )}
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default VoteMessageContent;