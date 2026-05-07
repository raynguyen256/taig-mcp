import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { TaigaClient } from '../client/TaigaClient.js';
import { AuthManager } from '../client/auth.js';
import { Cache } from '../client/cache.js';
import { registerAuthTools } from './auth.js';
import { registerProjectTools } from './projects.js';
import { registerSprintTools } from './sprints.js';
import { registerUserStoryTools } from './userstories.js';
import { registerTaskTools } from './tasks.js';
import { registerIssueTools } from './issues.js';
import { registerEpicTools } from './epics.js';
import { registerMemberTools } from './members.js';
import { registerHistoryTools } from './history.js';
import { registerSearchTools } from './search.js';
import { registerExportImportTools } from './exportImport.js';

export function registerAllTools(
  server: McpServer,
  client: TaigaClient,
  auth: AuthManager,
  cache: Cache,
): void {
  registerAuthTools(server, client, auth);
  registerProjectTools(server, client, cache);
  registerSprintTools(server, client, cache);
  registerUserStoryTools(server, client, cache);
  registerTaskTools(server, client, cache);
  registerIssueTools(server, client, cache);
  registerEpicTools(server, client, cache);
  registerMemberTools(server, client, cache);
  registerHistoryTools(server, client, cache);
  registerSearchTools(server, client, cache);
  registerExportImportTools(server, client);
}
