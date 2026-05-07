import { z } from 'zod';
import { cacheKey } from '../client/cache.js';
import { wrapTool } from './utils.js';
export function registerProjectTools(server, client, cache) {
    server.tool('taiga_list_projects', 'List all Taiga projects accessible to the current user.', {
        member: z.number().optional().describe('Filter by member user ID'),
        order_by: z.enum(['memberships_count', 'fanpages', 'name', 'modified_date']).optional(),
    }, wrapTool(async ({ member, order_by }) => {
        return client.getAll('/projects', { member, order_by });
    }));
    server.tool('taiga_get_project', 'Get project details by project ID or slug. Provide either project_id or slug.', {
        project_id: z.number().optional().describe('Internal project ID'),
        slug: z.string().optional().describe('Project slug (e.g. "taxi-loyal")'),
    }, wrapTool(async ({ project_id, slug }) => {
        if (slug)
            return client.get('/projects/by_slug', { slug });
        if (project_id)
            return client.get(`/projects/${project_id}`);
        throw new Error('Provide either project_id or slug');
    }));
    server.tool('taiga_get_project_stats', 'Get summary statistics for a project: total US, tasks, issues, story points.', {
        project_id: z.number().describe('Project ID'),
    }, wrapTool(async ({ project_id }) => {
        const key = cacheKey.projectStats(project_id);
        const cached = cache.get(key);
        if (cached)
            return cached;
        const stats = await client.get(`/projects/${project_id}/stats`);
        cache.set(key, stats);
        return stats;
    }));
    server.tool('taiga_get_project_issues_stats', 'Get issue statistics for a project, broken down by type, status, severity, and priority.', {
        project_id: z.number().describe('Project ID'),
    }, wrapTool(async ({ project_id }) => {
        const key = cacheKey.projectIssuesStats(project_id);
        const cached = cache.get(key);
        if (cached)
            return cached;
        const stats = await client.get(`/projects/${project_id}/issues_stats`);
        cache.set(key, stats);
        return stats;
    }));
}
//# sourceMappingURL=projects.js.map