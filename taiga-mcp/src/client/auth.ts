import axios from 'axios';
import { TokenStore } from './tokenStore.js';
import { AppConfig, TokenConfig } from '../types/config.js';
import { TaigaAuthResponse, TaigaRefreshResponse } from '../types/taiga.js';

export class AuthManager {
  private token: string | null = null;
  private usingEnvOverride = false;
  private tokenCreatedAt: Date | null = null;
  private username: string | null = null;

  constructor(
    private readonly store: TokenStore,
    private readonly config: AppConfig,
  ) {}

  async startup(): Promise<void> {
    // Env override takes full precedence — no disk access
    if (process.env.TAIGA_TOKEN) {
      this.token = process.env.TAIGA_TOKEN;
      this.usingEnvOverride = true;
      return;
    }

    const existing = this.store.load();

    if (existing) {
      const ageSeconds = (Date.now() - new Date(existing.token_created_at).getTime()) / 1000;

      if (ageSeconds < this.config.tokenRefreshThreshold) {
        const refreshed = await this.tryRefresh(existing.refresh_token);
        if (refreshed) {
          this.token = refreshed;
          this.username = existing.username;
          this.tokenCreatedAt = new Date();
          this.store.save({
            auth_token: refreshed,
            refresh_token: existing.refresh_token,
            token_created_at: this.tokenCreatedAt.toISOString(),
            username: existing.username,
          });
          return;
        }
        // Refresh failed — fall through to full login
      }
    }

    // Full login (first run or token too old or refresh failed)
    await this.login();
  }

  async login(username?: string, password?: string): Promise<void> {
    const user = username ?? this.config.username;
    const pass = password ?? this.config.password;
    if (!user || !pass) {
      throw new Error('TAIGA_USERNAME and TAIGA_PASSWORD are required for login');
    }

    const res = await axios.post<TaigaAuthResponse>(
      `${this.config.baseUrl}/auth`,
      { username: user, password: pass, type: 'normal' },
    );

    this.token = res.data.auth_token;
    this.username = res.data.username;
    this.tokenCreatedAt = new Date();

    this.store.save({
      auth_token: res.data.auth_token,
      refresh_token: res.data.refresh,
      token_created_at: this.tokenCreatedAt.toISOString(),
      username: res.data.username,
    });
  }

  async refresh(): Promise<void> {
    if (this.usingEnvOverride) return;

    const stored = this.store.load();
    if (!stored) {
      await this.login();
      return;
    }

    const newToken = await this.tryRefresh(stored.refresh_token);
    if (newToken) {
      this.token = newToken;
      this.tokenCreatedAt = new Date();
      this.store.save({ ...stored, auth_token: newToken, token_created_at: this.tokenCreatedAt.toISOString() });
    } else {
      await this.login();
    }
  }

  logout(): void {
    this.token = null;
    this.tokenCreatedAt = null;
    this.username = null;
    this.store.clear();
  }

  getToken(): string {
    if (!this.token) throw new Error('Not authenticated. Call taiga_login first.');
    return this.token;
  }

  getStatus(): {
    authenticated: boolean;
    username: string | null;
    token_created_at: string | null;
    age_hours: number | null;
    next_refresh_in_hours: number | null;
    using_env_override: boolean;
  } {
    const ageMs = this.tokenCreatedAt ? Date.now() - this.tokenCreatedAt.getTime() : null;
    const ageHours = ageMs !== null ? ageMs / 3_600_000 : null;
    const thresholdHours = this.config.tokenRefreshThreshold / 3600;
    const nextRefreshInHours = ageHours !== null ? Math.max(0, thresholdHours - ageHours) : null;

    return {
      authenticated: this.token !== null,
      username: this.username,
      token_created_at: this.tokenCreatedAt?.toISOString() ?? null,
      age_hours: ageHours !== null ? Math.round(ageHours * 10) / 10 : null,
      next_refresh_in_hours: nextRefreshInHours !== null ? Math.round(nextRefreshInHours * 10) / 10 : null,
      using_env_override: this.usingEnvOverride,
    };
  }

  private async tryRefresh(refreshToken: string): Promise<string | null> {
    try {
      const res = await axios.post<TaigaRefreshResponse>(
        `${this.config.baseUrl}/auth/refresh`,
        { refresh: refreshToken },
      );
      return res.data.auth_token;
    } catch {
      return null;
    }
  }
}
