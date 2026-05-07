import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { TaigaClient } from '../client/TaigaClient.js';
import { Cache } from '../client/cache.js';
import { TaigaMilestone, TaigaMilestoneStats } from '../types/taiga.js';
import { wrapTool } from './utils.js';

export function registerSprintTools(server: McpServer, client: TaigaClient, _cache: Cache) {
  server.tool(
    'taiga_list_sprints',
    'List all sprints (milestones) for a project. Optionally filter by open/closed status.',
    {
      project_id: z.number().describe('Project ID'),
      closed: z.boolean().optional().describe('true = only closed sprints, false = only open sprints, omit = all'),
    },
    wrapTool(async ({ project_id, closed }) => {
      return client.getAll<TaigaMilestone>('/milestones', { project: project_id, closed });
    }),
  );

  server.tool(
    'taiga_get_sprint',
    'Get details for a specific sprint including its user stories.',
    {
      sprint_id: z.number().describe('Sprint (milestone) ID'),
    },
    wrapTool(async ({ sprint_id }) => {
      return client.get<TaigaMilestone>(`/milestones/${sprint_id}`);
    }),
  );

  server.tool(
    'taiga_get_sprint_stats',
    'Get burndown chart data and completion statistics for a sprint.',
    {
      sprint_id: z.number().describe('Sprint (milestone) ID'),
    },
    wrapTool(async ({ sprint_id }) => {
      return client.get<TaigaMilestoneStats>(`/milestones/${sprint_id}/stats`);
    }),
  );

  server.tool(
    'taiga_create_sprint',
    'Create a new sprint (milestone) for a project.',
    {
      project_id: z.number().describe('Project ID'),
      name: z.string().describe('Sprint name, e.g. "Sprint 5"'),
      estimated_start: z.string().describe('Start date (YYYY-MM-DD)'),
      estimated_finish: z.string().describe('End date (YYYY-MM-DD)'),
    },
    wrapTool(async ({ project_id, name, estimated_start, estimated_finish }) => {
      return client.post<TaigaMilestone>('/milestones', {
        project: project_id,
        name,
        estimated_start,
        estimated_finish,
      });
    }),
  );

  server.tool(
    'taiga_update_sprint',
    'Update sprint details. Must include version for optimistic concurrency.',
    {
      sprint_id: z.number().describe('Sprint (milestone) ID'),
      version: z.number().describe('Current version of the sprint (required for optimistic concurrency)'),
      name: z.string().optional(),
      estimated_start: z.string().optional().describe('YYYY-MM-DD'),
      estimated_finish: z.string().optional().describe('YYYY-MM-DD'),
      closed: z.boolean().optional(),
    },
    wrapTool(async ({ sprint_id, version, name, estimated_start, estimated_finish, closed }) => {
      return client.patch<TaigaMilestone>(`/milestones/${sprint_id}`, {
        version,
        ...(name !== undefined && { name }),
        ...(estimated_start !== undefined && { estimated_start }),
        ...(estimated_finish !== undefined && { estimated_finish }),
        ...(closed !== undefined && { closed }),
      });
    }),
  );
}
