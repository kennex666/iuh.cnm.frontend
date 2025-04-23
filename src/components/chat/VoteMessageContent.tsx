import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import SocketService from '@/src/api/services/SocketService';

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
  const socketService = SocketService.getInstance();

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
        } catch (err) {
          console.error('Error parsing updated vote data:', err);
        }
      }
    };

    const handleVoteResult = (data: { conversationId: string, vote: any }) => {
      if (data.vote.id === messageId) {
        console.log('Vote result:', data.vote);
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
        } catch (err) {
          console.error('Error parsing vote result data:', err);
        }
      }
    };

    const handleVoteError = (error: { message: string }) => {
      setError(error.message);
      setLoading(false);
    };

    socketService.onVoteUpdated(handleVoteUpdated);
    socketService.onVoteResult(handleVoteResult);
    socketService.onVoteError(handleVoteError);

    // Request the latest vote data
    socketService.getVote({ conversationId, voteId: messageId });

    return () => {
      socketService.removeVoteUpdatedListener(handleVoteUpdated);
      socketService.removeVoteResultListener(handleVoteResult);
      socketService.removeVoteErrorListener(handleVoteError);
    };
  }, [messageId, conversationId]);

  const handleVote = (optionId: string) => {
    if (userVoted) return; // Prevent voting again
    
    setLoading(true);
    socketService.submitVote({
      conversationId,
      voteId: messageId,
      optionId
    });
  };

  const getTotalVotes = () => {
    if (!vote) return 0;
    return vote.options.reduce((total, option) => 
      total + (option.votes ? option.votes.length : 0), 0
    );
  };

  // Calculate percentage for each option
  const getPercentage = (votes: number) => {
    const total = getTotalVotes();
    if (total === 0) return 0;
    return Math.round((votes / total) * 100);
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
        <ActivityIndicator color="#3B82F6" />
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
          <TouchableOpacity
            key={option.id || index}
            onPress={() => handleVote(option.id)}
            disabled={userVoted || loading}
            className={`mb-2 rounded-lg overflow-hidden border ${
              isSelected ? 'border-blue-500' : 'border-gray-200'
            }`}
          >
            <View className="relative w-full">
              {/* Background progress bar */}
              <View
                className={`absolute top-0 left-0 h-full ${
                  isSelected ? 'bg-blue-100' : 'bg-gray-100'
                }`}
                style={{ width: `${percentage}%` }}
              />
              
              {/* Option content */}
              <View className="flex-row justify-between items-center p-3 z-10">
                <View className="flex-row items-center flex-1">
                  {isSelected && (
                    <Ionicons name="checkmark-circle" size={18} color="#3B82F6" className="mr-2" />
                  )}
                  <Text className={`${isSelected ? 'font-medium' : ''}`}>{option.text}</Text>
                </View>
                
                {userVoted && (
                  <Text className="text-gray-500 text-sm">{percentage}% ({votesCount})</Text>
                )}
              </View>
            </View>
          </TouchableOpacity>
        );
      })}
      
      <Text className="text-gray-500 text-sm mt-2">
        {totalVotes} {totalVotes === 1 ? 'vote' : 'votes'}
      </Text>
    </View>
  );
};

export default VoteMessageContent;