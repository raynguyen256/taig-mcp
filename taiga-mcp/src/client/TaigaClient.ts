import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import FormData from 'form-data';
import { AuthManager } from './auth.js';
import { AppConfig } from '../types/config.js';

interface RetryConfig extends AxiosRequestConfig {
  _retried?: boolean;
}

export class TaigaClient {
  readonly http: AxiosInstance;

  constructor(
    private readonly auth: AuthManager,
    config: AppConfig,
  ) {
    this.http = axios.create({
      baseURL: config.baseUrl,
      timeout: config.requestTimeout,
      headers: { 'Content-Type': 'application/json' },
    });

    // Inject auth token on every request
    this.http.interceptors.request.use((req) => {
      req.headers['Authorization'] = `Bearer ${this.auth.getToken()}`;
      return req;
    });

    // Handle 401 (refresh + retry once) and 429 (wait + retry)
    this.http.interceptors.response.use(
      (res) => res,
      async (err) => {
        const reqConfig = err.config as RetryConfig;
        const status = err.response?.status;

        if (status === 401 && !reqConfig._retried) {
          reqConfig._retried = true;
          await this.auth.refresh();
          reqConfig.headers = reqConfig.headers ?? {};
          reqConfig.headers['Authorization'] = `Bearer ${this.auth.getToken()}`;
          return this.http(reqConfig);
        }

        if (status === 429) {
          const retryAfter = parseInt(err.response?.headers?.['retry-after'] ?? '5', 10);
          await new Promise((r) => setTimeout(r, retryAfter * 1000));
          return this.http(reqConfig);
        }

        return Promise.reject(err);
      },
    );
  }

  async get<T>(path: string, params?: Record<string, unknown>): Promise<T> {
    const res = await this.http.get<T>(path, { params });
    return res.data;
  }

  // Fetches all items by disabling server-side pagination
  async getAll<T>(path: string, params?: Record<string, unknown>): Promise<T[]> {
    const res = await this.http.get<T[]>(path, {
      params,
      headers: { 'x-disable-pagination': 'True' },
    });
    return res.data;
  }

  async post<T>(path: string, data?: unknown): Promise<T> {
    const res = await this.http.post<T>(path, data);
    return res.data;
  }

  async patch<T>(path: string, data?: unknown): Promise<T> {
    const res = await this.http.patch<T>(path, data);
    return res.data;
  }

  async delete(path: string): Promise<void> {
    await this.http.delete(path);
  }

  async postMultipart<T>(path: string, form: FormData): Promise<T> {
    const res = await this.http.post<T>(path, form, {
      headers: form.getHeaders(),
      timeout: 300_000, // 5 minutes for large export/import files
    });
    return res.data;
  }
}
