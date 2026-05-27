'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import AssignmentForm from '@/components/assignment/AssignmentForm';
import VedaShell from '@/components/VedaShell';
import toast from 'react-hot-toast';
import { useAssignmentStore } from '@/store/assignmentStore';

export default function CreatePage() {
  const router = useRouter();
  const { createAssignment, isSubmitting } = useAssignmentStore();

  const handleSubmit = async () => {
    const id = await createAssignment();
    if (id) {
      toast.success('Assignment created. Generating paper...');
      router.push(`/assignments/${id}`);
    }
  };

  return (
    <VedaShell active="assignments" topTitle="Assignment" backHref="/assignments" floatingCreate={false}>
      <div className="mx-auto max-w-[1050px]">
        <div className="mb-5 flex items-center justify-between lg:hidden">
          <a href="/assignments" className="flex h-12 w-12 items-center justify-center rounded-full bg-[#e4e4e4]">
            <ArrowLeft size={26} />
          </a>
          <h1 className="text-base font-extrabold">Create Assignment</h1>
          <span className="w-12" />
        </div>

        <div className="mb-8 hidden items-start gap-5 lg:flex">
          <span className="mt-3 h-7 w-7 rounded-full border-[7px] border-[#84dda7] bg-[#2fc165]" />
          <div>
            <h1 className="text-3xl font-extrabold tracking-[-0.04em]">Create Assignment</h1>
            <p className="mt-1 text-lg text-[#949494]">Set up a new assignment for your students</p>
          </div>
        </div>

        <div className="mx-auto mb-9 grid max-w-[860px] grid-cols-2 gap-2 px-2 lg:mb-10">
          <span className="h-1.5 rounded-full bg-[#606060]" />
          <span className="h-1.5 rounded-full bg-[#bfbfbf]" />
        </div>

        <AssignmentForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      </div>
    </VedaShell>
  );
}
