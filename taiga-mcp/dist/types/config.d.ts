export interface TokenConfig {
    auth_token: string;
    refresh_token: string;
    token_created_at: string;
    username: string;
}
export interface AppConfig {
    baseUrl: string;
    username?: string;
    password?: string;
    configFile: string;
    tokenRefreshThreshold: number;
    cacheTtl: number;
    requestTimeout: number;
    maxRetries: number;
    logLevel: string;
}
export declare function loadAppConfig(): AppConfig;
//# sourceMappingURL=config.d.ts.map