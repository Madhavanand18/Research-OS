"use client";

import React, { useState } from "react";
import { ArrowRight, Sparkles, Check, Layers, Sliders } from "lucide-react";

interface NewResearchProps {
  onStartResearch: (question: string, depth: string, options: any) => Promise<void>;
  isLoading: boolean;
}

export const NewResearch: React.FC<NewResearchProps> = ({ onStartResearch, isLoading }) => {
  const suggestedQuery = "What will be the impact of artificial intelligence on employment in India by 2035?";
  const [question, setQuestion] = useState(suggestedQuery);
  const [depth, setDepth] = useState<string>("comprehensive");
  const [options, setOptions] = useState({
    include_statistics: true,
    include_charts: true,
    include_images: true,
    include_academic_papers: true,
    build_knowledge_graph: true,
    detect_contradictions: true,
    detect_research_gaps: true,
  });

  const toggleOption = (key: keyof typeof options) => {
    setOptions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;
    onStartResearch(question, depth, options);
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <div className="text-center space-y-3 mb-10">
        <h1 className="text-4xl font-semibold tracking-tight text-zinc-900">
          Research anything.
        </h1>
        <p className="text-base text-zinc-500 max-w-xl mx-auto font-normal">
          Turn a question into a traceable, multi-sourced body of evidence.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white border border-zinc-200 rounded-xl shadow-sm p-4 focus-within:border-zinc-400 focus-within:ring-1 focus-within:ring-zinc-400 transition-all">
          <label className="block text-xs font-medium text-zinc-400 uppercase tracking-wider mb-2">
            What would you like to investigate?
          </label>
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            rows={4}
            className="w-full text-base text-zinc-900 placeholder-zinc-300 border-0 focus:ring-0 p-0 resize-none font-normal leading-relaxed outline-none"
            placeholder="Type your research question here..."
          />
          <div className="flex justify-between items-center pt-3 border-t border-zinc-100 text-xs">
            <button
              type="button"
              onClick={() => setQuestion(suggestedQuery)}
              className="text-zinc-500 hover:text-zinc-800 transition-colors flex items-center space-x-1"
            >
              <Sparkles className="w-3 h-3 text-zinc-400" />
              <span>Use example question</span>
            </button>
            <span className="text-zinc-400">{question.length} chars</span>
          </div>
        </div>

        {/* Configuration grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-zinc-50/50 border border-zinc-200/80 rounded-xl p-5">
          {/* Depth selection */}
          <div className="space-y-3">
            <label className="text-xs font-semibold text-zinc-700 uppercase tracking-wider flex items-center space-x-1.5">
              <Layers className="w-3.5 h-3.5 text-zinc-500" />
              <span>Research Depth</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "quick", label: "Quick", desc: "~10-15 sources" },
                { id: "deep", label: "Deep", desc: "~20-30 sources" },
                { id: "comprehensive", label: "Comprehensive", desc: "~30-50+ sources" },
              ].map((item) => (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => setDepth(item.id)}
                  className={`p-3 text-left rounded-lg border transition-all ${
                    depth === item.id
                      ? "bg-white border-zinc-900 shadow-sm"
                      : "bg-white/60 border-zinc-200 hover:border-zinc-300"
                  }`}
                >
                  <div className="text-xs font-semibold text-zinc-900">{item.label}</div>
                  <div className="text-[11px] text-zinc-500 mt-0.5">{item.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Research capabilities */}
          <div className="space-y-3">
            <label className="text-xs font-semibold text-zinc-700 uppercase tracking-wider flex items-center space-x-1.5">
              <Sliders className="w-3.5 h-3.5 text-zinc-500" />
              <span>Analysis Features</span>
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {[
                { key: "include_statistics", label: "Extract Statistics" },
                { key: "include_charts", label: "Generate Charts" },
                { key: "include_academic_papers", label: "Academic Search" },
                { key: "build_knowledge_graph", label: "Knowledge Graph" },
                { key: "detect_contradictions", label: "Contradictions" },
                { key: "detect_research_gaps", label: "Research Gaps" },
              ].map((opt) => (
                <label
                  key={opt.key}
                  className="flex items-center space-x-2 bg-white px-2.5 py-1.5 rounded-md border border-zinc-200 cursor-pointer hover:bg-zinc-50"
                >
                  <input
                    type="checkbox"
                    checked={options[opt.key as keyof typeof options]}
                    onChange={() => toggleOption(opt.key as keyof typeof options)}
                    className="rounded border-zinc-300 text-zinc-900 focus:ring-0 w-3.5 h-3.5"
                  />
                  <span className="text-zinc-700 text-xs">{opt.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Submit button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading || !question.trim()}
            className="flex items-center space-x-2 px-6 py-3 bg-zinc-900 text-white rounded-lg text-sm font-medium hover:bg-zinc-800 disabled:opacity-50 transition-all shadow-sm"
          >
            <span>{isLoading ? "Initiating Research..." : "START RESEARCH"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};
