import fs from 'fs';
import path from 'path';
export class TokenStore {
    filePath;
    constructor(filePath) {
        this.filePath = filePath;
    }
    save(config) {
        const dir = path.dirname(this.filePath);
        fs.mkdirSync(dir, { recursive: true });
        // Atomic write: temp file → rename prevents partial writes
        const tmp = `${this.filePath}.tmp`;
        fs.writeFileSync(tmp, JSON.stringify(config, null, 2), 'utf-8');
        fs.chmodSync(tmp, 0o600);
        fs.renameSync(tmp, this.filePath);
    }
    load() {
        if (!fs.existsSync(this.filePath))
            return null;
        try {
            const raw = fs.readFileSync(this.filePath, 'utf-8');
            return JSON.parse(raw);
        }
        catch {
            return null;
        }
    }
    clear() {
        if (fs.existsSync(this.filePath)) {
            fs.unlinkSync(this.filePath);
        }
    }
    exists() {
        return fs.existsSync(this.filePath);
    }
}
//# sourceMappingURL=tokenStore.js.map