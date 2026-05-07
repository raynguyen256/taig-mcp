export declare class Cache {
    private store;
    constructor(defaultTtl?: number);
    get<T>(key: string): T | undefined;
    set<T>(key: string, value: T, ttl?: number): void;
    del(key: string): void;
    flush(): void;
}
export declare const cacheKey: {
    projects: () => string;
    projectStats: (id: number) => string;
    projectIssuesStats: (id: number) => string;
    userstoryStatuses: (projectId: number) => string;
    taskStatuses: (projectId: number) => string;
    issueStatuses: (projectId: number) => string;
    issueTypes: (projectId: number) => string;
    priorities: (projectId: number) => string;
    severities: (projectId: number) => string;
    members: (projectId: number) => string;
};
//# sourceMappingURL=cache.d.ts.map