import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { TaigaClient } from '../client/TaigaClient.js';
import { Cache } from '../client/cache.js';
import { TaigaTask, TaigaHistoryEntry } from '../types/taiga.js';
import { wrapTool } from './utils.js';

export function registerTaskTools(server: McpServer, client: TaigaClient, _cache: Cache) {
  server.tool(
    'taiga_list_tasks',
    'List tasks with flexible filters. Returns all results (pagination disabled).',
    {
      project_id: z.number().optional().describe('Project ID'),
      milestone_id: z.number().optional().describe('Sprint ID'),
      user_story_id: z.number().optional().describe('User story ID'),
      status: z.number().optional().describe('Status ID'),
      assigned_to: z.number().optional().describe('Assigned user ID'),
      tags: z.string().optional(),
    },
    wrapTool(async ({ project_id, milestone_id, user_story_id, ...rest }) => {
      return client.getAll<TaigaTask>('/tasks', {
        project: project_id,
        milestone: milestone_id,
        user_story: user_story_id,
        ...rest,
      });
    }),
  );

  server.tool(
    'taiga_get_task',
    'Get task details by ID or reference number.',
    {
      task_id: z.number().optional().describe('Internal task ID'),
      ref: z.number().optional().describe('Task reference number'),
      project_id: z.number().optional().describe('Project ID (required with ref)'),
    },
    wrapTool(async ({ task_id, ref, project_id }) => {
      if (task_id) return client.get<TaigaTask>(`/tasks/${task_id}`);
      if (ref && project_id) return client.get<TaigaTask>('/tasks/by_ref', { ref, project: project_id });
      throw new Error('Provide either task_id or both ref and project_id');
    }),
  );

  server.tool(
    'taiga_create_task',
    'Create a new task, optionally linked to a user story and sprint.',
    {
      project_id: z.number().describe('Project ID'),
      subject: z.string().describe('Task title'),
      description: z.string().optional(),
      user_story_id: z.number().optional().describe('Parent user story ID'),
      milestone_id: z.number().optional().describe('Sprint ID'),
      status: z.number().optional().describe('Status ID'),
      assigned_to: z.number().optional().describe('Assigned user ID'),
      tags: z.array(z.string()).optional(),
    },
    wrapTool(async ({ project_id, user_story_id, milestone_id, ...rest }) => {
      return client.post<TaigaTask>('/tasks', {
        project: project_id,
        user_story: user_story_id ?? null,
        milestone: milestone_id ?? null,
        ...rest,
      });
    }),
  );

  server.tool(
    'taiga_update_task',
    'Update a task. Must include version for optimistic concurrency.',
    {
      task_id: z.number().describe('Task ID'),
      version: z.number().describe('Current version (required)'),
      subject: z.string().optional(),
      description: z.string().optional(),
      status: z.number().optional(),
      assigned_to: z.number().nullable().optional(),
      tags: z.array(z.string()).optional(),
    },
    wrapTool(async ({ task_id, ...rest }) => {
      return client.patch<TaigaTask>(`/tasks/${task_id}`, rest);
    }),
  );

  server.tool(
    'taiga_get_task_history',
    'Get the change history and comments for a task.',
    {
      task_id: z.number().describe('Task ID'),
    },
    wrapTool(async ({ task_id }) => {
      return client.get<TaigaHistoryEntry[]>(`/history/task/${task_id}`);
    }),
  );
}
