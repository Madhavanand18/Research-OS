"use client";

import React, { useState } from "react";
import {
  FileText,
  Search,
  BookOpen,
  PieChart,
  GitPullRequest,
  AlertTriangle,
  HelpCircle,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Share2,
  Calendar,
  Send
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts";
import {
  ResearchProject,
  Source,
  Claim,
  Evidence,
  Statistic,
  Contradiction,
  ResearchGap,
  TimelineEvent,
  Report
} from "../types/research";
import { fetchApi } from "../lib/api";

interface DashboardProps {
  project: ResearchProject;
  sources: Source[];
  claims: Claim[];
  evidence: Evidence[];
  statistics: Statistic[];
  contradictions: Contradiction[];
  gaps: ResearchGap[];
  timeline: TimelineEvent[];
  report: Report | null;
  onOpenReport: () => void;
  onOpenKnowledgeGraph: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  project,
  sources,
  claims,
  evidence,
  statistics,
  contradictions,
  gaps,
  timeline,
  report,
  onOpenReport,
  onOpenKnowledgeGraph
}) => {
  const [askQuery, setAskQuery] = useState("");
  const [askLoading, setAskLoading] = useState(false);
  const [askResponse, setAskResponse] = useState<string | null>(null);

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!askQuery.trim()) return;
    setAskLoading(true);
    setAskResponse(null);
    try {
      const res = await fetchApi<{ answer: string }>(`/api/research/${project.id}/ask`, {
        method: "POST",
        body: JSON.stringify({ question: askQuery }),
      });
      setAskResponse(res.answer);
    } catch (err: any) {
      setAskResponse("Failed to query research: " + err.message);
    } finally {
      setAskLoading(false);
    }
  };

  const chartData = statistics.slice(0, 6).map((s) => ({
    name: s.metric.length > 20 ? s.metric.slice(0, 18) + "..." : s.metric,
    value: s.value,
    unit: s.unit || "",
  }));

  return (
    <div className="max-w-7xl mx-auto py-8 px-6 space-y-8">
      {/* Top Header Card */}
      <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1 max-w-3xl">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-zinc-100 text-zinc-700 uppercase tracking-wider">
                Research Project
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                Quality Score: {project.quality_score}/10
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
              {project.research_question}
            </h1>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onOpenKnowledgeGraph}
              className="px-3.5 py-2 border border-zinc-200 rounded-lg text-xs font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors"
            >
              Knowledge Graph
            </button>
            <button
              onClick={onOpenReport}
              className="flex items-center space-x-1.5 px-3.5 py-2 bg-zinc-900 text-white rounded-lg text-xs font-semibold hover:bg-zinc-800 transition-colors shadow-sm"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Executive Report</span>
            </button>
          </div>
        </div>

        {project.summary && (
          <div className="p-4 bg-zinc-50 border border-zinc-200/60 rounded-lg text-xs text-zinc-700 leading-relaxed">
            <strong className="text-zinc-900 block font-semibold mb-1">Executive Summary:</strong>
            {project.summary}
          </div>
        )}
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
        {[
          { label: "Sources", val: sources.length },
          { label: "Academic", val: project.academic_papers_count },
          { label: "Claims", val: claims.length },
          { label: "Evidence", val: evidence.length },
          { label: "Statistics", val: statistics.length },
          { label: "Entities", val: project.entities_count },
          { label: "Contradictions", val: contradictions.length },
          { label: "Gaps", val: gaps.length },
        ].map((m) => (
          <div
            key={m.label}
            className="bg-white border border-zinc-200 rounded-xl p-3 shadow-sm text-center"
          >
            <div className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider">
              {m.label}
            </div>
            <div className="text-xl font-bold font-mono text-zinc-900 mt-0.5">
              {m.val}
            </div>
          </div>
        ))}
      </div>

      {/* Two Column Grid: Charts & Statistics vs Contradictions & Gaps */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Statistics & Chart (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-zinc-200 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider flex items-center space-x-1.5">
              <TrendingUp className="w-4 h-4 text-zinc-400" />
              <span>Extracted Statistical Insights</span>
            </h3>
            <span className="text-[11px] text-zinc-400">Real Extracted Data</span>
          </div>

          {chartData.length > 0 ? (
            <div className="h-60 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" />
                  <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#71717a" }} interval={0} angle={-15} textAnchor="end" />
                  <YAxis tick={{ fontSize: 10, fill: "#71717a" }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#18181b", color: "#fff", borderRadius: "8px", fontSize: "11px", border: "none" }}
                    formatter={(val: any, name: any, item: any) => [`${val} ${item.payload.unit}`, "Value"]}
                  />
                  <Bar dataKey="value" fill="#2563eb" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="text-xs text-zinc-400 py-12 text-center">No numerical statistics found to plot.</div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-2">
            {statistics.slice(0, 4).map((s) => (
              <div key={s.id} className="p-2.5 rounded-lg border border-zinc-100 bg-zinc-50/60 text-xs space-y-0.5">
                <div className="text-zinc-500 text-[11px]">{s.metric}</div>
                <div className="font-semibold text-zinc-900 text-sm font-mono">
                  {s.value_display || `${s.value} ${s.unit || ""}`}
                </div>
                <div className="text-[10px] text-zinc-400">
                  {s.geography ? `${s.geography} • ` : ""}{s.year || ""}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contradictions & Gaps (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Contradictions */}
          <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-amber-700 uppercase tracking-wider flex items-center space-x-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>Contradiction Analysis ({contradictions.length})</span>
            </h3>
            {contradictions.length === 0 ? (
              <p className="text-xs text-zinc-400 italic">No empirical divergence or conflicting claims detected.</p>
            ) : (
              <div className="space-y-3">
                {contradictions.map((c) => (
                  <div key={c.id} className="p-3 rounded-lg border border-amber-200 bg-amber-50/40 text-xs space-y-1.5">
                    <div className="font-semibold text-zinc-900">{c.topic}</div>
                    <div className="text-zinc-700 text-[11px]">
                      <span className="font-semibold text-zinc-800">Perspective A:</span> {c.position_a}
                    </div>
                    <div className="text-zinc-700 text-[11px]">
                      <span className="font-semibold text-zinc-800">Perspective B:</span> {c.position_b}
                    </div>
                    {c.likely_explanation && (
                      <div className="text-[10px] text-zinc-500 pt-1 border-t border-amber-200/60 italic">
                        Explanation: {c.likely_explanation}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Research Gaps */}
          <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider flex items-center space-x-1.5">
              <HelpCircle className="w-4 h-4 text-zinc-400" />
              <span>Identified Research Gaps ({gaps.length})</span>
            </h3>
            {gaps.length === 0 ? (
              <p className="text-xs text-zinc-400 italic">No critical evidentiary gaps noted.</p>
            ) : (
              <div className="space-y-2">
                {gaps.map((g) => (
                  <div key={g.id} className="p-2.5 rounded-lg border border-zinc-100 bg-zinc-50 text-xs space-y-1">
                    <div className="text-zinc-800 leading-snug">{g.gap_description}</div>
                    {g.suggested_query && (
                      <div className="text-[10px] text-blue-600 font-mono">
                        Query: {g.suggested_query}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Claims and Timeline Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Core Claims (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-zinc-200 rounded-xl p-5 shadow-sm space-y-3">
          <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
            Key Extracted Claims ({claims.length})
          </h3>
          <div className="space-y-2">
            {claims.map((cl, i) => (
              <div key={cl.id} className="p-3 rounded-lg border border-zinc-100 bg-zinc-50/50 text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-zinc-500 text-[11px]">CLAIM #{i + 1}</span>
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-zinc-200/60 text-zinc-700">
                    Confidence {Math.round(cl.confidence * 100)}%
                  </span>
                </div>
                <div className="text-zinc-900 font-medium leading-relaxed">{cl.claim_text}</div>
                {cl.topic && <div className="text-[10px] text-zinc-400">Topic: {cl.topic}</div>}
              </div>
            ))}
          </div>
        </div>

        {/* Timeline Events (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-zinc-200 rounded-xl p-5 shadow-sm space-y-3">
          <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider flex items-center space-x-1.5">
            <Calendar className="w-4 h-4 text-zinc-400" />
            <span>Timeline Projection ({timeline.length})</span>
          </h3>
          {timeline.length === 0 ? (
            <p className="text-xs text-zinc-400 italic">No structured chronological milestones extracted.</p>
          ) : (
            <div className="space-y-3 border-l-2 border-zinc-200 ml-2 pl-3">
              {timeline.map((t) => (
                <div key={t.id} className="text-xs space-y-0.5 relative">
                  <div className="font-bold text-zinc-900 font-mono text-[11px]">{t.date}</div>
                  <div className="font-semibold text-zinc-800">{t.title}</div>
                  <div className="text-zinc-500 text-[11px]">{t.description}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Ask the Research Section */}
      <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm space-y-4">
        <div>
          <h3 className="text-sm font-bold text-zinc-900">Ask the Research</h3>
          <p className="text-xs text-zinc-500">Query the collected body of claims, sources, and statistics directly.</p>
        </div>

        <form onSubmit={handleAsk} className="flex gap-2">
          <input
            type="text"
            value={askQuery}
            onChange={(e) => setAskQuery(e.target.value)}
            placeholder="e.g. Which sources disagree with the main conclusion? What is the strongest counter-argument?"
            className="flex-1 px-4 py-2 text-xs border border-zinc-200 rounded-lg outline-none focus:border-zinc-400"
          />
          <button
            type="submit"
            disabled={askLoading || !askQuery.trim()}
            className="px-4 py-2 bg-zinc-900 text-white rounded-lg text-xs font-medium hover:bg-zinc-800 disabled:opacity-50 flex items-center space-x-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{askLoading ? "Analyzing..." : "Ask"}</span>
          </button>
        </form>

        {askResponse && (
          <div className="p-4 bg-zinc-50 border border-zinc-200/80 rounded-lg text-xs text-zinc-800 leading-relaxed space-y-1">
            <strong className="block text-zinc-900 font-semibold">Answer:</strong>
            <p className="whitespace-pre-line">{askResponse}</p>
          </div>
        )}
      </div>
    </div>
  );
};
