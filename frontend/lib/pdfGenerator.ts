import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Assignment } from '@/types';
import { format } from 'date-fns';

export const generatePDF = (assignment: Assignment) => {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const paper = assignment.generatedPaper;
  if (!paper) return;

  const pageW = doc.internal.pageSize.getWidth();
  const margin = 20;

  // Header background
  doc.setFillColor(26, 26, 46);
  doc.rect(0, 0, pageW, 40, 'F');

  // Institution name
  doc.setTextColor(232, 169, 0);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('EXAMINATION PAPER', pageW / 2, 15, { align: 'center' });

  // Title
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.text(assignment.title.toUpperCase(), pageW / 2, 28, { align: 'center' });

  // Sub-header
  doc.setFillColor(245, 240, 232);
  doc.rect(0, 40, pageW, 18, 'F');
  doc.setTextColor(26, 26, 46);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');

  const dueDate = format(new Date(assignment.dueDate), 'MMMM dd, yyyy');
  const totalMarks = paper.sections.reduce((acc, s) =>
    acc + s.questions.reduce((qa, q) => qa + q.marks, 0), 0);
  const totalQ = paper.sections.reduce((acc, s) => acc + s.questions.length, 0);

  doc.text(`Date: ${dueDate}`, margin, 50);
  doc.text(`Total Questions: ${totalQ}`, pageW / 2, 50, { align: 'center' });
  doc.text(`Total Marks: ${totalMarks}`, pageW - margin, 50, { align: 'right' });

  // Student info box
  let y = 68;
  doc.setDrawColor(200, 190, 170);
  doc.setFillColor(250, 248, 242);
  doc.roundedRect(margin, y, pageW - margin * 2, 20, 3, 3, 'FD');
  doc.setFontSize(9);
  doc.text('Name: _________________________', margin + 5, y + 8);
  doc.text('Roll No: ___________', pageW / 2, y + 8);
  doc.text('Section: ______', pageW - margin - 50, y + 8);

  y += 28;

  // Instructions
  if (assignment.instructions) {
    doc.setFontSize(9);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(80, 80, 80);
    const lines = doc.splitTextToSize(`General Instructions: ${assignment.instructions}`, pageW - margin * 2);
    doc.text(lines, margin, y);
    y += lines.length * 5 + 4;
  }

  // Sections
  for (const section of paper.sections) {
    // Check page space
    if (y > 260) { doc.addPage(); y = 20; }

    // Section header
    doc.setFillColor(26, 26, 46);
    doc.rect(margin, y, pageW - margin * 2, 10, 'F');
    doc.setTextColor(232, 169, 0);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text(section.title, margin + 5, y + 7);
    y += 12;

    // Section instruction
    doc.setTextColor(80, 80, 100);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'italic');
    doc.text(section.instruction, margin, y);
    y += 8;

    // Questions
    section.questions.forEach((q, i) => {
      if (y > 265) { doc.addPage(); y = 20; }

      const diffColor: Record<string, [number, number, number]> = {
        easy: [34, 197, 94],
        medium: [234, 179, 8],
        hard: [239, 68, 68],
      };

      const [r, g, b] = diffColor[q.difficulty] || [100, 100, 100];

      // Question number + text
      doc.setTextColor(26, 26, 46);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      const questionText = `Q${i + 1}. ${q.question}`;
      const lines = doc.splitTextToSize(questionText, pageW - margin * 2 - 30);
      doc.text(lines, margin, y);

      // Marks
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(26, 26, 46);
      doc.text(`[${q.marks}M]`, pageW - margin, y, { align: 'right' });

      // Difficulty badge
      doc.setFillColor(r, g, b);
      doc.roundedRect(pageW - margin - 28, y - 4, 20, 5, 1, 1, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(7);
      doc.setFont('helvetica', 'normal');
      doc.text(q.difficulty.toUpperCase(), pageW - margin - 18, y - 0.5, { align: 'center' });

      y += lines.length * 6 + 4;
    });

    y += 6;
  }

  // Footer
  const totalPages = (doc as jsPDF & { internal: { getNumberOfPages: () => number } }).internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.setFont('helvetica', 'normal');
    doc.text(`Page ${i} of ${totalPages}`, pageW / 2, 290, { align: 'center' });
    doc.text('AI Assessment Creator', margin, 290);
  }

  doc.save(`${assignment.title.replace(/\s+/g, '_')}_paper.pdf`);
};
