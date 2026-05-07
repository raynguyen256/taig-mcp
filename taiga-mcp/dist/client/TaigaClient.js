import axios from 'axios';
export class TaigaClient {
    auth;
    http;
    constructor(auth, config) {
        this.auth = auth;
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
        this.http.interceptors.response.use((res) => res, async (err) => {
            const reqConfig = err.config;
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
        });
    }
    async get(path, params) {
        const res = await this.http.get(path, { params });
        return res.data;
    }
    // Fetches all items by disabling server-side pagination
    async getAll(path, params) {
        const res = await this.http.get(path, {
            params,
            headers: { 'x-disable-pagination': 'True' },
        });
        return res.data;
    }
    async post(path, data) {
        const res = await this.http.post(path, data);
        return res.data;
    }
    async patch(path, data) {
        const res = await this.http.patch(path, data);
        return res.data;
    }
    async delete(path) {
        await this.http.delete(path);
    }
    async postMultipart(path, form) {
        const res = await this.http.post(path, form, {
            headers: form.getHeaders(),
            timeout: 300_000, // 5 minutes for large export/import files
        });
        return res.data;
    }
}
//# sourceMappingURL=TaigaClient.js.map