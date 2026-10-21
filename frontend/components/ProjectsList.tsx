"use client";

import React from "react";
import { FolderOpen, ArrowRight, Trash2, Calendar, Search } from "lucide-react";
import { ResearchProject } from "../types/research";

interface ProjectsListProps {
  projects: ResearchProject[];
  onOpenProject: (projectId: string) => void;
  onDeleteProject: (projectId: string) => void;
  onNewResearch: () => void;
}

export const ProjectsList: React.FC<ProjectsListProps> = ({
  projects,
  onOpenProject,
  onDeleteProject,
  onNewResearch,
}) => {
  return (
    <div className="max-w-6xl mx-auto py-10 px-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
            Research Projects
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Persisted investigative runs saved in local SQLite storage.
          </p>
        </div>

        <button
          onClick={onNewResearch}
          className="px-4 py-2 bg-zinc-900 text-white rounded-lg text-xs font-medium hover:bg-zinc-800 transition-colors shadow-sm"
        >
          New Investigation
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="bg-white border border-zinc-200 rounded-xl p-12 text-center space-y-3">
          <FolderOpen className="w-8 h-8 text-zinc-300 mx-auto" />
          <h3 className="text-sm font-semibold text-zinc-800">No projects yet</h3>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto">
            Run your first research question to inspect live multi-source intelligence gathering.
          </p>
          <button
            onClick={onNewResearch}
            className="mt-2 px-4 py-2 bg-zinc-900 text-white rounded-lg text-xs font-medium hover:bg-zinc-800 transition-colors"
          >
            Start Research
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((p) => (
            <div
              key={p.id}
              className="bg-white border border-zinc-200 rounded-xl p-5 shadow-sm flex flex-col justify-between space-y-4 hover:border-zinc-300 transition-all"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-semibold px-2 py-0.5 rounded bg-zinc-100 text-zinc-700 capitalize">
                    {p.depth}
                  </span>
                  <span
                    className={`font-semibold px-2 py-0.5 rounded text-[10px] ${
                      p.status === "completed"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : p.status === "in_progress"
                        ? "bg-blue-50 text-blue-700 border border-blue-200"
                        : "bg-zinc-100 text-zinc-600"
                    }`}
                  >
                    {p.status}
                  </span>
                </div>

                <h3 className="text-sm font-semibold text-zinc-900 line-clamp-2 leading-snug">
                  {p.research_question}
                </h3>

                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-zinc-100 text-[11px] text-zinc-500 text-center font-mono">
                  <div>
                    <span className="block font-bold text-zinc-900">{p.sources_count}</span>
                    <span>Sources</span>
                  </div>
                  <div>
                    <span className="block font-bold text-zinc-900">{p.claims_count}</span>
                    <span>Claims</span>
                  </div>
                  <div>
                    <span className="block font-bold text-zinc-900">{p.quality_score}/10</span>
                    <span>Score</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-zinc-100 flex items-center justify-between text-xs">
                <button
                  onClick={() => onDeleteProject(p.id)}
                  className="text-zinc-400 hover:text-red-600 transition-colors"
                  title="Delete project"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => onOpenProject(p.id)}
                  className="flex items-center space-x-1 text-zinc-900 hover:text-blue-600 font-semibold"
                >
                  <span>Open</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
