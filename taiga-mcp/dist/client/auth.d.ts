import { TokenStore } from './tokenStore.js';
import { AppConfig } from '../types/config.js';
export declare class AuthManager {
    private readonly store;
    private readonly config;
    private token;
    private usingEnvOverride;
    private tokenCreatedAt;
    private username;
    constructor(store: TokenStore, config: AppConfig);
    startup(): Promise<void>;
    login(username?: string, password?: string): Promise<void>;
    refresh(): Promise<void>;
    logout(): void;
    getToken(): string;
    getStatus(): {
        authenticated: boolean;
        username: string | null;
        token_created_at: string | null;
        age_hours: number | null;
        next_refresh_in_hours: number | null;
        using_env_override: boolean;
    };
    private tryRefresh;
}
//# sourceMappingURL=auth.d.ts.map