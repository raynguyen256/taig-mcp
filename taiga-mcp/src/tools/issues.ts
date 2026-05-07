import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { TaigaClient } from '../client/TaigaClient.js';
import { Cache } from '../client/cache.js';
import { TaigaIssue, TaigaHistoryEntry } from '../types/taiga.js';
import { wrapTool } from './utils.js';

export function registerIssueTools(server: McpServer, client: TaigaClient, _cache: Cache) {
  server.tool(
    'taiga_list_issues',
    'List issues with flexible filters. Returns all results (pagination disabled).',
    {
      project_id: z.number().optional().describe('Project ID'),
      status: z.number().optional().describe('Status ID'),
      severity: z.number().optional().describe('Severity ID'),
      priority: z.number().optional().describe('Priority ID'),
      type: z.number().optional().describe('Issue type ID'),
      assigned_to: z.number().optional().describe('Assigned user ID'),
      tags: z.string().optional(),
      order_by: z.enum(['created_date', 'modified_date', 'priority', 'severity']).optional(),
    },
    wrapTool(async ({ project_id, ...rest }) => {
      return client.getAll<TaigaIssue>('/issues', { project: project_id, ...rest });
    }),
  );

  server.tool(
    'taiga_get_issue',
    'Get issue details by ID or reference number.',
    {
      issue_id: z.number().optional().describe('Internal issue ID'),
      ref: z.number().optional().describe('Issue reference number'),
      project_id: z.number().optional().describe('Project ID (required with ref)'),
    },
    wrapTool(async ({ issue_id, ref, project_id }) => {
      if (issue_id) return client.get<TaigaIssue>(`/issues/${issue_id}`);
      if (ref && project_id) return client.get<TaigaIssue>('/issues/by_ref', { ref, project: project_id });
      throw new Error('Provide either issue_id or both ref and project_id');
    }),
  );

  server.tool(
    'taiga_create_issue',
    'Create a new issue. Priority, status, type, and severity IDs are required — use taiga_list_priorities, taiga_list_issue_statuses, etc. to get valid IDs.',
    {
      project_id: z.number().describe('Project ID'),
      subject: z.string().describe('Issue title'),
      priority: z.number().describe('Priority ID'),
      status: z.number().describe('Status ID'),
      type: z.number().describe('Issue type ID'),
      severity: z.number().describe('Severity ID'),
      description: z.string().optional(),
      assigned_to: z.number().optional(),
      milestone_id: z.number().optional().describe('Sprint ID'),
      tags: z.array(z.string()).optional(),
    },
    wrapTool(async ({ project_id, milestone_id, ...rest }) => {
      return client.post<TaigaIssue>('/issues', {
        project: project_id,
        milestone: milestone_id ?? null,
        ...rest,
      });
    }),
  );

  server.tool(
    'taiga_update_issue',
    'Update an issue. Must include version for optimistic concurrency.',
    {
      issue_id: z.number().describe('Issue ID'),
      version: z.number().describe('Current version (required)'),
      subject: z.string().optional(),
      description: z.string().optional(),
      status: z.number().optional(),
      priority: z.number().optional(),
      severity: z.number().optional(),
      type: z.number().optional(),
      assigned_to: z.number().nullable().optional(),
      tags: z.array(z.string()).optional(),
    },
    wrapTool(async ({ issue_id, ...rest }) => {
      return client.patch<TaigaIssue>(`/issues/${issue_id}`, rest);
    }),
  );

  server.tool(
    'taiga_get_issue_history',
    'Get the change history and comments for an issue.',
    {
      issue_id: z.number().describe('Issue ID'),
    },
    wrapTool(async ({ issue_id }) => {
      return client.get<TaigaHistoryEntry[]>(`/history/issue/${issue_id}`);
    }),
  );
}
