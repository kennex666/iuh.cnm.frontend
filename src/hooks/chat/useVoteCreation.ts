import { useState } from 'react';
import SocketService from '@/src/api/services/SocketService';

export const useVoteCreation = (conversationId: string | undefined) => {
  const [showVoteModal, setShowVoteModal] = useState(false);

  const socketService = SocketService.getInstance();

  const toggleVoteModal = () => {
    setShowVoteModal(!showVoteModal);
  };

  const handleCreateVote = (question: string, options: string[], allowMultiple: boolean) => {
    if (!conversationId) return;

    // Validate the vote data
    if (!question.trim() || options.length < 2) {
      return;
    }

    // Send the vote creation request to server
    socketService.createVote({
      conversationId,
      question,
      options,
      multiple: allowMultiple,
    });

    // Close the modal after sending
    setShowVoteModal(false);
  };

  return {
    showVoteModal,
    toggleVoteModal,
    handleCreateVote,
  };
};