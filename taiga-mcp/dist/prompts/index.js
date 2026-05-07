import { z } from 'zod';
export function registerPrompts(server) {
    server.prompt('daily_standup', 'Generate a daily standup report for a project sprint', {
        project_slug: z.string().describe('Project slug, e.g. "taxi-loyal"'),
        sprint_name: z.string().optional().describe('Sprint name; omit for current active sprint'),
    }, ({ project_slug, sprint_name }) => ({
        messages: [{
                role: 'user',
                content: {
                    type: 'text',
                    text: `Generate a daily standup report for project "${project_slug}"${sprint_name ? `, sprint "${sprint_name}"` : ' (current active sprint)'}.

Steps:
1. Call taiga_list_projects to find the project ID for slug "${project_slug}".
2. Call taiga_list_sprints with that project ID and find the active (open) sprint.
3. Call taiga_list_userstories filtered by the sprint to see all user stories.
4. Call taiga_list_tasks filtered by the sprint to see all tasks per member.
5. Call taiga_get_project_timeline to see activity from the last 24 hours.
6. Produce a report grouped by team member with sections: Yesterday / Today / Blockers.`,
                },
            }],
    }));
    server.prompt('sprint_review', 'Generate a sprint review report with velocity and completion analysis', {
        project_slug: z.string().describe('Project slug'),
        sprint_id: z.string().optional().describe('Sprint ID as string; omit for most recently closed sprint'),
    }, ({ project_slug, sprint_id }) => ({
        messages: [{
                role: 'user',
                content: {
                    type: 'text',
                    text: `Generate a sprint review report for project "${project_slug}"${sprint_id ? `, sprint ID ${sprint_id}` : ' (most recently closed sprint)'}.

Steps:
1. Call taiga_list_projects to get the project ID.
2. Call taiga_list_sprints to find the target sprint.
3. Call taiga_get_sprint_stats for burndown/velocity data.
4. Call taiga_list_userstories filtered by the sprint — separate done vs. undone.
5. Call taiga_list_issues if applicable.
6. Report: total story points committed, completed, velocity, what was delivered, what was not, and lessons learned.`,
                },
            }],
    }));
    server.prompt('sprint_planning', 'Help plan a new sprint by analyzing the backlog', {
        project_slug: z.string().describe('Project slug'),
        sprint_capacity: z.string().optional().describe('Team capacity in story points for this sprint'),
    }, ({ project_slug, sprint_capacity }) => ({
        messages: [{
                role: 'user',
                content: {
                    type: 'text',
                    text: `Help plan a new sprint for project "${project_slug}"${sprint_capacity ? ` with a team capacity of ${sprint_capacity} story points` : ''}.

Steps:
1. Call taiga_list_projects to get the project ID.
2. Call taiga_get_project_stats for overall project health context.
3. Call taiga_list_userstories with milestone__isnull=true to get the backlog.
4. Call taiga_list_members to know the team composition.
5. Suggest which user stories should be pulled into the next sprint based on priority and capacity, and recommend how to assign them.`,
                },
            }],
    }));
    server.prompt('project_health_check', 'Evaluate the overall health of a project: overdue items, blockers, velocity trends', {
        project_slug: z.string().describe('Project slug'),
    }, ({ project_slug }) => ({
        messages: [{
                role: 'user',
                content: {
                    type: 'text',
                    text: `Perform a health check on project "${project_slug}".

Steps:
1. Call taiga_get_project with slug "${project_slug}".
2. Call taiga_get_project_stats for high-level numbers.
3. Call taiga_list_sprints to see sprint history and current sprint.
4. Call taiga_get_sprint_stats on the current sprint for burndown data.
5. Call taiga_list_userstories filtered by sprint — identify any past-due or blocked items.
6. Call taiga_list_issues to find open critical/high issues.
7. Provide a health score (Green/Yellow/Red) with specific risks and recommended actions.`,
                },
            }],
    }));
    server.prompt('team_workload', 'Analyze workload distribution across the team for the current sprint', {
        project_slug: z.string().describe('Project slug'),
    }, ({ project_slug }) => ({
        messages: [{
                role: 'user',
                content: {
                    type: 'text',
                    text: `Analyze team workload distribution for project "${project_slug}".

Steps:
1. Call taiga_list_projects to get the project ID.
2. Call taiga_list_members to get all team members.
3. Call taiga_list_sprints to find the active sprint.
4. Call taiga_list_userstories filtered by the sprint — group by assigned_to.
5. Call taiga_list_tasks filtered by the sprint — group by assigned_to.
6. Calculate total story points and task count per person. Identify anyone overloaded (>120% capacity) or underloaded (<60%), and suggest rebalancing.`,
                },
            }],
    }));
    server.prompt('issue_triage', 'Triage and prioritize unassigned or new issues in a project', {
        project_slug: z.string().describe('Project slug'),
    }, ({ project_slug }) => ({
        messages: [{
                role: 'user',
                content: {
                    type: 'text',
                    text: `Triage open issues for project "${project_slug}".

Steps:
1. Call taiga_list_projects to get the project ID.
2. Call taiga_list_issues — filter for unresolved issues; sort by severity and priority.
3. Call taiga_list_members to know who is available.
4. For each critical/high severity issue without an assignee, suggest which team member should handle it based on their current workload.
5. Produce a triage summary table: issue ref, title, severity, priority, suggested assignee, recommended action.`,
                },
            }],
    }));
}
//# sourceMappingURL=index.js.map