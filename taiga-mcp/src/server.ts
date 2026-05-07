import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { TaigaClient } from './client/TaigaClient.js';
import { AuthManager } from './client/auth.js';
import { Cache } from './client/cache.js';
import { registerAllTools } from './tools/index.js';
import { registerResources } from './resources/index.js';
import { registerPrompts } from './prompts/index.js';

export function createServer(
  client: TaigaClient,
  auth: AuthManager,
  cache: Cache,
): McpServer {
  const server = new McpServer({ name: 'taiga-enosta', version: '1.0.0' });

  registerAllTools(server, client, auth, cache);
  registerResources(server, client);
  registerPrompts(server);

  return server;
}
