"use client";

import React, { useEffect, useRef } from "react";
import {
  CheckCircle2,
  CircleDashed,
  Loader2,
  AlertCircle,
  FileSearch,
  BookOpen,
  PieChart,
  GitCommit,
  Split,
  Search,
  ArrowRight
} from "lucide-react";
import { ActivityEvent, ResearchProject } from "../types/research";

interface LiveWorkspaceProps {
  project: ResearchProject | null;
  events: ActivityEvent[];
  onOpenDashboard: () => void;
}

const PIPELINE_STAGES = [
  "Planning",
  "Web Discovery",
  "Academic Discovery",
  "Reading",
  "Evidence Extraction",
  "Statistics Extraction",
  "Knowledge Graph",
  "Contradictions",
  "Synthesis",
  "Report"
];

export const LiveWorkspace: React.FC<LiveWorkspaceProps> = ({ project, events, onOpenDashboard }) => {
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [events]);

  const latestStage = events.length > 0 ? events[events.length - 1].stage : "Planning";
  const isFinished = project?.status === "completed" || latestStage === "Complete";

  return (
    <div className="max-w-7xl mx-auto py-8 px-6 space-y-6">
      {/* Top Banner */}
      <div className="flex items-center justify-between bg-white border border-zinc-200 rounded-xl p-5 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-zinc-100 text-zinc-700 uppercase tracking-wider">
              {project?.depth || "Comprehensive"} Investigation
            </span>
            {isFinished ? (
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                Completed
              </span>
            ) : (
              <span className="flex items-center space-x-1.5 text-xs font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                <Loader2 className="w-3 h-3 animate-spin" />
                <span>Running Pipeline</span>
              </span>
            )}
          </div>
          <h2 className="text-lg font-semibold text-zinc-900 leading-snug">
            {project?.research_question || "Loading research task..."}
          </h2>
        </div>

        {isFinished && (
          <button
            onClick={onOpenDashboard}
            className="flex items-center space-x-2 px-4 py-2 bg-zinc-900 text-white rounded-lg text-xs font-medium hover:bg-zinc-800 transition-all shadow-sm"
          >
            <span>Open Research Dashboard</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* 3-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT: Pipeline Stage Tracker (3 cols) */}
        <div className="lg:col-span-3 bg-white border border-zinc-200 rounded-xl p-5 shadow-sm space-y-4">
          <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
            Research Pipeline
          </h3>
          <div className="space-y-3">
            {PIPELINE_STAGES.map((stage, idx) => {
              const hasPassed = events.some((e) => e.stage.toLowerCase() === stage.toLowerCase()) || isFinished;
              const isCurrent = latestStage.toLowerCase() === stage.toLowerCase() && !isFinished;

              return (
                <div key={stage} className="flex items-center space-x-3 text-xs">
                  {hasPassed && !isCurrent ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  ) : isCurrent ? (
                    <Loader2 className="w-4 h-4 text-blue-600 animate-spin flex-shrink-0" />
                  ) : (
                    <CircleDashed className="w-4 h-4 text-zinc-300 flex-shrink-0" />
                  )}
                  <span
                    className={`font-medium ${
                      isCurrent
                        ? "text-blue-900 font-semibold"
                        : hasPassed
                        ? "text-zinc-800"
                        : "text-zinc-400"
                    }`}
                  >
                    {stage}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* CENTER: Live Activity Stream (6 cols) */}
        <div className="lg:col-span-6 bg-white border border-zinc-200 rounded-xl p-5 shadow-sm flex flex-col h-[520px]">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Live Activity</span>
            </h3>
            <span className="text-[11px] text-zinc-400 font-mono">
              {events.length} events logged
            </span>
          </div>

          <div
            ref={terminalRef}
            className="flex-1 overflow-y-auto py-4 space-y-2.5 font-mono text-xs pr-2"
          >
            {events.length === 0 ? (
              <div className="text-zinc-400 italic text-center py-12">
                Awaiting initial pipeline events...
              </div>
            ) : (
              events.map((ev, i) => (
                <div
                  key={ev.id || i}
                  className="p-2.5 rounded bg-zinc-50 border border-zinc-100/80 space-y-1"
                >
                  <div className="flex items-center justify-between text-[11px] text-zinc-400">
                    <span className="font-semibold text-zinc-700">[{ev.stage}]</span>
                    <span>{ev.timestamp ? new Date(ev.timestamp).toLocaleTimeString() : ""}</span>
                  </div>
                  <div className="text-zinc-800 font-sans text-xs leading-relaxed">
                    {ev.message}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* RIGHT: Live Metrics Counter (3 cols) */}
        <div className="lg:col-span-3 bg-white border border-zinc-200 rounded-xl p-5 shadow-sm space-y-4">
          <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
            Live Metrics
          </h3>
          <div className="grid grid-cols-1 gap-2.5">
            {[
              { label: "Sources Discovered", value: project?.sources_count || 0, icon: Search },
              { label: "Academic Papers", value: project?.academic_papers_count || 0, icon: BookOpen },
              { label: "Extracted Claims", value: project?.claims_count || 0, icon: FileSearch },
              { label: "Evidence Units", value: project?.evidence_count || 0, icon: GitCommit },
              { label: "Statistics Gathered", value: project?.statistics_count || 0, icon: PieChart },
              { label: "Identified Entities", value: project?.entities_count || 0, icon: GitCommit },
              { label: "Contradictions", value: project?.contradictions_count || 0, icon: Split },
              { label: "Research Gaps", value: project?.gaps_count || 0, icon: AlertCircle },
            ].map((m) => {
              const Icon = m.icon;
              return (
                <div
                  key={m.label}
                  className="flex items-center justify-between p-2.5 rounded-lg border border-zinc-100 bg-zinc-50/50"
                >
                  <div className="flex items-center space-x-2 text-xs text-zinc-600">
                    <Icon className="w-3.5 h-3.5 text-zinc-400" />
                    <span>{m.label}</span>
                  </div>
                  <span className="text-sm font-semibold font-mono text-zinc-900">
                    {m.value}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
