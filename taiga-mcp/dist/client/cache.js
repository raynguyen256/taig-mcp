import NodeCache from 'node-cache';
export class Cache {
    store;
    constructor(defaultTtl = 300) {
        this.store = new NodeCache({ stdTTL: defaultTtl, useClones: false });
    }
    get(key) {
        return this.store.get(key);
    }
    set(key, value, ttl) {
        if (ttl !== undefined) {
            this.store.set(key, value, ttl);
        }
        else {
            this.store.set(key, value);
        }
    }
    del(key) {
        this.store.del(key);
    }
    flush() {
        this.store.flushAll();
    }
}
export const cacheKey = {
    projects: () => 'projects:list',
    projectStats: (id) => `project:${id}:stats`,
    projectIssuesStats: (id) => `project:${id}:issues-stats`,
    userstoryStatuses: (projectId) => `project:${projectId}:us-statuses`,
    taskStatuses: (projectId) => `project:${projectId}:task-statuses`,
    issueStatuses: (projectId) => `project:${projectId}:issue-statuses`,
    issueTypes: (projectId) => `project:${projectId}:issue-types`,
    priorities: (projectId) => `project:${projectId}:priorities`,
    severities: (projectId) => `project:${projectId}:severities`,
    members: (projectId) => `project:${projectId}:members`,
};
//# sourceMappingURL=cache.js.map