import { z } from 'zod';
import { wrapTool } from './utils.js';
export function registerHistoryTools(server, client, _cache) {
    server.tool('taiga_get_project_timeline', 'Get the activity feed for a project (recent events, changes, comments).', {
        project_id: z.number().describe('Project ID'),
    }, wrapTool(async ({ project_id }) => {
        return client.get(`/timeline/project/${project_id}`);
    }));
    server.tool('taiga_get_user_timeline', 'Get the activity feed for a user (their recent actions across projects).', {
        user_id: z.number().describe('User ID'),
    }, wrapTool(async ({ user_id }) => {
        return client.get(`/timeline/user/${user_id}`);
    }));
}
//# sourceMappingURL=history.js.map