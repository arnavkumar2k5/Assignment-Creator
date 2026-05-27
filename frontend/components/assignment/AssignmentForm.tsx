'use client';

import Link from 'next/link';
import { useRef } from 'react';
import { CalendarPlus, ChevronDown, Loader2, Mic, Minus, Plus, UploadCloud, X } from 'lucide-react';
import clsx from 'clsx';
import { useAssignmentStore } from '@/store/assignmentStore';

const QUESTION_TYPE_OPTIONS = [
  'Multiple Choice Questions',
  'Short Questions',
  'Diagram/Graph-Based Questions',
  'Numerical Problems',
  'Long Answer Questions',
  'True/False',
  'Fill in the Blank',
  'Case Study',
];

interface Props {
  onSubmit: () => void;
  isSubmitting: boolean;
}

export default function AssignmentForm({ onSubmit, isSubmitting }: Props) {
  const {
    form,
    formErrors,
    setFormField,
    addQuestionType,
    updateQuestionType,
    removeQuestionType,
  } = useAssignmentStore();
  const fileRef = useRef<HTMLInputElement>(null);

  const totalQuestions = form.questionTypes.reduce((sum, qt) => sum + (qt.count || 0), 0);
  const totalMarks = form.questionTypes.reduce((sum, qt) => sum + (qt.count || 0) * (qt.marks || 0), 0);

  const setNumber = (index: number, field: 'count' | 'marks', delta: number) => {
    const current = form.questionTypes[index][field] || 0;
    updateQuestionType(index, field, Math.max(1, current + delta));
  };

  const setSelectedFile = (file: File | null) => {
    setFormField('file', file);
    if (file && !form.title.trim()) {
      setFormField(
        'title',
        file.name
          .replace(/\.[^.]+$/, '')
          .replace(/[_-]+/g, ' ')
          .replace(/\s+/g, ' ')
          .trim()
      );
    }
  };

  return (
    <div>
      <section className="surface-panel mx-auto max-w-[920px] px-4 py-8 lg:px-10 lg:py-10">
        <div className="mb-8">
          <h2 className="text-xl font-extrabold tracking-[-0.04em] lg:text-2xl">Assignment Details</h2>
          <p className="mt-1 text-sm text-[#787878] lg:text-base">Basic information about your assignment</p>
        </div>

        <div
          className={clsx(
            'mb-4 flex min-h-[200px] cursor-pointer flex-col items-center justify-center rounded-[22px] border-2 border-dashed border-[#c8c8c8] bg-white/35 p-6 text-center lg:min-h-[230px]',
            form.file && 'border-[#9f9f9f] bg-white/60'
          )}
          onClick={() => fileRef.current?.click()}
        >
          <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-lg bg-white">
            <UploadCloud size={27} />
          </div>
          {form.file ? (
            <div className="flex items-center gap-3 text-base font-semibold">
              <span className="max-w-[230px] truncate">{form.file.name}</span>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  setSelectedFile(null);
                }}
                className="text-[#777]"
              >
                <X size={18} />
              </button>
            </div>
          ) : (
            <>
              <p className="text-base font-semibold">Choose a file or drag & drop it here</p>
              <p className="mt-3 text-sm text-[#aaa]">PDF, DOCX, TXT, JPEG or PNG, up to 5MB</p>
              <button type="button" className="mt-6 rounded-full bg-[#f3f3f3] px-8 py-3 text-sm font-semibold">
                Browse Files
              </button>
            </>
          )}
          <input
            ref={fileRef}
            type="file"
            accept=".jpeg,.jpg,.png,.pdf,.doc,.docx,.txt"
            className="hidden"
            onChange={(event) => setSelectedFile(event.target.files?.[0] || null)}
          />
        </div>

        <p className="mb-6 text-center text-lg text-[#747474]">Upload your reference document or image</p>

        <label className="mb-2 block text-base font-extrabold">Assignment Title</label>
        <div className="relative mb-6">
          <input
            type="text"
            value={form.title}
            onChange={(event) => setFormField('title', event.target.value)}
            placeholder="e.g. Photosynthesis worksheet"
            className={clsx('soft-input h-14 px-5 text-base', formErrors.title && 'border-red-400')}
          />
          {formErrors.title && <p className="mt-1 text-xs text-red-500">{formErrors.title}</p>}
        </div>

        <label className="mb-2 block text-base font-extrabold">Due Date</label>
        <div className="relative mb-6">
          <input
            type="date"
            value={form.dueDate}
            min={new Date().toISOString().split('T')[0]}
            onChange={(event) => setFormField('dueDate', event.target.value)}
            className={clsx('soft-input h-14 px-5 pr-14 text-base', formErrors.dueDate && 'border-red-400')}
          />
          <CalendarPlus className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2" size={24} />
          {formErrors.dueDate && <p className="mt-1 text-xs text-red-500">{formErrors.dueDate}</p>}
        </div>

        <div className="hidden grid-cols-[1fr_160px_130px] gap-6 lg:grid">
          <p className="text-base font-extrabold">Question Type</p>
          <p className="text-center text-base font-semibold">No. of Questions</p>
          <p className="text-center text-base font-semibold">Marks</p>
        </div>

        {formErrors.questionTypes && <p className="mt-2 text-sm text-red-500">{formErrors.questionTypes}</p>}

        <div className="mt-3 space-y-4 lg:space-y-4">
          {form.questionTypes.map((qt, index) => (
            <div
              key={index}
              className="rounded-[22px] bg-white p-3 lg:grid lg:grid-cols-[1fr_34px_150px_130px] lg:items-center lg:gap-5 lg:rounded-none lg:bg-transparent lg:p-0"
            >
              <label className="relative block">
                <select
                  value={qt.type}
                  onChange={(event) => updateQuestionType(index, 'type', event.target.value)}
                  className={clsx('soft-input h-14 appearance-none px-5 pr-12 text-sm lg:text-base', formErrors[`qt_type_${index}`] && 'border-red-400')}
                >
                  <option value="">Select type</option>
                  {QUESTION_TYPE_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2" size={19} />
              </label>

              <button
                type="button"
                onClick={() => removeQuestionType(index)}
                disabled={form.questionTypes.length === 1}
                className="absolute right-8 mt-[-43px] text-[#2c2c2c] disabled:opacity-30 lg:static lg:mt-0"
              >
                <X size={20} />
              </button>

              <div className="mt-3 grid grid-cols-2 gap-3 rounded-[20px] bg-[#f0f0f0] p-3 lg:contents">
                <Counter
                  label="No. of Questions"
                  value={qt.count}
                  onMinus={() => setNumber(index, 'count', -1)}
                  onPlus={() => setNumber(index, 'count', 1)}
                />
                <Counter
                  label="Marks"
                  value={qt.marks}
                  onMinus={() => setNumber(index, 'marks', -1)}
                  onPlus={() => setNumber(index, 'marks', 1)}
                />
              </div>
            </div>
          ))}
        </div>

        <button type="button" onClick={addQuestionType} className="mt-5 inline-flex items-center gap-3 text-sm font-extrabold">
          <span className="grid h-11 w-11 place-items-center rounded-full bg-[#252525] text-white">
            <Plus size={28} />
          </span>
          Add Question Type
        </button>

        <div className="mt-5 text-right text-base leading-8 lg:text-lg">
          <p>Total Questions : {totalQuestions}</p>
          <p>Total Marks : {totalMarks}</p>
        </div>

        <div className="mt-8 hidden lg:block">
          <label className="mb-3 block text-base font-extrabold">Additional Information (For better output)</label>
          <div className="relative">
            <textarea
              value={form.instructions}
              onChange={(event) => setFormField('instructions', event.target.value)}
              placeholder="e.g Generate a question paper for 3 hour exam duration..."
              className="min-h-[110px] w-full resize-none rounded-[18px] border border-dashed border-[#d7d7d7] bg-white/30 px-5 py-4 pr-16 text-sm outline-none"
            />
            <button type="button" className="absolute bottom-4 right-4 grid h-10 w-10 place-items-center rounded-full bg-white/70">
              <Mic size={20} />
            </button>
          </div>
        </div>
      </section>

      <div className="mx-auto mt-8 flex max-w-[920px] items-center justify-between gap-4 px-4 lg:mt-10 lg:px-0">
        <Link href="/assignments" className="inline-flex h-14 items-center justify-center gap-2 rounded-full bg-white px-8 text-base font-semibold lg:h-16 lg:px-9 lg:text-lg">
          <span className="text-2xl">←</span>
          Previous
        </Link>
        <button
          type="button"
          onClick={onSubmit}
          disabled={isSubmitting}
          className="dark-button min-h-14 px-9 text-base disabled:opacity-60 lg:min-h-16 lg:text-lg"
        >
          {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : 'Next'}
          {!isSubmitting && <span className="text-2xl">→</span>}
        </button>
      </div>
    </div>
  );
}

function Counter({ label, value, onMinus, onPlus }: { label: string; value: number; onMinus: () => void; onPlus: () => void }) {
  return (
    <div>
      <p className="mb-2 text-center text-sm lg:hidden">{label}</p>
      <div className="grid h-12 grid-cols-3 items-center rounded-full bg-white px-2 text-center lg:h-14">
        <button type="button" onClick={onMinus} className="text-[#b5b5b5]">
          <Minus size={18} />
        </button>
        <span className="font-bold">{value}</span>
        <button type="button" onClick={onPlus} className="text-[#b5b5b5]">
          <Plus size={18} />
        </button>
      </div>
    </div>
  );
}
