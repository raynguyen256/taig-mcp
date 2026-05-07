// Core Taiga API object interfaces

export interface TaigaUser {
  id: number;
  username: string;
  full_name: string;
  email: string;
  bio?: string;
  photo?: string;
}

export interface TaigaProject {
  id: number;
  name: string;
  slug: string;
  description: string;
  is_private: boolean;
  is_backlog_activated: boolean;
  is_issues_activated: boolean;
  is_kanban_activated: boolean;
  is_wiki_activated: boolean;
  total_milestones: number;
  total_story_points: number | null;
  tags: string[];
  members: number[];
}

export interface TaigaProjectStats {
  total_milestones: number;
  total_userstories: number;
  defined_points: number;
  assigned_points: number;
  closed_points: number;
  total_tasks: number;
  completed_tasks: number;
  total_issues: number;
  opened_issues: number;
  closed_issues: number;
}

export interface TaigaMilestone {
  id: number;
  name: string;
  project: number;
  estimated_start: string; // YYYY-MM-DD
  estimated_finish: string;
  closed: boolean;
  total_points: number;
  closed_points: number;
  user_stories?: TaigaUserStory[];
}

export interface TaigaMilestoneStats {
  name: string;
  estimated_start: string;
  estimated_finish: string;
  total_points: number;
  completed_points: number[];
  days: string[];
  total_userstories: number;
  completed_userstories: number;
  total_tasks: number;
  completed_tasks: number;
}

export interface TaigaUserStory {
  id: number;
  ref: number;
  subject: string;
  description: string;
  project: number;
  milestone: number | null;
  status: number;
  status_extra_info?: { name: string; is_closed: boolean };
  assigned_to: number | null;
  assigned_to_extra_info?: { username: string; full_name: string };
  points: Record<string, number>;
  tags: string[];
  version: number;
  is_closed: boolean;
  backlog_order: number;
  sprint_order: number;
}

export interface TaigaTask {
  id: number;
  ref: number;
  subject: string;
  description: string;
  project: number;
  milestone: number | null;
  user_story: number | null;
  status: number;
  status_extra_info?: { name: string; is_closed: boolean };
  assigned_to: number | null;
  assigned_to_extra_info?: { username: string; full_name: string };
  tags: string[];
  version: number;
  is_closed: boolean;
  us_order: number;
}

export interface TaigaIssue {
  id: number;
  ref: number;
  subject: string;
  description: string;
  project: number;
  type: number;
  status: number;
  severity: number;
  priority: number;
  assigned_to: number | null;
  assigned_to_extra_info?: { username: string; full_name: string };
  tags: string[];
  version: number;
  milestone: number | null;
}

export interface TaigaEpic {
  id: number;
  ref: number;
  subject: string;
  description: string;
  project: number;
  status: number;
  assigned_to: number | null;
  color: string;
  tags: string[];
  version: number;
}

export interface TaigaMember {
  id: number;
  user: number;
  username: string;
  full_name: string;
  role: number;
  role_name: string;
  is_admin: boolean;
}

export interface TaigaStatus {
  id: number;
  name: string;
  color: string;
  is_closed: boolean;
  project: number;
  order: number;
}

export interface TaigaIssueType {
  id: number;
  name: string;
  color: string;
  project: number;
  order: number;
}

export interface TaigaPriority {
  id: number;
  name: string;
  color: string;
  project: number;
  order: number;
}

export interface TaigaSeverity {
  id: number;
  name: string;
  color: string;
  project: number;
  order: number;
}

export interface TaigaHistoryEntry {
  id: string;
  created_at: string;
  user: { id: number; username: string; name: string };
  type: number;
  comment: string;
  comment_html?: string;
  diff: Record<string, [unknown, unknown][]>;
  is_hidden: boolean;
}

export interface TaigaTimelineEntry {
  id: number;
  created: string;
  event_type: string;
  data: {
    user?: { username: string; name: string };
    values_diff?: Record<string, [unknown, unknown]>;
    [key: string]: unknown;
  };
}

export interface TaigaSearchResult {
  userstories: Array<{ id: number; ref: number; subject: string }>;
  tasks: Array<{ id: number; ref: number; subject: string }>;
  issues: Array<{ id: number; ref: number; subject: string }>;
  wikipages: Array<{ id: number; slug: string; name: string }>;
}

export interface TaigaAuthResponse {
  auth_token: string;
  refresh: string;
  id: number;
  username: string;
  full_name: string;
  email: string;
}

export interface TaigaRefreshResponse {
  auth_token: string;
}

export interface TaigaWikiPage {
  id: number;
  slug: string;
  content: string;
  project: number;
  version: number;
}
