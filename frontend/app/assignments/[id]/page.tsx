'use client';

import { use, useEffect } from 'react';
import Link from 'next/link';
import { useAssignmentStore } from '@/store/assignmentStore';
import { useAssignmentSocket } from '@/hooks/useAssignmentSocket';
import AssignmentOutput from '@/components/assignment/AssignmentOutput';
import ProcessingState from '@/components/assignment/ProcessingState';
import VedaShell from '@/components/VedaShell';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function AssignmentPage({ params }: PageProps) {
  const { id } = use(params);
  const { currentAssignment, fetchAssignment, isLoading } = useAssignmentStore();

  useAssignmentSocket(id);

  useEffect(() => {
    if (!currentAssignment || currentAssignment._id !== id) {
      fetchAssignment(id);
    }
  }, [currentAssignment, fetchAssignment, id]);

  const status = currentAssignment?.status;
  const isProcessing = status === 'pending' || status === 'processing';

  return (
    <VedaShell active="toolkit" topTitle="Create New" backHref="/create" floatingCreate={false}>
      {isLoading && !currentAssignment ? (
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#777] border-t-transparent" />
        </div>
      ) : !currentAssignment ? (
        <div className="mx-auto max-w-lg py-24 text-center">
          <h1 className="mb-3 text-2xl font-extrabold">Assignment not found</h1>
          <Link href="/create" className="dark-button min-h-12 px-6">
            Create New Assignment
          </Link>
        </div>
      ) : isProcessing ? (
        <ProcessingState assignment={currentAssignment} />
      ) : status === 'failed' ? (
        <div className="mx-auto max-w-lg py-24 text-center">
          <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-full bg-red-100 text-3xl font-black text-red-500">x</div>
          <h1 className="mb-2 text-2xl font-extrabold">Generation Failed</h1>
          <p className="mb-6 text-[#666]">{currentAssignment.error || 'An unexpected error occurred.'}</p>
          <Link href="/create" className="dark-button min-h-12 px-6">
            Try Again
          </Link>
        </div>
      ) : (
        <AssignmentOutput assignment={currentAssignment} />
      )}
    </VedaShell>
  );
}
