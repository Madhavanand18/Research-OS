"use client";

import React from "react";
import {
  Compass,
  FolderOpen,
  Sparkles,
  BookOpen,
  Network,
  FileText,
  Activity,
  Sliders
} from "lucide-react";

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  activeProjectId?: string | null;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, setCurrentTab, activeProjectId }) => {
  const navItems = [
    { id: "new", label: "New Research", icon: Sparkles },
    { id: "projects", label: "Projects", icon: FolderOpen },
    ...(activeProjectId
      ? [
          { id: "workspace", label: "Live Workspace", icon: Activity },
          { id: "dashboard", label: "Dashboard", icon: Compass },
          { id: "sources", label: "Sources", icon: BookOpen },
          { id: "knowledge", label: "Knowledge", icon: Network },
          { id: "report", label: "Report", icon: FileText },
        ]
      : []),
  ];

  return (
    <header className="h-14 border-b border-zinc-200 bg-white sticky top-0 z-40 px-6 flex items-center justify-between">
      <div className="flex items-center space-x-6">
        <div
          onClick={() => setCurrentTab("new")}
          className="flex items-center space-x-2.5 cursor-pointer font-semibold text-zinc-900 tracking-tight"
        >
          <div className="w-7 h-7 rounded-md bg-zinc-900 text-white flex items-center justify-center text-xs font-bold tracking-wider">
            R
          </div>
          <span className="text-base font-bold tracking-tight">ResearchOS</span>
        </div>

        <nav className="flex items-center space-x-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  isActive
                    ? "bg-zinc-100 text-zinc-900 font-semibold"
                    : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? "text-zinc-900" : "text-zinc-400"}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="flex items-center space-x-3 text-xs text-zinc-500">
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
          Engine Online
        </span>
      </div>
    </header>
  );
};
