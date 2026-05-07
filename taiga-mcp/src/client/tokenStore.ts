import fs from 'fs';
import path from 'path';
import { TokenConfig } from '../types/config.js';

export class TokenStore {
  constructor(private readonly filePath: string) {}

  save(config: TokenConfig): void {
    const dir = path.dirname(this.filePath);
    fs.mkdirSync(dir, { recursive: true });
    // Atomic write: temp file → rename prevents partial writes
    const tmp = `${this.filePath}.tmp`;
    fs.writeFileSync(tmp, JSON.stringify(config, null, 2), 'utf-8');
    fs.chmodSync(tmp, 0o600);
    fs.renameSync(tmp, this.filePath);
  }

  load(): TokenConfig | null {
    if (!fs.existsSync(this.filePath)) return null;
    try {
      const raw = fs.readFileSync(this.filePath, 'utf-8');
      return JSON.parse(raw) as TokenConfig;
    } catch {
      return null;
    }
  }

  clear(): void {
    if (fs.existsSync(this.filePath)) {
      fs.unlinkSync(this.filePath);
    }
  }

  exists(): boolean {
    return fs.existsSync(this.filePath);
  }
}
