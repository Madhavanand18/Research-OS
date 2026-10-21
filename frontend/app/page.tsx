"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "../components/Navbar";
import { NewResearch } from "../components/NewResearch";
import { LiveWorkspace } from "../components/LiveWorkspace";
import { Dashboard } from "../components/Dashboard";
import { SourcesExplorer } from "../components/SourcesExplorer";
import { KnowledgeGraphView } from "../components/KnowledgeGraph";
import { ReportView } from "../components/ReportView";
import { ProjectsList } from "../components/ProjectsList";
import {
  ResearchProject,
  ActivityEvent,
  Source,
  Claim,
  Evidence,
  Statistic,
  AcademicPaper,
  Entity,
  Relationship,
  Contradiction,
  ResearchGap,
  TimelineEvent,
  Report,
} from "../types/research";
import { fetchApi, API_BASE_URL } from "../lib/api";

export default function Home() {
  const [currentTab, setCurrentTab] = useState<string>("new");
  const [projects, setProjects] = useState<ResearchProject[]>([]);
  const [activeProject, setActiveProject] = useState<ResearchProject | null>(null);
  const [events, setEvents] = useState<ActivityEvent[]>([]);
  const [sources, setSources] = useState<Source[]>([]);
  const [claims, setClaims] = useState<Claim[]>([]);
  const [evidence, setEvidence] = useState<Evidence[]>([]);
  const [statistics, setStatistics] = useState<Statistic[]>([]);
  const [academicPapers, setAcademicPapers] = useState<AcademicPaper[]>([]);
  const [entities, setEntities] = useState<Entity[]>([]);
  const [relationships, setRelationships] = useState<Relationship[]>([]);
  const [contradictions, setContradictions] = useState<Contradiction[]>([]);
  const [gaps, setGaps] = useState<ResearchGap[]>([]);
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Load all projects
  const loadProjects = async () => {
    try {
      const data = await fetchApi<ResearchProject[]>("/api/projects");
      setProjects(data);
    } catch (err) {
      console.error("Error loading projects:", err);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  // Load complete data for a specific project
  const loadProjectData = async (projectId: string) => {
    try {
      const [
        p,
        s,
        c,
        e,
        st,
        ap,
        ent,
        rel,
        con,
        g,
        tl,
        rep,
        act
      ] = await Promise.all([
        fetchApi<ResearchProject>(`/api/research/${projectId}`),
        fetchApi<Source[]>(`/api/research/${projectId}/sources`),
        fetchApi<Claim[]>(`/api/research/${projectId}/claims`),
        fetchApi<Evidence[]>(`/api/research/${projectId}/evidence`),
        fetchApi<Statistic[]>(`/api/research/${projectId}/statistics`),
        fetchApi<AcademicPaper[]>(`/api/research/${projectId}/academic`),
        fetchApi<Entity[]>(`/api/research/${projectId}/entities`),
        fetchApi<Relationship[]>(`/api/research/${projectId}/relationships`),
        fetchApi<Contradiction[]>(`/api/research/${projectId}/contradictions`),
        fetchApi<ResearchGap[]>(`/api/research/${projectId}/gaps`),
        fetchApi<TimelineEvent[]>(`/api/research/${projectId}/timeline`),
        fetchApi<Report | null>(`/api/research/${projectId}/report`),
        fetchApi<ActivityEvent[]>(`/api/research/${projectId}/activity`)
      ]);

      setActiveProject(p);
      setSources(s);
      setClaims(c);
      setEvidence(e);
      setStatistics(st);
      setAcademicPapers(ap);
      setEntities(ent);
      setRelationships(rel);
      setContradictions(con);
      setGaps(g);
      setTimeline(tl);
      setReport(rep);
      setEvents(act);
    } catch (err) {
      console.error("Error loading project details:", err);
    }
  };

  // Start new research investigation
  const handleStartResearch = async (question: string, depth: string, options: any) => {
    setLoading(true);
    try {
      const res = await fetchApi<{ id: string; status: string; research_question: string }>("/api/research", {
        method: "POST",
        body: JSON.stringify({ research_question: question, depth, options }),
      });

      const initialProject: ResearchProject = {
        id: res.id,
        title: question,
        research_question: question,
        status: "in_progress",
        depth: depth as any,
        quality_score: 0,
        sources_count: 0,
        claims_count: 0,
        evidence_count: 0,
        statistics_count: 0,
        academic_papers_count: 0,
        entities_count: 0,
        contradictions_count: 0,
        gaps_count: 0,
        images_count: 0,
        created_at: new Date().toISOString(),
      };

      setActiveProject(initialProject);
      setEvents([]);
      setCurrentTab("workspace");

      // Subscribe to Server-Sent Events (SSE)
      const eventSource = new EventSource(`${API_BASE_URL}/api/research/${res.id}/stream`);

      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.event_type && data.event_type !== "connected") {
            setEvents((prev) => [...prev, data]);
          }
          if (data.event_type === "researchcompleted" || data.event_type === "research_failed") {
            eventSource.close();
            loadProjectData(res.id);
            loadProjects();
          }
        } catch (e) {
          console.error("Error parsing SSE event:", e);
        }
      };

      eventSource.onerror = () => {
        eventSource.close();
        loadProjectData(res.id);
      };
    } catch (err: any) {
      alert("Failed to start research: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenProject = async (projectId: string) => {
    await loadProjectData(projectId);
    setCurrentTab("dashboard");
  };

  const handleDeleteProject = async (projectId: string) => {
    if (!confirm("Are you sure you want to delete this research project?")) return;
    try {
      await fetchApi(`/api/projects/${projectId}`, { method: "DELETE" });
      if (activeProject?.id === projectId) {
        setActiveProject(null);
        setCurrentTab("new");
      }
      loadProjects();
    } catch (err) {
      console.error("Failed to delete project:", err);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50/40 text-zinc-900 flex flex-col font-sans">
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        activeProjectId={activeProject?.id}
      />

      <main className="flex-1">
        {currentTab === "new" && (
          <NewResearch onStartResearch={handleStartResearch} isLoading={loading} />
        )}

        {currentTab === "projects" && (
          <ProjectsList
            projects={projects}
            onOpenProject={handleOpenProject}
            onDeleteProject={handleDeleteProject}
            onNewResearch={() => setCurrentTab("new")}
          />
        )}

        {currentTab === "workspace" && (
          <LiveWorkspace
            project={activeProject}
            events={events}
            onOpenDashboard={() => setCurrentTab("dashboard")}
          />
        )}

        {currentTab === "dashboard" && activeProject && (
          <Dashboard
            project={activeProject}
            sources={sources}
            claims={claims}
            evidence={evidence}
            statistics={statistics}
            contradictions={contradictions}
            gaps={gaps}
            timeline={timeline}
            report={report}
            onOpenReport={() => setCurrentTab("report")}
            onOpenKnowledgeGraph={() => setCurrentTab("knowledge")}
          />
        )}

        {currentTab === "sources" && (
          <SourcesExplorer sources={sources} academicPapers={academicPapers} />
        )}

        {currentTab === "knowledge" && (
          <KnowledgeGraphView entities={entities} relationships={relationships} />
        )}

        {currentTab === "report" && <ReportView report={report} />}
      </main>
    </div>
  );
}
