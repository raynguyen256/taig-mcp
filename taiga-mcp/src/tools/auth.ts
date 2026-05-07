import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { TaigaClient } from '../client/TaigaClient.js';
import { AuthManager } from '../client/auth.js';
import { TaigaUser } from '../types/taiga.js';
import { wrapTool } from './utils.js';

export function registerAuthTools(server: McpServer, client: TaigaClient, auth: AuthManager) {
  server.tool(
    'taiga_login',
    'Log in to Taiga with username and password. Saves token to disk for reuse across sessions.',
    {
      username: z.string().describe('Taiga username'),
      password: z.string().describe('Taiga password'),
    },
    wrapTool(async ({ username, password }) => {
      await auth.login(username, password);
      const status = auth.getStatus();
      return { message: 'Login successful', username: status.username, token_created_at: status.token_created_at };
    }),
  );

  server.tool(
    'taiga_logout',
    'Log out from Taiga and remove the saved token from disk.',
    {},
    wrapTool(async () => {
      auth.logout();
      return { message: 'Logged out successfully. Token removed from disk.' };
    }),
  );

  server.tool(
    'taiga_auth_status',
    'Check current authentication status: whether the token is valid, its age, and when it will next be refreshed.',
    {},
    wrapTool(async () => {
      return auth.getStatus();
    }),
  );

  server.tool(
    'taiga_get_current_user',
    'Get the profile of the currently authenticated Taiga user.',
    {},
    wrapTool(async () => {
      return client.get<TaigaUser>('/users/me');
    }),
  );
}
