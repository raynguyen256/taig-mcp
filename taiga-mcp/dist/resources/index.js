import { ResourceTemplate } from '@modelcontextprotocol/sdk/server/mcp.js';
export function registerResources(server, client) {
    // Static resource: all projects
    server.resource('projects', 'taiga://projects', { mimeType: 'application/json', description: 'List of all accessible Taiga projects' }, async () => {
        const projects = await client.getAll('/projects');
        return { contents: [{ uri: 'taiga://projects', text: JSON.stringify(projects, null, 2), mimeType: 'application/json' }] };
    });
    // Dynamic resource: project by slug
    server.resource('project', new ResourceTemplate('taiga://project/{slug}', { list: undefined }), { mimeType: 'application/json', description: 'Project details by slug' }, async (uri, { slug }) => {
        const project = await client.get('/projects/by_slug', { slug });
        return { contents: [{ uri: uri.href, text: JSON.stringify(project, null, 2), mimeType: 'application/json' }] };
    });
    server.resource('project-sprints', new ResourceTemplate('taiga://project/{slug}/sprints', { list: undefined }), { mimeType: 'application/json', description: 'All sprints for a project' }, async (uri, { slug }) => {
        const project = await client.get('/projects/by_slug', { slug });
        const sprints = await client.getAll('/milestones', { project: project.id });
        return { contents: [{ uri: uri.href, text: JSON.stringify(sprints, null, 2), mimeType: 'application/json' }] };
    });
    server.resource('project-backlog', new ResourceTemplate('taiga://project/{slug}/backlog', { list: undefined }), { mimeType: 'application/json', description: 'Backlog user stories (no sprint assigned)' }, async (uri, { slug }) => {
        const project = await client.get('/projects/by_slug', { slug });
        const stories = await client.getAll('/userstories', { project: project.id, milestone__isnull: true });
        return { contents: [{ uri: uri.href, text: JSON.stringify(stories, null, 2), mimeType: 'application/json' }] };
    });
    server.resource('project-members', new ResourceTemplate('taiga://project/{slug}/members', { list: undefined }), { mimeType: 'application/json', description: 'Team members of a project' }, async (uri, { slug }) => {
        const project = await client.get('/projects/by_slug', { slug });
        const members = await client.getAll('/memberships', { project: project.id });
        return { contents: [{ uri: uri.href, text: JSON.stringify(members, null, 2), mimeType: 'application/json' }] };
    });
    server.resource('project-stats', new ResourceTemplate('taiga://project/{slug}/stats', { list: undefined }), { mimeType: 'application/json', description: 'Summary statistics for a project' }, async (uri, { slug }) => {
        const project = await client.get('/projects/by_slug', { slug });
        const stats = await client.get(`/projects/${project.id}/stats`);
        return { contents: [{ uri: uri.href, text: JSON.stringify(stats, null, 2), mimeType: 'application/json' }] };
    });
}
//# sourceMappingURL=index.js.map