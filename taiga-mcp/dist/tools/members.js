import { z } from 'zod';
import { cacheKey } from '../client/cache.js';
import { wrapTool } from './utils.js';
export function registerMemberTools(server, client, cache) {
    server.tool('taiga_list_members', 'List all members of a project with their roles.', {
        project_id: z.number().describe('Project ID'),
    }, wrapTool(async ({ project_id }) => {
        const key = cacheKey.members(project_id);
        const cached = cache.get(key);
        if (cached)
            return cached;
        const members = await client.getAll('/memberships', { project: project_id });
        cache.set(key, members);
        return members;
    }));
    server.tool('taiga_get_user', 'Get a user profile by user ID.', {
        user_id: z.number().describe('User ID'),
    }, wrapTool(async ({ user_id }) => {
        return client.get(`/users/${user_id}`);
    }));
    server.tool('taiga_get_user_stats', 'Get activity statistics for a user.', {
        user_id: z.number().describe('User ID'),
    }, wrapTool(async ({ user_id }) => {
        return client.get(`/users/${user_id}/stats`);
    }));
}
//# sourceMappingURL=members.js.map