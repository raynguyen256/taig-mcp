import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { TaigaClient } from '../client/TaigaClient.js';
import { Cache } from '../client/cache.js';
import { TaigaTimelineEntry } from '../types/taiga.js';
import { wrapTool } from './utils.js';

export function registerHistoryTools(server: McpServer, client: TaigaClient, _cache: Cache) {
  server.tool(
    'taiga_get_project_timeline',
    'Get the activity feed for a project (recent events, changes, comments).',
    {
      project_id: z.number().describe('Project ID'),
    },
    wrapTool(async ({ project_id }) => {
      return client.get<TaigaTimelineEntry[]>(`/timeline/project/${project_id}`);
    }),
  );

  server.tool(
    'taiga_get_user_timeline',
    'Get the activity feed for a user (their recent actions across projects).',
    {
      user_id: z.number().describe('User ID'),
    },
    wrapTool(async ({ user_id }) => {
      return client.get<TaigaTimelineEntry[]>(`/timeline/user/${user_id}`);
    }),
  );
}
