'use client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { BookOpen, ArrowLeft } from 'lucide-react';
import AssignmentForm from '@/components/assignment/AssignmentForm';
import toast from 'react-hot-toast';
import { useAssignmentStore } from '@/store/assignmentStore';

export default function CreatePage() {
  const router = useRouter();
  const { createAssignment, isSubmitting } = useAssignmentStore();

  const handleSubmit = async () => {
    const id = await createAssignment();
    if (id) {
      toast.success('Assignment created! Generating paper...');
      router.push(`/assignments/${id}`);
    }
  };

  return (
    <div className="min-h-screen bg-paper">
      {/* Header */}
      <header className="bg-ink sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 text-paper/60 hover:text-paper transition-colors">
            <ArrowLeft size={18} />
            <span className="text-sm font-sans">Back</span>
          </Link>
          <div className="h-5 w-px bg-paper/20" />
          <div className="flex items-center gap-2">
            <BookOpen size={18} className="text-accent" />
            <span className="font-display font-bold text-paper">AssessAI</span>
          </div>
          <div className="ml-auto text-paper/40 text-sm font-sans hidden sm:block">
            Create Question Paper
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* Page title */}
        <div className="mb-10 animate-fade-up">
          <div className="inline-flex items-center gap-2 text-accent text-sm font-mono tracking-widest uppercase mb-3">
            <span className="w-8 h-px bg-accent" />
            New Assignment
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-ink mb-3">
            Create Question Paper
          </h1>
          <p className="text-ink/50 text-lg font-sans">
            Configure your assessment and AI will generate a structured, exam-ready paper.
          </p>
        </div>

        {/* Form */}
        <div className="animate-fade-up stagger-1">
          <AssignmentForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
        </div>
      </main>
    </div>
  );
}
