"use client";

import React, { useState } from "react";
import { Copy, Printer, Check, Download, FileText } from "lucide-react";
import { Report } from "../types/research";

interface ReportViewProps {
  report: Report | null;
}

export const ReportView: React.FC<ReportViewProps> = ({ report }) => {
  const [copied, setCopied] = useState(false);

  if (!report) {
    return (
      <div className="max-w-4xl mx-auto py-16 text-center text-zinc-400 text-xs">
        No report generated yet. Run a research investigation to synthesize the executive report.
      </div>
    );
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(report.report_markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-6 space-y-8">
      {/* Action Toolbar */}
      <div className="flex items-center justify-between border-b border-zinc-200 pb-4 print:hidden">
        <div>
          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-zinc-100 text-zinc-700 uppercase tracking-wider">
            Synthesized Intelligence
          </span>
          <h1 className="text-xl font-bold text-zinc-900 mt-1">Research Report</h1>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleCopy}
            className="flex items-center space-x-1.5 px-3 py-1.5 border border-zinc-200 rounded-md text-xs font-medium text-zinc-700 hover:bg-zinc-50 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "Copied" : "Copy Markdown"}</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-zinc-900 text-white rounded-md text-xs font-medium hover:bg-zinc-800 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Printable Article Content */}
      <article className="bg-white border border-zinc-200 rounded-xl p-8 md:p-12 shadow-sm space-y-8 font-sans leading-relaxed text-zinc-800 print:border-none print:shadow-none print:p-0">
        <header className="border-b border-zinc-100 pb-6 space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
            {report.title}
          </h1>
          <div className="text-xs text-zinc-400">
            ResearchOS Intelligence Platform • Automated Multilateral Triangulation
          </div>
        </header>

        {/* Executive Summary */}
        <section className="space-y-2">
          <h2 className="text-base font-bold text-zinc-900 uppercase tracking-wider">
            Executive Summary
          </h2>
          <p className="text-sm text-zinc-700 leading-relaxed font-normal">
            {report.executive_summary}
          </p>
        </section>

        {/* Key Findings */}
        {report.key_findings && report.key_findings.length > 0 && (
          <section className="space-y-2">
            <h2 className="text-base font-bold text-zinc-900 uppercase tracking-wider">
              Key Findings
            </h2>
            <ul className="list-disc list-inside space-y-1.5 text-sm text-zinc-700">
              {report.key_findings.map((finding, idx) => (
                <li key={idx} className="leading-relaxed">
                  {finding}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Detailed Analysis */}
        <section className="space-y-2">
          <h2 className="text-base font-bold text-zinc-900 uppercase tracking-wider">
            Detailed Analysis
          </h2>
          <div className="text-sm text-zinc-700 whitespace-pre-line leading-relaxed">
            {report.detailed_analysis}
          </div>
        </section>

        {/* Conclusion */}
        <section className="space-y-2 border-t border-zinc-100 pt-6">
          <h2 className="text-base font-bold text-zinc-900 uppercase tracking-wider">
            Conclusion & Outlook
          </h2>
          <p className="text-sm text-zinc-700 leading-relaxed font-normal">
            {report.conclusion}
          </p>
        </section>
      </article>
    </div>
  );
};
