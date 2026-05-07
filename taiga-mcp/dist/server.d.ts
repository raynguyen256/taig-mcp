import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { TaigaClient } from './client/TaigaClient.js';
import { AuthManager } from './client/auth.js';
import { Cache } from './client/cache.js';
export declare function createServer(client: TaigaClient, auth: AuthManager, cache: Cache): McpServer;
//# sourceMappingURL=server.d.ts.map