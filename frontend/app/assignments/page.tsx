'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { ArrowLeft, Filter, Loader2, MoreVertical, Plus, Search } from 'lucide-react';
import VedaShell from '@/components/VedaShell';
import { useAssignmentStore } from '@/store/assignmentStore';

function EmptyAssignments() {
  return (
    <div className="flex min-h-[calc(100vh-11rem)] flex-col items-center justify-center text-center lg:min-h-[calc(100vh-12rem)] lg:max-[1920px]:min-h-[calc(100vh-10rem)]">
      <div className="relative mb-10 h-[220px] w-[300px] lg:h-[340px] lg:w-[430px] lg:max-[1920px]:mb-6 lg:max-[1920px]:h-[250px] lg:max-[1920px]:w-[330px]">
        <div className="absolute left-1/2 top-1/2 h-44 w-44 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/38 lg:h-80 lg:w-80 lg:max-[1920px]:h-56 lg:max-[1920px]:w-56" />
        <div className="absolute left-[38%] top-[26%] h-40 w-28 rounded-[18px] bg-white shadow-sm lg:h-56 lg:w-40 lg:max-[1920px]:h-44 lg:max-[1920px]:w-32">
          <div className="mx-auto mt-7 h-3 w-16 rounded-full bg-[#082132] lg:h-4 lg:w-20 lg:max-[1920px]:mt-6 lg:max-[1920px]:h-3 lg:max-[1920px]:w-16" />
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="mx-auto mt-5 h-3 w-20 rounded-full bg-[#cfcfcf] lg:h-4 lg:w-28 lg:max-[1920px]:mt-4 lg:max-[1920px]:h-3 lg:max-[1920px]:w-24" />
          ))}
        </div>
        <div className="absolute right-[14%] top-[22%] h-14 w-24 rounded-md bg-white shadow-md lg:h-16 lg:w-28 lg:max-[1920px]:h-14 lg:max-[1920px]:w-24">
          <div className="ml-3 mt-5 inline-block h-4 w-4 rounded-full bg-[#cfc6dc] lg:max-[1920px]:h-3.5 lg:max-[1920px]:w-3.5" />
          <div className="ml-3 inline-block h-4 w-12 rounded-full bg-[#cfcfcf] lg:max-[1920px]:h-3.5 lg:max-[1920px]:w-11" />
        </div>
        <div className="absolute left-[54%] top-[38%] h-28 w-28 rounded-full border-[12px] border-[#cbc1dd] bg-white/20 shadow-[inset_0_0_18px_rgba(0,0,0,0.18)] lg:h-44 lg:w-44 lg:border-[17px] lg:max-[1920px]:h-32 lg:max-[1920px]:w-32 lg:max-[1920px]:border-[13px]">
          <div className="absolute left-1/2 top-1/2 h-16 w-4 -translate-x-1/2 -translate-y-1/2 rotate-45 rounded-full bg-[#ff4242] lg:h-24 lg:w-7 lg:max-[1920px]:h-16 lg:max-[1920px]:w-5" />
          <div className="absolute left-1/2 top-1/2 h-16 w-4 -translate-x-1/2 -translate-y-1/2 -rotate-45 rounded-full bg-[#ff4242] lg:h-24 lg:w-7 lg:max-[1920px]:h-16 lg:max-[1920px]:w-5" />
        </div>
        <div className="absolute left-[76%] top-[68%] h-16 w-7 -rotate-45 rounded-full bg-[#d9d1ef] lg:h-28 lg:w-10 lg:max-[1920px]:h-20 lg:max-[1920px]:w-8" />
        <div className="absolute left-[20%] top-[30%] h-24 w-24 rounded-full border-4 border-transparent border-t-[#061b2a] lg:left-[18%] lg:h-36 lg:w-36 lg:max-[1920px]:h-28 lg:max-[1920px]:w-28" />
        <div className="absolute bottom-10 left-[28%] text-4xl font-light text-[#3e7aa5] lg:max-[1920px]:bottom-7 lg:max-[1920px]:text-3xl">+</div>
        <div className="absolute right-[8%] top-[58%] h-4 w-4 rounded-full bg-[#3e7aa5] lg:h-5 lg:w-5 lg:max-[1920px]:h-4 lg:max-[1920px]:w-4" />
      </div>
      <h1 className="mb-3 text-2xl font-extrabold tracking-[-0.03em] lg:text-3xl lg:max-[1920px]:text-2xl">No assignments yet</h1>
      <p className="mx-auto mb-8 max-w-[640px] text-lg leading-snug text-[#757575] lg:text-2xl lg:max-[1920px]:mb-6 lg:max-[1920px]:max-w-[560px] lg:max-[1920px]:text-xl">
        Create your first assignment to start collecting and grading student submissions. You can set up rubrics,
        define marking criteria, and let AI assist with grading.
      </p>
      <Link href="/create" className="dark-button min-h-12 px-7 text-base lg:min-h-[66px] lg:px-10 lg:text-xl lg:max-[1920px]:min-h-14 lg:max-[1920px]:px-8 lg:max-[1920px]:text-lg">
        <Plus size={26} className="lg:max-[1920px]:h-6 lg:max-[1920px]:w-6" />
        Create Your First Assignment
      </Link>
    </div>
  );
}

