import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { Assignment, AssignmentFormData, QuestionType } from '@/types';
import { assignmentService } from '@/services/api';

interface FormState {
  title: string;
  dueDate: string;
  instructions: string;
  questionTypes: QuestionType[];
  file: File | null;
}

interface AssignmentStore {
  // Form state
  form: FormState;
  formErrors: Record<string, string>;
  isSubmitting: boolean;

  // Assignment data
  currentAssignment: Assignment | null;
  assignments: Assignment[];
  isLoading: boolean;
  error: string | null;

  // Form actions
  setFormField: <K extends keyof FormState>(field: K, value: FormState[K]) => void;
  addQuestionType: () => void;
  updateQuestionType: (index: number, field: keyof QuestionType, value: string | number) => void;
  removeQuestionType: (index: number) => void;
  resetForm: () => void;
  setFormErrors: (errors: Record<string, string>) => void;

  // API actions
  createAssignment: () => Promise<string | null>;
  fetchAssignment: (id: string) => Promise<void>;
  regenerateAssignment: (id: string) => Promise<void>;
  updateAssignmentStatus: (id: string, assignment: Partial<Assignment>) => void;
  fetchAssignments: () => Promise<void>;
}

const defaultForm: FormState = {
  title: '',
  dueDate: '',
  instructions: '',
  questionTypes: [{ type: 'Multiple Choice', count: 5, marks: 2 }],
  file: null,
};

const validateForm = (form: FormState): Record<string, string> => {
  const errors: Record<string, string> = {};

  if (!form.title.trim()) errors.title = 'Title is required';
  if (!form.dueDate) errors.dueDate = 'Due date is required';
  if (form.questionTypes.length === 0) errors.questionTypes = 'Add at least one question type';

  form.questionTypes.forEach((qt, i) => {
    if (!qt.type.trim()) errors[`qt_type_${i}`] = 'Question type is required';
    if (qt.count < 1) errors[`qt_count_${i}`] = 'Count must be at least 1';
    if (qt.marks < 1) errors[`qt_marks_${i}`] = 'Marks must be at least 1';
  });

  return errors;
};

export const useAssignmentStore = create<AssignmentStore>()(
  devtools(
    (set, get) => ({
      form: { ...defaultForm },
      formErrors: {},
      isSubmitting: false,
      currentAssignment: null,
      assignments: [],
      isLoading: false,
      error: null,

      setFormField: (field, value) =>
        set((state) => ({ form: { ...state.form, [field]: value }, formErrors: {} })),

      addQuestionType: () =>
        set((state) => ({
          form: {
            ...state.form,
            questionTypes: [...state.form.questionTypes, { type: '', count: 5, marks: 2 }],
          },
        })),

      updateQuestionType: (index, field, value) =>
        set((state) => ({
          form: {
            ...state.form,
            questionTypes: state.form.questionTypes.map((qt, i) =>
              i === index ? { ...qt, [field]: value } : qt
            ),
          },
        })),

      removeQuestionType: (index) =>
        set((state) => ({
          form: {
            ...state.form,
            questionTypes: state.form.questionTypes.filter((_, i) => i !== index),
          },
        })),

      resetForm: () => set({ form: { ...defaultForm }, formErrors: {} }),

      setFormErrors: (errors) => set({ formErrors: errors }),

      createAssignment: async () => {
        const { form } = get();
        const errors = validateForm(form);

        if (Object.keys(errors).length > 0) {
          set({ formErrors: errors });
          return null;
        }

        set({ isSubmitting: true, error: null });
        try {
          const res = await assignmentService.create(form as AssignmentFormData);
          if (res.success && res.data) {
            set({ currentAssignment: res.data });
            get().resetForm();
            return res.data._id;
          }
          return null;
        } catch (err) {
          set({ error: err instanceof Error ? err.message : 'Failed to create assignment' });
          return null;
        } finally {
          set({ isSubmitting: false });
        }
      },

      fetchAssignment: async (id) => {
        set({ isLoading: true, error: null });
        try {
          const res = await assignmentService.getById(id);
          if (res.success && res.data) {
            set({ currentAssignment: res.data });
          }
        } catch (err) {
          set({ error: err instanceof Error ? err.message : 'Failed to fetch assignment' });
        } finally {
          set({ isLoading: false });
        }
      },

      regenerateAssignment: async (id) => {
        set({ isLoading: true, error: null });
        try {
          await assignmentService.regenerate(id);
          set((state) => ({
            currentAssignment: state.currentAssignment
              ? { ...state.currentAssignment, status: 'pending', generatedPaper: undefined }
              : null,
          }));
        } catch (err) {
          set({ error: err instanceof Error ? err.message : 'Failed to regenerate' });
        } finally {
          set({ isLoading: false });
        }
      },

      updateAssignmentStatus: (id, updatedData) =>
        set((state) => ({
          currentAssignment:
            state.currentAssignment?._id === id
              ? { ...state.currentAssignment, ...updatedData }
              : state.currentAssignment,
        })),

      fetchAssignments: async () => {
        set({ isLoading: true });
        try {
          const res = await assignmentService.list();
          if (res.success && res.data) set({ assignments: res.data });
        } catch {
          // silent fail
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    { name: 'assignment-store' }
  )
);
