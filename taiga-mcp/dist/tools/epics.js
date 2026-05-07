import { z } from 'zod';
import { wrapTool } from './utils.js';
export function registerEpicTools(server, client, _cache) {
    server.tool('taiga_list_epics', 'List epics for a project.', {
        project_id: z.number().describe('Project ID'),
        assigned_to: z.number().optional().describe('Filter by assigned user ID'),
        status: z.number().optional().describe('Filter by status ID'),
        tags: z.string().optional(),
    }, wrapTool(async ({ project_id, ...rest }) => {
        return client.getAll('/epics', { project: project_id, ...rest });
    }));
    server.tool('taiga_get_epic', 'Get epic details by ID.', {
        epic_id: z.number().describe('Epic ID'),
    }, wrapTool(async ({ epic_id }) => {
        return client.get(`/epics/${epic_id}`);
    }));
    server.tool('taiga_get_epic_userstories', 'Get all user stories related to an epic.', {
        epic_id: z.number().describe('Epic ID'),
    }, wrapTool(async ({ epic_id }) => {
        return client.get(`/epics/${epic_id}/related_userstories`);
    }));
    server.tool('taiga_create_epic', 'Create a new epic in a project.', {
        project_id: z.number().describe('Project ID'),
        subject: z.string().describe('Epic title'),
        description: z.string().optional(),
        status: z.number().optional().describe('Status ID'),
        assigned_to: z.number().optional(),
        color: z.string().optional().describe('Hex color, e.g. "#ff0000"'),
        tags: z.array(z.string()).optional(),
    }, wrapTool(async ({ project_id, ...rest }) => {
        return client.post('/epics', { project: project_id, ...rest });
    }));
}
//# sourceMappingURL=epics.js.map