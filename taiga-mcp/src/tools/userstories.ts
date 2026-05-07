import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { TaigaClient } from '../client/TaigaClient.js';
import { Cache } from '../client/cache.js';
import { TaigaUserStory, TaigaHistoryEntry } from '../types/taiga.js';
import { wrapTool } from './utils.js';

export function registerUserStoryTools(server: McpServer, client: TaigaClient, _cache: Cache) {
  server.tool(
    'taiga_list_userstories',
    'List user stories with flexible filters. Returns all results (pagination disabled).',
    {
      project_id: z.number().optional().describe('Filter by project ID'),
      milestone_id: z.number().optional().describe('Filter by sprint ID'),
      milestone__isnull: z.boolean().optional().describe('true = backlog only (no sprint assigned)'),
      in_backlog: z.boolean().optional(),
      status: z.number().optional().describe('Filter by status ID'),
      is_closed: z.boolean().optional(),
      assigned_to: z.number().optional().describe('Filter by assigned user ID'),
      epic: z.number().optional().describe('Filter by epic ID'),
      tags: z.string().optional().describe('Filter by tag name'),
      watchers: z.number().optional().describe('Filter by watcher user ID'),
    },
    wrapTool(async (params) => {
      const { project_id, milestone_id, ...rest } = params;
      return client.getAll<TaigaUserStory>('/userstories', {
        project: project_id,
        milestone: milestone_id,
        ...rest,
      });
    }),
  );

  server.tool(
    'taiga_get_userstory',
    'Get details for a user story by ID or by reference number + project.',
    {
      us_id: z.number().optional().describe('Internal user story ID'),
      ref: z.number().optional().describe('User story reference number (shown in UI as #N)'),
      project_id: z.number().optional().describe('Project ID (required when using ref)'),
    },
    wrapTool(async ({ us_id, ref, project_id }) => {
      if (us_id) return client.get<TaigaUserStory>(`/userstories/${us_id}`);
      if (ref && project_id) return client.get<TaigaUserStory>('/userstories/by_ref', { ref, project: project_id });
      throw new Error('Provide either us_id or both ref and project_id');
    }),
  );

  server.tool(
    'taiga_create_userstory',
    'Create a new user story in a project.',
    {
      project_id: z.number().describe('Project ID'),
      subject: z.string().describe('User story title'),
      description: z.string().optional(),
      milestone_id: z.number().optional().describe('Sprint ID to assign immediately'),
      status: z.number().optional().describe('Status ID'),
      assigned_to: z.number().optional().describe('Assigned user ID'),
      tags: z.array(z.string()).optional(),
      points: z.record(z.string(), z.number()).optional().describe('Story points per role, e.g. {"1": 3}'),
    },
    wrapTool(async ({ project_id, milestone_id, ...rest }) => {
      return client.post<TaigaUserStory>('/userstories', {
        project: project_id,
        milestone: milestone_id ?? null,
        ...rest,
      });
    }),
  );

  server.tool(
    'taiga_update_userstory',
    'Update a user story. Must include version for optimistic concurrency.',
    {
      us_id: z.number().describe('User story ID'),
      version: z.number().describe('Current version (required to prevent conflicting updates)'),
      subject: z.string().optional(),
      description: z.string().optional(),
      status: z.number().optional().describe('New status ID'),
      assigned_to: z.number().nullable().optional().describe('Assigned user ID, or null to unassign'),
      milestone_id: z.number().nullable().optional().describe('Sprint ID, or null to move to backlog'),
      tags: z.array(z.string()).optional(),
      points: z.record(z.string(), z.number()).optional(),
    },
    wrapTool(async ({ us_id, milestone_id, ...rest }) => {
      return client.patch<TaigaUserStory>(`/userstories/${us_id}`, {
        ...(milestone_id !== undefined && { milestone: milestone_id }),
        ...rest,
      });
    }),
  );

  server.tool(
    'taiga_move_userstory_to_sprint',
    'Move one or more user stories to a sprint.',
    {
      project_id: z.number().describe('Project ID'),
      milestone_id: z.number().describe('Target sprint ID'),
      us_ids: z.array(z.number()).describe('List of user story IDs to move'),
    },
    wrapTool(async ({ project_id, milestone_id, us_ids }) => {
      const bulk_stories = us_ids.map((us_id, idx) => ({ us_id, order: idx + 1 }));
      return client.post('/userstories/bulk_update_milestone', {
        project_id,
        milestone_id,
        bulk_stories,
      });
    }),
  );

  server.tool(
    'taiga_get_userstory_history',
    'Get the change history and comments for a user story.',
    {
      us_id: z.number().describe('User story ID'),
    },
    wrapTool(async ({ us_id }) => {
      return client.get<TaigaHistoryEntry[]>(`/history/userstory/${us_id}`);
    }),
  );
}
