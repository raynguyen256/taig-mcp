import { TokenConfig } from '../types/config.js';
export declare class TokenStore {
    private readonly filePath;
    constructor(filePath: string);
    save(config: TokenConfig): void;
    load(): TokenConfig | null;
    clear(): void;
    exists(): boolean;
}
//# sourceMappingURL=tokenStore.d.ts.map