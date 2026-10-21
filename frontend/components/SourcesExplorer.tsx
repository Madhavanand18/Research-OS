"use client";

import React, { useState } from "react";
import { Search, ExternalLink, Globe, BookOpen, Building, Newspaper } from "lucide-react";
import { Source, AcademicPaper } from "../types/research";

interface SourcesExplorerProps {
  sources: Source[];
  academicPapers: AcademicPaper[];
}

export const SourcesExplorer: React.FC<SourcesExplorerProps> = ({ sources, academicPapers }) => {
  const [filterType, setFilterType] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredSources = sources.filter((s) => {
    const matchesType = filterType === "all" || s.source_type === filterType;
    const matchesSearch =
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.domain && s.domain.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (s.snippet && s.snippet.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesType && matchesSearch;
  });

  const getSourceIcon = (type: string) => {
    switch (type) {
      case "academic":
        return BookOpen;
      case "government":
        return Building;
      case "news":
        return Newspaper;
      default:
        return Globe;
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
            Sources & Academic Explorer
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Browse and inspect all {sources.length} web sources and {academicPapers.length} academic papers.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {/* Search box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by title, domain..."
              className="pl-8 pr-3 py-1.5 text-xs border border-zinc-200 rounded-lg outline-none focus:border-zinc-400 w-52"
            />
          </div>

          {/* Type Filter */}
          <div className="flex bg-zinc-100 p-0.5 rounded-lg text-xs">
            {["all", "web", "government", "industry"].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-3 py-1 rounded-md capitalize font-medium transition-all ${
                  filterType === type ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500 hover:text-zinc-900"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Academic Papers Section if any */}
      {academicPapers.length > 0 && (
        <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-sm space-y-3">
          <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-wider flex items-center space-x-1.5">
            <BookOpen className="w-4 h-4 text-zinc-400" />
            <span>Semantic Scholar Academic Papers ({academicPapers.length})</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {academicPapers.map((p) => (
              <div key={p.id} className="p-3 rounded-lg border border-zinc-100 bg-zinc-50/50 text-xs space-y-1.5">
                <div className="font-semibold text-zinc-900">{p.title}</div>
                <div className="text-zinc-500 text-[11px] line-clamp-2">
                  {p.abstract || "Abstract metadata archived."}
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-zinc-200/50 text-[10px] text-zinc-400">
                  <span>{p.venue || "Academic Venue"} ({p.year || "n/a"})</span>
                  <span>Citations: {p.citation_count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Discovered Web Sources */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSources.map((s) => {
          const Icon = getSourceIcon(s.source_type);
          return (
            <div
              key={s.id}
              className="bg-white border border-zinc-200 rounded-xl p-4 shadow-sm flex flex-col justify-between space-y-3 hover:border-zinc-300 transition-all"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="flex items-center space-x-1 font-semibold text-zinc-500 capitalize">
                    <Icon className="w-3 h-3 text-zinc-400" />
                    <span>{s.source_type}</span>
                  </span>
                  <span className="px-2 py-0.5 rounded bg-zinc-100 font-mono text-[10px] text-zinc-600">
                    Quality: {Math.round(s.quality_score * 100)}%
                  </span>
                </div>
                <h3 className="font-semibold text-xs text-zinc-900 line-clamp-2 leading-snug">
                  {s.title}
                </h3>
                <p className="text-[11px] text-zinc-500 line-clamp-3 leading-relaxed">
                  {s.snippet || "No text snippet recorded."}
                </p>
              </div>

              <div className="pt-2 border-t border-zinc-100 flex items-center justify-between text-[11px]">
                <span className="text-zinc-400 truncate max-w-[150px] font-mono text-[10px]">
                  {s.domain || "web"}
                </span>
                <a
                  href={s.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 font-medium"
                >
                  <span>Visit</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
