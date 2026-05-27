'use client';

import { useState } from 'react';
import { Download, FileDown, Loader2 } from 'lucide-react';
import { Assignment } from '@/types';
import { generatePDF } from '@/lib/pdfGenerator';
import toast from 'react-hot-toast';

interface Props {
  assignment: Assignment;
}

export default function AssignmentOutput({ assignment }: Props) {
  const [isDownloading, setIsDownloading] = useState(false);
  const paper = assignment.generatedPaper;

  if (!paper) return null;

  const questions = paper.sections.flatMap((section) => section.questions);
  const totalMarks = questions.reduce((sum, question) => sum + question.marks, 0);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      generatePDF(assignment);
      toast.success('PDF downloaded');
    } catch {
      toast.error('PDF generation failed');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="mx-auto max-w-[1200px]">
      <div className="mb-3 rounded-[28px] bg-[#5e5e5e] p-5 lg:p-6">
        <div className="rounded-[24px] bg-[#242424] p-4 text-white lg:p-8">
          <h1 className="mb-5 max-w-[1000px] text-sm font-extrabold leading-snug lg:text-xl">
            Certainly, Lakshya! Here are customized Question Paper for your CBSE Grade 8 Science classes on the NCERT chapters:
          </h1>
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-white px-4 text-sm font-semibold text-[#252525] lg:h-12 lg:px-7 lg:text-base"
          >
            {isDownloading ? <Loader2 size={18} className="animate-spin" /> : <FileDown size={20} />}
            <span className="hidden sm:inline">Download as PDF</span>
          </button>
        </div>
      </div>

      <article className="paper-document rounded-[28px] px-5 py-7 text-sm leading-relaxed lg:rounded-[26px] lg:px-12 lg:py-10 lg:text-lg">
        <header className="mb-9 text-center">
          <h2 className="mx-auto max-w-3xl text-2xl font-extrabold tracking-[-0.04em] lg:text-4xl">Delhi Public School, Sector-4, Bokaro</h2>
          <p className="mt-3 text-lg font-extrabold lg:text-2xl">Subject: English</p>
          <p className="text-lg font-extrabold lg:text-2xl">Class: 5th</p>
        </header>

        <div className="mb-8 grid gap-4 font-extrabold lg:grid-cols-2">
          <p>Time Allowed: 45 minutes</p>
          <p className="lg:text-right">Maximum Marks: {totalMarks || 20}</p>
        </div>

        <p className="mb-8 font-extrabold">All questions are compulsory unless stated otherwise.</p>

        <div className="mb-10 font-extrabold">
          <p>Name: ______________________</p>
          <p>Roll Number: _______________</p>
          <p>Class: 5th Section: _________</p>
        </div>

        {paper.sections.map((section, sectionIndex) => (
          <section key={`${section.title}-${sectionIndex}`} className="mb-10">
            <h3 className="mb-8 text-center text-xl font-extrabold lg:text-3xl">Section {String.fromCharCode(65 + sectionIndex)}</h3>
            <h4 className="font-extrabold">{section.title}</h4>
            <p className="mb-8 italic">{section.instruction}</p>

            <ol className="space-y-4 pl-5 lg:space-y-5">
              {section.questions.map((question, questionIndex) => (
                <li key={`${question.question}-${questionIndex}`} className="pl-1">
                  [{capitalize(question.difficulty)}] {question.question} [{question.marks} Marks]
                </li>
              ))}
            </ol>
          </section>
        ))}

        <p className="mb-10 font-extrabold">End of Question Paper</p>

        <section>
          <h3 className="mb-5 text-lg font-extrabold lg:text-2xl">Answer Key:</h3>
          <ol className="space-y-4 pl-5">
            {questions.map((question, index) => (
              <li key={`${question.question}-answer-${index}`}>
                {answerFor(question.question)}
              </li>
            ))}
          </ol>
        </section>
      </article>

      <button
        onClick={handleDownload}
        disabled={isDownloading}
        className="fixed bottom-24 right-4 z-40 grid h-14 w-14 place-items-center rounded-full bg-white text-[#ff5b2e] shadow-lg lg:hidden"
      >
        {isDownloading ? <Loader2 size={22} className="animate-spin" /> : <Download size={24} />}
      </button>
    </div>
  );
}

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function answerFor(question: string) {
  if (question.length < 12) return 'Answers may vary based on the generated question paper.';
  return `${question.replace(/\?$/, '')}. A clear, concise response with relevant supporting points is expected.`;
}
