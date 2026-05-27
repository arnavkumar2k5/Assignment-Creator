import jsPDF from 'jspdf';
import { Assignment, Question } from '@/types';

const SCHOOL_NAME = 'Delhi Public School, Sector-4, Bokaro';
const SUBJECT = 'English';
const CLASS_NAME = '5th';

export const generatePDF = (assignment: Assignment) => {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const paper = assignment.generatedPaper;
  if (!paper) return;

  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 18;
  const contentW = pageW - margin * 2;
  const questions = paper.sections.flatMap((section) => section.questions);
  const totalMarks = questions.reduce((sum, question) => sum + question.marks, 0);
  let y = 22;

  const ensurePageSpace = (height: number) => {
    if (y + height <= pageH - 18) return;
    doc.addPage();
    y = 18;
  };

  const addWrappedText = (
    text: string,
    x: number,
    maxWidth: number,
    lineHeight: number,
    options?: { indentAfterFirst?: number },
  ) => {
    const lines = doc.splitTextToSize(text, maxWidth);
    lines.forEach((line: string, index: number) => {
      const indent = index > 0 ? options?.indentAfterFirst || 0 : 0;
      doc.text(line, x + indent, y);
      y += lineHeight;
    });
  };

  doc.setTextColor(48, 48, 48);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.text(SCHOOL_NAME, pageW / 2, y, { align: 'center' });

  y += 9;
  doc.setFontSize(14);
  doc.text(`Subject: ${SUBJECT}`, pageW / 2, y, { align: 'center' });

  y += 8;
  doc.text(`Class: ${CLASS_NAME}`, pageW / 2, y, { align: 'center' });

  y += 18;
  doc.setFontSize(11);
  doc.text('Time Allowed: 45 minutes', margin, y);
  doc.text(`Maximum Marks: ${totalMarks || 20}`, pageW - margin, y, { align: 'right' });

  y += 16;
  doc.text('All questions are compulsory unless stated otherwise.', margin, y);

  y += 13;
  doc.text('Name: ______________________', margin, y);
  y += 8;
  doc.text('Roll Number: _______________', margin, y);
  y += 8;
  doc.text(`Class: ${CLASS_NAME} Section: _________`, margin, y);

  y += 18;

  paper.sections.forEach((section, sectionIndex) => {
    ensurePageSpace(38);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text(`Section ${String.fromCharCode(65 + sectionIndex)}`, pageW / 2, y, { align: 'center' });

    y += 14;
    doc.setFontSize(11);
    doc.text(section.title, margin, y);

    y += 7;
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(10);
    addWrappedText(section.instruction, margin, contentW, 5);

    y += 6;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);

    section.questions.forEach((question, questionIndex) => {
      const questionText = `${questionIndex + 1}. [${capitalize(question.difficulty)}] ${question.question} [${question.marks} Marks]`;
      const lines = doc.splitTextToSize(questionText, contentW - 7);
      ensurePageSpace(lines.length * 6 + 5);

      addWrappedText(questionText, margin + 7, contentW - 7, 6, { indentAfterFirst: 5 });
      y += 3;
    });

    y += 7;
  });

  ensurePageSpace(28);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('End of Question Paper', margin, y);

  y += 16;
  ensurePageSpace(14);
  doc.setFontSize(14);
  doc.text('Answer Key:', margin, y);

  y += 10;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);

  questions.forEach((question, index) => {
    const answerText = `${index + 1}. ${answerFor(question)}`;
    const lines = doc.splitTextToSize(answerText, contentW - 7);
    ensurePageSpace(lines.length * 6 + 4);

    addWrappedText(answerText, margin + 7, contentW - 7, 6, { indentAfterFirst: 5 });
    y += 3;
  });

  doc.save(`${assignment.title.replace(/\s+/g, '_')}_paper.pdf`);
};

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function answerFor(question: Question) {
  if (question.question.length < 12) return 'Answers may vary based on the generated question paper.';
  return `${question.question.replace(/\?$/, '')}. A clear, concise response with relevant supporting points is expected.`;
}