export default function AssignmentsPage() {
  const { assignments, fetchAssignments, isLoading } = useAssignmentStore();
  const [query, setQuery] = useState('');

  useEffect(() => {
    fetchAssignments();
  }, [fetchAssignments]);

  const filteredAssignments = useMemo(() => {
    return assignments.filter((assignment) => assignment.title.toLowerCase().includes(query.toLowerCase()));
  }, [assignments, query]);

  return (
    <VedaShell active="assignments" topTitle="Assignment" backHref="/" floatingCreate={assignments.length > 0}>
      {isLoading ? (
        <div className="flex min-h-[55vh] items-center justify-center">
          <Loader2 size={34} className="animate-spin text-[#777]" />
        </div>
      ) : assignments.length === 0 ? (
        <EmptyAssignments />
      ) : (
        <div className="mx-auto max-w-[1360px]">
          <div className="mb-4 hidden items-start gap-4 lg:flex">
            <span className="mt-2 h-6 w-6 rounded-full border-[6px] border-[#84dda7] bg-[#2fc165]" />
            <div>
              <h1 className="text-2xl font-extrabold tracking-[-0.04em]">Assignments</h1>
              <p className="mt-1 text-base text-[#949494]">Manage and create assignments for your classes.</p>
            </div>
          </div>

          <div className="mb-6 flex items-center justify-between lg:hidden">
            <Link href="/" className="flex h-12 w-12 items-center justify-center rounded-full bg-[#e4e4e4]">
              <ArrowLeft size={26} />
            </Link>
            <h1 className="text-base font-extrabold">Assignments</h1>
            <span className="w-12" />
          </div>

          <div className="mb-5 grid grid-cols-[120px_1fr] gap-3 rounded-2xl bg-white p-3 lg:mb-5 lg:flex lg:h-[68px] lg:items-center lg:gap-5 lg:rounded-[22px] lg:px-6">
            <button className="flex items-center gap-2 text-sm font-bold text-[#a0a0a0] lg:text-base">
              <Filter size={21} />
              <span className="hidden lg:inline">Filter By</span>
              <span className="lg:hidden">Filter</span>
            </button>
            <label className="relative lg:ml-auto lg:w-[420px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a7a7a7]" size={23} />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="soft-input h-12 pl-12 pr-4 text-sm lg:h-12 lg:text-base"
                placeholder="Search Assignment"
              />
            </label>
          </div>

          <div className="grid gap-5 lg:grid-cols-2 lg:gap-5">
            {filteredAssignments.map((assignment) => (
              <Link
                key={assignment._id}
                href={`/assignments/${assignment._id}`}
                className="relative min-h-[116px] rounded-[22px] bg-white p-5 shadow-sm transition hover:shadow-md lg:min-h-[170px] lg:rounded-[26px] lg:p-7"
              >
                <MoreVertical className="absolute right-5 top-5 lg:right-6 lg:top-7" size={25} />
                <h2 className="max-w-[80%] text-lg font-extrabold tracking-[-0.04em] underline lg:text-2xl">
                  {assignment.title || 'Quiz on Electricity'}
                </h2>
                <div className="absolute bottom-5 left-5 right-5 flex justify-between gap-3 text-sm lg:bottom-7 lg:left-7 lg:right-7 lg:text-lg">
                  <p className="font-extrabold lg:whitespace-nowrap">
                    Assigned on : <span className="font-medium text-[#777]">{format(new Date(assignment.createdAt), 'dd-MM-yyyy')}</span>
                  </p>
                  <p className="font-extrabold lg:whitespace-nowrap">
                    Due : <span className="font-medium text-[#777]">{format(new Date(assignment.dueDate), 'dd-MM-yyyy')}</span>
                  </p>
                </div>
              </Link>
            ))}
          </div>

          <div className="pointer-events-none fixed bottom-0 left-0 right-0 hidden h-24 bg-gradient-to-t from-[#d1d1d1] to-transparent lg:block" />
          <Link href="/create" className="dark-button fixed bottom-4 left-1/2 hidden min-h-[54px] -translate-x-1/2 px-8 text-base lg:inline-flex">
            <Plus size={24} />
            Create Assignment
          </Link>
        </div>
      )}
    </VedaShell>
  );
}
