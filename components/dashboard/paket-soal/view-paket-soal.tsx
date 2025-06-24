"use client";

import React, { useState } from "react";
import { Edit, PlusCircle, FileText, Download, List } from "lucide-react";
import { saveAs } from "file-saver";
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from "docx";
import { jsPDF } from "jspdf";
import { Copy, Check } from "lucide-react";
interface Tag {
  tag_id: number;
  tag_name: string;
  user_id: number;
}

interface Question {
  question: string;
  answer: string;
}

interface PaketSoal {
  package_id: number;
  package_name: string;
  user_id: number;
  tags: Tag[];
  questions: Question[];
}

interface ViewPaketSoalProps {
  paketData: PaketSoal;
  onEdit: () => void;
}

export default function ViewPaketSoal({
  paketData,
  onEdit,
}: ViewPaketSoalProps) {
  const [exportMenuOpen, setExportMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const exportToGIFT = () => {
    let giftContent = "";

    paketData.questions.forEach((question, index) => {
      giftContent += `// Question ${index + 1}\n`;
      giftContent += `${question.question} {=${question.answer}}\n\n`;
    });

    const blob = new Blob([giftContent], { type: "text/plain" });
    saveAs(blob, `${paketData.package_name}-gift.txt`);
    setExportMenuOpen(false);
  };

  const exportToWord = () => {
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            new Paragraph({
              text: paketData.package_name,
              heading: HeadingLevel.HEADING_1,
            }),
            new Paragraph({
              text: `Tags: ${paketData.tags
                .map((tag) => tag.tag_name)
                .join(", ")}`,
              spacing: {
                after: 200,
              },
            }),
            ...paketData.questions.flatMap((question, index) => [
              new Paragraph({
                text: `Soal #${index + 1}`,
                heading: HeadingLevel.HEADING_2,
                spacing: {
                  before: 200,
                },
              }),
              new Paragraph({
                text: question.question,
                spacing: {
                  after: 100,
                },
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: "Jawaban: ",
                    bold: true,
                  }),
                  new TextRun({
                    text: question.answer,
                  }),
                ],
                spacing: {
                  after: 200,
                },
              }),
            ]),
          ],
        },
      ],
    });

    Packer.toBlob(doc).then((blob) => {
      saveAs(blob, `${paketData.package_name}.docx`);
      setExportMenuOpen(false);
    });
  };

  const handleCopy = () => {
    const formattedText = paketData.questions
      .map(
        (q, index) => `Soal #${index + 1}: ${q.question}\nJawaban: ${q.answer}`
      )
      .join("\n\n");

    navigator.clipboard.writeText(formattedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    let y = 20;

    doc.setFontSize(18);
    doc.text(paketData.package_name, 20, y);
    y += 10;

    doc.setFontSize(12);
    doc.text(
      `Tags: ${paketData.tags.map((tag) => tag.tag_name).join(", ")}`,
      20,
      y
    );
    y += 15;

    paketData.questions.forEach((question, index) => {
      if (y > 250) {
        doc.addPage();
        y = 20;
      }

      doc.setFontSize(14);
      doc.text(`Soal #${index + 1}`, 20, y);
      y += 8;

      doc.setFontSize(12);

      const questionLines = doc.splitTextToSize(question.question, 170);
      doc.text(questionLines, 20, y);
      y += questionLines.length * 7;

      const answerText = `Jawaban: ${question.answer}`;
      const answerLines = doc.splitTextToSize(answerText, 170);
      doc.text(answerLines, 20, y);
      y += answerLines.length * 7 + 10;
    });

    doc.save(`${paketData.package_name}.pdf`);
    setExportMenuOpen(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium">Tag</h2>
        <div className="flex gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-3 py-1 bg-gray-600 text-white rounded-md mr-2"
            title="Copy to clipboard"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" /> Tersalin
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" /> Salin
              </>
            )}
          </button>

          <div className="relative">
            <button
              onClick={() => setExportMenuOpen(!exportMenuOpen)}
              className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded-md"
            >
              <Download className="w-4 h-4" /> Ekspor
            </button>

            {exportMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border">
                <ul className="py-1">
                  <li>
                    <button
                      onClick={exportToWord}
                      className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 w-full text-left"
                    >
                      <FileText className="w-4 h-4" /> Word (.docx)
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={exportToPDF}
                      className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 w-full text-left"
                    >
                      <FileText className="w-4 h-4" /> PDF (.pdf)
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={exportToGIFT}
                      className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 w-full text-left"
                    >
                      <List className="w-4 h-4" /> Moodle GIFT
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>

          <button
            onClick={onEdit}
            className="flex items-center gap-1 px-3 py-1 bg-black text-white rounded-md"
          >
            <Edit className="w-4 h-4" /> Ubah Paket
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mt-2">
        {paketData.tags.map((tag) => (
          <span
            key={tag.tag_id}
            className="bg-gray-200 px-2 py-1 rounded-md text-sm"
          >
            {tag.tag_name}
          </span>
        ))}
      </div>

      <h2 className="text-lg font-medium mt-6">Daftar Soal</h2>

      {paketData.questions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-4 bg-gray-50 rounded-lg">
          <div className="text-center mb-4">
            <h3 className="text-xl font-medium mb-2">Belum ada soal</h3>
            <p className="text-gray-500">
              Tambahkan soal ke paket ini untuk mulai
            </p>
          </div>
          <button
            onClick={onEdit}
            className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-md"
          >
            <PlusCircle className="w-5 h-5" /> Tambah Soal
          </button>
        </div>
      ) : (
        paketData.questions.map((question, index) => (
          <div key={index} className="border rounded-lg p-4 mt-3">
            <h3 className="font-medium">Soal #{index + 1}</h3>
            <p className="mt-2">{question.question}</p>
            <div className="mt-2 p-3 bg-gray-50 rounded-md">
              <p className="text-sm text-gray-500">Jawaban:</p>
              <p>{question.answer}</p>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
