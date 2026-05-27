'use client';
import { useEffect, use } from 'react';
import { useAssignmentStore } from '@/store/assignmentStore';
import { useAssignmentSocket } from '@/hooks/useAssignmentSocket';
import AssignmentOutput from '@/components/assignment/AssignmentOutput';
import ProcessingState from '@/components/assignment/ProcessingState';
import Link from 'next/link';
import { BookOpen, ArrowLeft } from 'lucide-react';

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
  }, [id]);

  const status = currentAssignment?.status;
  const isProcessing = status === 'pending' || status === 'processing';

  return (
    <div className="min-h-screen bg-paper">
      {/* Header */}
      <header className="bg-ink sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center gap-4">
          <Link href="/create" className="flex items-center gap-2 text-paper/60 hover:text-paper transition-colors">
            <ArrowLeft size={18} />
            <span className="text-sm font-sans">New Paper</span>
          </Link>
          <div className="h-5 w-px bg-paper/20" />
          <div className="flex items-center gap-2">
            <BookOpen size={18} className="text-accent" />
            <span className="font-display font-bold text-paper">AssessAI</span>
          </div>
          {currentAssignment && (
            <div className="ml-auto text-paper/40 text-sm font-sans hidden sm:block truncate max-w-xs">
              {currentAssignment.title}
            </div>
          )}
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        {isLoading && !currentAssignment ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-10 h-10 border-2 border-ink/20 border-t-accent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-ink/40 font-sans text-sm">Loading...</p>
            </div>
          </div>
        ) : !currentAssignment ? (
          <div className="text-center py-24">
            <p className="text-ink/40 text-lg mb-4">Assignment not found</p>
            <Link href="/create" className="btn-primary">Create New Paper</Link>
          </div>
        ) : isProcessing ? (
          <ProcessingState assignment={currentAssignment} />
        ) : status === 'failed' ? (
          <div className="max-w-lg mx-auto text-center py-24">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <span className="text-red-500 text-2xl">✕</span>
            </div>
            <h2 className="font-display text-2xl font-bold text-ink mb-2">Generation Failed</h2>
            <p className="text-ink/50 text-sm mb-6 font-sans">{currentAssignment.error || 'An unexpected error occurred.'}</p>
            <Link href="/create" className="btn-primary">Try Again</Link>
          </div>
        ) : (
          <AssignmentOutput assignment={currentAssignment} />
        )}
      </main>
    </div>
  );
}
