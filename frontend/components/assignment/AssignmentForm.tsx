'use client';
import { useAssignmentStore } from '@/store/assignmentStore';
import { Plus, Trash2, Upload, X, Loader2 } from 'lucide-react';
import { useRef } from 'react';
import clsx from 'clsx';

const QUESTION_TYPE_OPTIONS = [
  'Multiple Choice',
  'Short Answer',
  'Long Answer',
  'True/False',
  'Fill in the Blank',
  'Match the Following',
  'Essay',
  'Problem Solving',
  'Case Study',
  'Diagram/Labeling',
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

  const totalQuestions = form.questionTypes.reduce((s, qt) => s + (qt.count || 0), 0);
  const totalMarks = form.questionTypes.reduce((s, qt) => s + (qt.count || 0) * (qt.marks || 0), 0);

  return (
    <div className="space-y-8">
      {/* Basic Info */}
      <div className="card paper-texture">
        <h2 className="font-display text-xl font-bold text-ink mb-6 flex items-center gap-2">
          <span className="w-7 h-7 rounded-full bg-ink text-paper text-xs flex items-center justify-center font-sans">1</span>
          Assignment Details
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="label">Assignment Title *</label>
            <input
              type="text"
              className={clsx('input-field', formErrors.title && 'input-error')}
              placeholder="e.g. Advanced Mathematics — Unit 3 Exam"
              value={form.title}
              onChange={(e) => setFormField('title', e.target.value)}
            />
            {formErrors.title && <p className="text-red-500 text-xs mt-1">{formErrors.title}</p>}
          </div>

          <div>
            <label className="label">Due Date *</label>
            <input
              type="date"
              className={clsx('input-field', formErrors.dueDate && 'input-error')}
              value={form.dueDate}
              min={new Date().toISOString().split('T')[0]}
              onChange={(e) => setFormField('dueDate', e.target.value)}
            />
            {formErrors.dueDate && <p className="text-red-500 text-xs mt-1">{formErrors.dueDate}</p>}
          </div>

          <div>
            <label className="label">Reference File (Optional)</label>
            <div
              className="border-2 border-dashed border-ink/15 rounded-lg p-4 cursor-pointer hover:border-accent/50 transition-colors text-center"
              onClick={() => fileRef.current?.click()}
            >
              {form.file ? (
                <div className="flex items-center justify-center gap-2 text-sm text-ink/70">
                  <span className="truncate max-w-[180px]">{form.file.name}</span>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setFormField('file', null); }}
                    className="text-red-400 hover:text-red-500"
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <div className="text-ink/40 text-sm flex flex-col items-center gap-1">
                  <Upload size={18} />
                  <span>Click to upload</span>
                  <span className="text-xs">PDF, DOC up to 5MB</span>
                </div>
              )}
            </div>
            <input
              ref={fileRef}
              type="file"
              accept=".pdf,.doc,.docx,.txt"
              className="hidden"
              onChange={(e) => setFormField('file', e.target.files?.[0] || null)}
            />
          </div>

          <div className="md:col-span-2">
            <label className="label">Additional Instructions</label>
            <textarea
              className="input-field resize-none h-24"
              placeholder="e.g. Focus on chapters 3–5. Include real-world application questions..."
              value={form.instructions}
              onChange={(e) => setFormField('instructions', e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Question Types */}
      <div className="card paper-texture">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-xl font-bold text-ink flex items-center gap-2">
            <span className="w-7 h-7 rounded-full bg-ink text-paper text-xs flex items-center justify-center font-sans">2</span>
            Question Configuration
          </h2>
          <button
            type="button"
            onClick={addQuestionType}
            className="flex items-center gap-2 text-sm font-semibold text-accent hover:text-accent-dark transition-colors"
          >
            <Plus size={16} />
            Add Type
          </button>
        </div>

        {formErrors.questionTypes && (
          <p className="text-red-500 text-sm mb-4">{formErrors.questionTypes}</p>
        )}

        <div className="space-y-4">
          {form.questionTypes.map((qt, i) => (
            <div key={i} className="bg-cream rounded-xl p-4 border border-ink/8 group">
              <div className="flex items-start gap-4">
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-1">
                    <label className="label text-xs">Question Type</label>
                    <select
                      className={clsx('input-field text-sm', formErrors[`qt_type_${i}`] && 'input-error')}
                      value={qt.type}
                      onChange={(e) => updateQuestionType(i, 'type', e.target.value)}
                    >
                      <option value="">Select type</option>
                      {QUESTION_TYPE_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                    {formErrors[`qt_type_${i}`] && (
                      <p className="text-red-500 text-xs mt-0.5">{formErrors[`qt_type_${i}`]}</p>
                    )}
                  </div>

                  <div>
                    <label className="label text-xs">Number of Questions</label>
                    <input
                      type="number"
                      min={1}
                      max={50}
                      className={clsx('input-field text-sm', formErrors[`qt_count_${i}`] && 'input-error')}
                      value={qt.count}
                      onChange={(e) => updateQuestionType(i, 'count', parseInt(e.target.value) || 0)}
                    />
                    {formErrors[`qt_count_${i}`] && (
                      <p className="text-red-500 text-xs mt-0.5">{formErrors[`qt_count_${i}`]}</p>
                    )}
                  </div>

                  <div>
                    <label className="label text-xs">Marks per Question</label>
                    <input
                      type="number"
                      min={1}
                      max={100}
                      className={clsx('input-field text-sm', formErrors[`qt_marks_${i}`] && 'input-error')}
                      value={qt.marks}
                      onChange={(e) => updateQuestionType(i, 'marks', parseInt(e.target.value) || 0)}
                    />
                    {formErrors[`qt_marks_${i}`] && (
                      <p className="text-red-500 text-xs mt-0.5">{formErrors[`qt_marks_${i}`]}</p>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => removeQuestionType(i)}
                  disabled={form.questionTypes.length === 1}
                  className="mt-6 text-ink/20 hover:text-red-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              {qt.type && qt.count > 0 && qt.marks > 0 && (
                <div className="mt-2 text-xs text-ink/40 font-mono">
                  {qt.count} × {qt.marks} marks = {qt.count * qt.marks} marks total
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Summary */}
        {totalQuestions > 0 && (
          <div className="mt-6 p-4 bg-ink/5 rounded-xl border border-ink/8 flex items-center justify-between">
            <span className="text-sm text-ink/60 font-sans">Paper Summary</span>
            <div className="flex gap-6 text-sm font-mono">
              <span><strong className="text-ink">{totalQuestions}</strong> <span className="text-ink/50">questions</span></span>
              <span><strong className="text-ink">{totalMarks}</strong> <span className="text-ink/50">total marks</span></span>
            </div>
          </div>
        )}
      </div>

      {/* Submit */}
      <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
        <button
          type="button"
          onClick={onSubmit}
          disabled={isSubmitting}
          className="btn-accent w-full sm:w-auto flex items-center justify-center gap-3 text-lg py-4 px-10 shadow-lg shadow-accent/20"
        >
          {isSubmitting ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              Creating...
            </>
          ) : (
            <>
              Generate Question Paper
            </>
          )}
        </button>
        <p className="text-sm text-ink/40 font-sans text-center sm:text-left">
          Your paper will be generated in seconds using AI
        </p>
      </div>
    </div>
  );
}
