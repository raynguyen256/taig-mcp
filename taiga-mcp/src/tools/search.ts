import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { TaigaClient } from '../client/TaigaClient.js';
import { Cache, cacheKey } from '../client/cache.js';
import { TaigaSearchResult, TaigaStatus, TaigaIssueType, TaigaPriority, TaigaSeverity } from '../types/taiga.js';
import { wrapTool } from './utils.js';

export function registerSearchTools(server: McpServer, client: TaigaClient, cache: Cache) {
  server.tool(
    'taiga_search',
    'Search across user stories, tasks, issues, and wiki pages in a project.',
    {
      project_id: z.number().describe('Project ID'),
      text: z.string().describe('Search query text'),
    },
    wrapTool(async ({ project_id, text }) => {
      return client.get<TaigaSearchResult>('/search', { project: project_id, text });
    }),
  );

  server.tool(
    'taiga_resolve',
    'Resolve a slug or reference number to internal IDs. Useful for converting project slugs or #ref numbers to numeric IDs.',
    {
      project: z.string().describe('Project slug'),
      us: z.number().optional().describe('User story ref number'),
      issue: z.number().optional().describe('Issue ref number'),
      task: z.number().optional().describe('Task ref number'),
      milestone: z.string().optional().describe('Milestone (sprint) name'),
      wikipage: z.string().optional().describe('Wiki page slug'),
    },
    wrapTool(async (params) => {
      return client.get('/resolver', params);
    }),
  );

  server.tool(
    'taiga_list_userstory_statuses',
    'List all user story statuses for a project (ID, name, is_closed). Use these IDs when creating or filtering user stories.',
    {
      project_id: z.number().describe('Project ID'),
    },
    wrapTool(async ({ project_id }) => {
      const key = cacheKey.userstoryStatuses(project_id);
      const cached = cache.get<TaigaStatus[]>(key);
      if (cached) return cached;
      const data = await client.get<TaigaStatus[]>('/userstory-statuses', { project: project_id });
      cache.set(key, data);
      return data;
    }),
  );

  server.tool(
    'taiga_list_task_statuses',
    'List all task statuses for a project.',
    {
      project_id: z.number().describe('Project ID'),
    },
    wrapTool(async ({ project_id }) => {
      const key = cacheKey.taskStatuses(project_id);
      const cached = cache.get<TaigaStatus[]>(key);
      if (cached) return cached;
      const data = await client.get<TaigaStatus[]>('/task-statuses', { project: project_id });
      cache.set(key, data);
      return data;
    }),
  );

  server.tool(
    'taiga_list_issue_statuses',
    'List all issue statuses for a project.',
    {
      project_id: z.number().describe('Project ID'),
    },
    wrapTool(async ({ project_id }) => {
      const key = cacheKey.issueStatuses(project_id);
      const cached = cache.get<TaigaStatus[]>(key);
      if (cached) return cached;
      const data = await client.get<TaigaStatus[]>('/issue-statuses', { project: project_id });
      cache.set(key, data);
      return data;
    }),
  );

  server.tool(
    'taiga_list_issue_types',
    'List all issue types for a project (Bug, Question, Enhancement, etc.).',
    {
      project_id: z.number().describe('Project ID'),
    },
    wrapTool(async ({ project_id }) => {
      const key = cacheKey.issueTypes(project_id);
      const cached = cache.get<TaigaIssueType[]>(key);
      if (cached) return cached;
      const data = await client.get<TaigaIssueType[]>('/issue-types', { project: project_id });
      cache.set(key, data);
      return data;
    }),
  );

  server.tool(
    'taiga_list_priorities',
    'List all issue priorities for a project (Low, Normal, High, Critical, etc.).',
    {
      project_id: z.number().describe('Project ID'),
    },
    wrapTool(async ({ project_id }) => {
      const key = cacheKey.priorities(project_id);
      const cached = cache.get<TaigaPriority[]>(key);
      if (cached) return cached;
      const data = await client.get<TaigaPriority[]>('/priorities', { project: project_id });
      cache.set(key, data);
      return data;
    }),
  );

  server.tool(
    'taiga_list_severities',
    'List all issue severities for a project (Minor, Normal, Important, Critical, Wishlist).',
    {
      project_id: z.number().describe('Project ID'),
    },
    wrapTool(async ({ project_id }) => {
      const key = cacheKey.severities(project_id);
      const cached = cache.get<TaigaSeverity[]>(key);
      if (cached) return cached;
      const data = await client.get<TaigaSeverity[]>('/severities', { project: project_id });
      cache.set(key, data);
      return data;
    }),
  );
}
