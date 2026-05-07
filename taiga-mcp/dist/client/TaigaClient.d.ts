import { AxiosInstance } from 'axios';
import FormData from 'form-data';
import { AuthManager } from './auth.js';
import { AppConfig } from '../types/config.js';
export declare class TaigaClient {
    private readonly auth;
    readonly http: AxiosInstance;
    constructor(auth: AuthManager, config: AppConfig);
    get<T>(path: string, params?: Record<string, unknown>): Promise<T>;
    getAll<T>(path: string, params?: Record<string, unknown>): Promise<T[]>;
    post<T>(path: string, data?: unknown): Promise<T>;
    patch<T>(path: string, data?: unknown): Promise<T>;
    delete(path: string): Promise<void>;
    postMultipart<T>(path: string, form: FormData): Promise<T>;
}
//# sourceMappingURL=TaigaClient.d.ts.map