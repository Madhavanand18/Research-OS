export interface ResearchProject {
  id: string;
  title: string;
  research_question: string;
  status: 'created' | 'in_progress' | 'completed' | 'failed';
  depth: 'quick' | 'deep' | 'comprehensive';
  summary?: string;
  quality_score: number;
  sources_count: number;
  claims_count: number;
  evidence_count: number;
  statistics_count: number;
  academic_papers_count: number;
  entities_count: number;
  contradictions_count: number;
  gaps_count: number;
  images_count: number;
  created_at: string;
  updated_at?: string;
}

export interface ActivityEvent {
  id: string;
  event_type: string;
  stage: string;
  message: string;
  details?: Record<string, any>;
  timestamp?: string;
  created_at?: string;
}

export interface Source {
  id: string;
  url: string;
  title: string;
  domain?: string;
  snippet?: string;
  source_type: string;
  relevance_score: number;
  quality_score: number;
  published_date?: string;
  is_extracted: boolean;
}

export interface AcademicPaper {
  id: string;
  paper_id?: string;
  title: string;
  abstract?: string;
  authors: Array<{ name: string }>;
  year?: number;
  venue?: string;
  citation_count: number;
  url?: string;
  doi?: string;
  fields_of_study: string[];
}

export interface Claim {
  id: string;
  claim_text: string;
  topic?: string;
  confidence: number;
  is_disputed: boolean;
  supporting_source_ids: string[];
  contradicting_source_ids: string[];
}

export interface Evidence {
  id: string;
  source_id?: string;
  claim_id?: string;
  text: string;
  evidence_type: string;
  relevance: number;
  confidence: number;
  date?: string;
}

export interface Statistic {
  id: string;
  source_id?: string;
  metric: string;
  value: number;
  value_display?: string;
  unit?: string;
  year?: number;
  date?: string;
  geography?: string;
  category?: string;
  confidence: number;
  source_title?: string;
}

export interface Entity {
  id: string;
  name: string;
  entity_type: string;
  description?: string;
  mention_count: number;
  related_claims_count: number;
}

export interface Relationship {
  id: string;
  source_entity: string;
  target_entity: string;
  relation_type: string;
  description?: string;
  supporting_evidence_ids: string[];
}

export interface Contradiction {
  id: string;
  topic: string;
  position_a: string;
  sources_a: string[];
  position_b: string;
  sources_b: string[];
  likely_explanation?: string;
  contradiction_type: string;
  confidence: number;
}

export interface ResearchGap {
  id: string;
  gap_description: string;
  category: string;
  suggested_query?: string;
  resolved: boolean;
}

export interface TimelineEvent {
  id: string;
  date: string;
  year?: number;
  title: string;
  description: string;
  source_id?: string;
  source_title?: string;
  confidence: number;
}

export interface ImageAsset {
  id: string;
  image_url: string;
  source_url?: string;
  source_title?: string;
  caption?: string;
  query?: string;
  attribution?: string;
}

export interface Report {
  id: string;
  title: string;
  executive_summary: string;
  methodology?: string;
  scope?: string;
  key_findings: string[];
  detailed_analysis: string;
  conclusion: string;
  report_markdown: string;
}
