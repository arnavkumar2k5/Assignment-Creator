'use client';
import { useEffect } from 'react';
import { useAssignmentStore } from '@/store/assignmentStore';
import Link from 'next/link';
import { format } from 'date-fns';
import { BookOpen, ArrowLeft, Plus, Clock, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import clsx from 'clsx';
import { AssignmentStatus } from '@/types';

const StatusIcon: Record<AssignmentStatus, React.ReactNode> = {
  pending: <Clock size={14} className="text-yellow-500" />,
  processing: <Loader2 size={14} className="text-blue-500 animate-spin" />,
  completed: <CheckCircle size={14} className="text-emerald-500" />,
  failed: <XCircle size={14} className="text-red-500" />,
};

const StatusColors: Record<AssignmentStatus, string> = {
  pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  processing: 'bg-blue-50 text-blue-700 border-blue-200',
  completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  failed: 'bg-red-50 text-red-700 border-red-200',
};

export default function AssignmentsPage() {
  const { assignments, fetchAssignments, isLoading } = useAssignmentStore();

  useEffect(() => { fetchAssignments(); }, []);

  return (
    <div className="min-h-screen bg-paper">
      <header className="bg-ink sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 text-paper/60 hover:text-paper transition-colors">
            <ArrowLeft size={18} />
            <span className="text-sm font-sans">Home</span>
          </Link>
          <div className="h-5 w-px bg-paper/20" />
          <div className="flex items-center gap-2">
            <BookOpen size={18} className="text-accent" />
            <span className="font-display font-bold text-paper">AssessAI</span>
          </div>
          <Link href="/create" className="ml-auto btn-accent text-sm py-2 px-4 flex items-center gap-2">
            <Plus size={16} /> New Paper
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12">
        <div className="mb-8">
          <div className="text-accent text-xs font-mono tracking-widest uppercase mb-2">All Papers</div>
          <h1 className="font-display text-4xl font-bold text-ink">Question Papers</h1>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-40">
            <Loader2 size={24} className="animate-spin text-ink/30" />
          </div>
        ) : assignments.length === 0 ? (
          <div className="text-center py-24 card">
            <BookOpen size={40} className="text-ink/20 mx-auto mb-4" />
            <p className="text-ink/40 text-lg mb-6">No papers yet</p>
            <Link href="/create" className="btn-accent">Create Your First Paper</Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {assignments.map((a) => (
              <Link
                key={a._id}
                href={`/assignments/${a._id}`}
                className="card hover:shadow-md transition-all hover:border-ink/15 group flex items-center gap-5"
              >
                <div className="w-12 h-12 rounded-xl bg-ink/5 flex items-center justify-center flex-shrink-0 group-hover:bg-ink group-hover:text-accent transition-all duration-300">
                  <BookOpen size={20} className="text-ink/40 group-hover:text-accent transition-colors" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-display font-bold text-ink text-lg truncate group-hover:text-ink/80 transition-colors">
                    {a.title}
                  </h3>
                  <div className="flex items-center gap-3 mt-1 text-xs text-ink/40 font-sans">
                    <span>Due {format(new Date(a.dueDate), 'MMM dd, yyyy')}</span>
                    <span>·</span>
                    <span>{a.questionTypes.length} type(s)</span>
                    <span>·</span>
                    <span>{format(new Date(a.createdAt), 'MMM dd')}</span>
                  </div>
                </div>
                <div className={clsx(
                  'flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border capitalize flex-shrink-0',
                  StatusColors[a.status]
                )}>
                  {StatusIcon[a.status]}
                  {a.status}
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
