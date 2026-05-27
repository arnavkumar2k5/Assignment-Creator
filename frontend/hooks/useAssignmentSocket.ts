'use client';
import { useEffect, useRef } from 'react';
import { getSocket, joinAssignmentRoom, leaveAssignmentRoom } from '@/services/socket';
import { useAssignmentStore } from '@/store/assignmentStore';
import { SocketEvent } from '@/types';
import toast from 'react-hot-toast';

export const useAssignmentSocket = (assignmentId: string | null) => {
  const { updateAssignmentStatus } = useAssignmentStore();
  const socketRef = useRef(getSocket());

  useEffect(() => {
    if (!assignmentId) return;

    const socket = socketRef.current;
    joinAssignmentRoom(assignmentId);

    const onProcessing = (event: SocketEvent) => {
      updateAssignmentStatus(event.assignmentId, { status: 'processing' });
      toast.loading('Generating your question paper...', { id: 'generating' });
    };

    const onCompleted = (event: SocketEvent) => {
      if (event.data) {
        updateAssignmentStatus(event.assignmentId, event.data);
      }
      toast.success('Question paper generated!', { id: 'generating' });
    };

    const onFailed = (event: SocketEvent) => {
      updateAssignmentStatus(event.assignmentId, { status: 'failed', error: event.error });
      toast.error(`Generation failed: ${event.error}`, { id: 'generating' });
    };

    socket.on('assignment-processing', onProcessing);
    socket.on('assignment-completed', onCompleted);
    socket.on('assignment-failed', onFailed);

    return () => {
      leaveAssignmentRoom(assignmentId);
      socket.off('assignment-processing', onProcessing);
      socket.off('assignment-completed', onCompleted);
      socket.off('assignment-failed', onFailed);
    };
  }, [assignmentId, updateAssignmentStatus]);
};
