'use client';
import { useState } from 'react';
import { Assignment, QuestionDifficulty } from '@/types';
import { useAssignmentStore } from '@/store/assignmentStore';
import { generatePDF } from '@/lib/pdfGenerator';
import { format } from 'date-fns';
import { RefreshCw, Download, Loader2, Award, Calendar, Hash } from 'lucide-react';
import clsx from 'clsx';
import toast from 'react-hot-toast';

const DIFF_BADGE: Record<QuestionDifficulty, string> = {
  easy: 'badge-easy',
  medium: 'badge-medium',
  hard: 'badge-hard',
};

const studentInfo = {
  name: '____________________________',
  rollNumber: '______________',
  section: '______',
};

interface Props {
  assignment: Assignment;
}

export default function AssignmentOutput({ assignment }: Props) {
  const { regenerateAssignment } = useAssignmentStore();
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const paper = assignment.generatedPaper;
  if (!paper) return null;

  const totalMarks = paper.sections.reduce((acc, s) =>
    acc + s.questions.reduce((qa, q) => qa + q.marks, 0), 0);
  const totalQuestions = paper.sections.reduce((acc, s) => acc + s.questions.length, 0);

  const handleRegenerate = async () => {
    setIsRegenerating(true);
    await regenerateAssignment(assignment._id);
    toast.loading('Regenerating paper...', { id: 'regen' });
    setIsRegenerating(false);
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      generatePDF(assignment);
      toast.success('PDF downloaded!');
    } catch {
      toast.error('PDF generation failed');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Action bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="text-accent text-xs font-mono tracking-widest uppercase mb-1">Generated Paper</div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-ink">{assignment.title}</h1>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleRegenerate}
            disabled={isRegenerating}
            className="btn-secondary flex items-center gap-2 text-sm py-2.5"
          >
            {isRegenerating ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
            Regenerate
          </button>
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="btn-accent flex items-center gap-2 text-sm py-2.5"
          >
            {isDownloading ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
            Download PDF
          </button>
        </div>
      </div>

      {/* Exam Paper */}
      <div className="bg-white rounded-2xl shadow-lg border border-ink/8 overflow-hidden print:shadow-none">
        {/* Header */}
        <div className="bg-ink px-8 py-7 text-center">
          <div className="text-accent text-xs font-mono tracking-[0.3em] uppercase mb-2">
            Examination Paper
          </div>
          <h2 className="font-display text-2xl md:text-3xl font-bold text-white mb-1">
            {assignment.title}
          </h2>
          <div className="w-20 h-px bg-accent/50 mx-auto mt-3" />
        </div>

        {/* Meta bar */}
        <div className="bg-cream px-8 py-3 flex flex-wrap items-center justify-center gap-6 border-b border-ink/8 text-sm">
          <div className="flex items-center gap-2 text-ink/60">
            <Calendar size={14} />
            <span className="font-sans">{format(new Date(assignment.dueDate), 'MMMM dd, yyyy')}</span>
          </div>
          <div className="flex items-center gap-2 text-ink/60">
            <Hash size={14} />
            <span className="font-sans">{totalQuestions} Questions</span>
          </div>
          <div className="flex items-center gap-2 text-ink/60">
            <Award size={14} />
            <span className="font-sans font-semibold text-ink">Total: {totalMarks} Marks</span>
          </div>
        </div>

        <div className="px-6 md:px-10 py-8 space-y-8">
          {/* Student info */}
          <div className="border-2 border-dashed border-ink/15 rounded-xl p-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: 'Student Name', value: studentInfo.name },
              { label: 'Roll Number', value: studentInfo.rollNumber },
              { label: 'Section', value: studentInfo.section },
            ].map((field) => (
              <div key={field.label}>
                <div className="text-xs uppercase tracking-widest text-ink/40 mb-1 font-sans">{field.label}</div>
                <div className="font-display text-lg text-ink/30 border-b border-ink/15 pb-1">
                  {field.value}
                </div>
              </div>
            ))}
          </div>

          {/* General instructions */}
          {assignment.instructions && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <p className="text-xs uppercase tracking-widest text-amber-600 mb-1 font-sans">General Instructions</p>
              <p className="text-sm text-amber-900 font-sans leading-relaxed">{assignment.instructions}</p>
            </div>
          )}

          {/* Sections */}
          {paper.sections.map((section, si) => (
            <div key={si} className="space-y-5">
              {/* Section header */}
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-ink flex items-center justify-center">
                    <span className="font-display font-bold text-accent text-sm">
                      {String.fromCharCode(65 + si)}
                    </span>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-display text-xl font-bold text-ink">{section.title}</h3>
                  <p className="text-sm text-ink/50 italic font-sans">{section.instruction}</p>
                </div>
                <div className="text-right text-xs text-ink/30 font-mono">
                  {section.questions.length} Questions
                </div>
              </div>

              {/* Questions */}
              <div className="space-y-3 pl-14">
                {section.questions.map((q, qi) => (
                  <div
                    key={qi}
                    className="group relative bg-cream rounded-xl p-5 border border-ink/6 hover:border-ink/15 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      {/* Question number */}
                      <span className="flex-shrink-0 w-7 h-7 rounded-full bg-ink/8 flex items-center justify-center text-xs font-mono text-ink/60 mt-0.5">
                        {qi + 1}
                      </span>

                      {/* Question text */}
                      <div className="flex-1 min-w-0">
                        <p className="text-ink font-sans leading-relaxed text-[0.95rem]">
                          {q.question}
                        </p>
                      </div>

                      {/* Right side: marks + difficulty */}
                      <div className="flex-shrink-0 flex flex-col items-end gap-2 ml-3">
                        <span className="font-mono text-sm font-bold text-ink bg-ink/8 px-2.5 py-1 rounded-lg whitespace-nowrap">
                          [{q.marks}M]
                        </span>
                        <span className={clsx(
                          'text-xs font-semibold px-2.5 py-1 rounded-full capitalize tracking-wide font-sans',
                          DIFF_BADGE[q.difficulty]
                        )}>
                          {q.difficulty}
                        </span>
                      </div>
                    </div>

                    {/* Answer space */}
                    {q.marks > 2 && (
                      <div className="mt-4 ml-10 border border-dashed border-ink/10 rounded-lg p-3 min-h-[60px]">
                        <span className="text-xs text-ink/20 font-sans">Answer space</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {si < paper.sections.length - 1 && (
                <div className="border-t border-ink/8 pt-2" />
              )}
            </div>
          ))}

          {/* Footer */}
          <div className="pt-4 border-t border-ink/8 text-center">
            <p className="text-xs text-ink/30 font-mono tracking-widest uppercase">
              — End of Paper — Total Marks: {totalMarks} —
            </p>
          </div>
        </div>
      </div>

      {/* Difficulty summary */}
      <div className="mt-6 grid grid-cols-3 gap-4">
        {(['easy', 'medium', 'hard'] as QuestionDifficulty[]).map((diff) => {
          const count = paper.sections.flatMap(s => s.questions).filter(q => q.difficulty === diff).length;
          const marks = paper.sections.flatMap(s => s.questions).filter(q => q.difficulty === diff).reduce((a, q) => a + q.marks, 0);
          return (
            <div key={diff} className={clsx('card text-center', count === 0 && 'opacity-40')}>
              <span className={clsx('text-xs font-semibold px-2 py-0.5 rounded-full capitalize inline-block mb-2', DIFF_BADGE[diff])}>
                {diff}
              </span>
              <div className="font-display text-2xl font-bold text-ink">{count}</div>
              <div className="text-xs text-ink/40 font-sans">{marks} marks</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
