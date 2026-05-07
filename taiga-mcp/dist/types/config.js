export function loadAppConfig() {
    const baseUrl = process.env.TAIGA_BASE_URL;
    if (!baseUrl)
        throw new Error('TAIGA_BASE_URL environment variable is required');
    if (!baseUrl.startsWith('https://'))
        throw new Error('TAIGA_BASE_URL must use HTTPS');
    const home = process.env.HOME ?? process.env.USERPROFILE ?? '~';
    const defaultConfigFile = `${home}/.taiga-mcp/config.json`;
    return {
        baseUrl,
        username: process.env.TAIGA_USERNAME,
        password: process.env.TAIGA_PASSWORD,
        configFile: process.env.TAIGA_CONFIG_FILE ?? defaultConfigFile,
        tokenRefreshThreshold: parseInt(process.env.TAIGA_TOKEN_REFRESH_THRESHOLD ?? '72000', 10),
        cacheTtl: parseInt(process.env.TAIGA_CACHE_TTL ?? '300', 10),
        requestTimeout: parseInt(process.env.TAIGA_REQUEST_TIMEOUT ?? '30000', 10),
        maxRetries: parseInt(process.env.TAIGA_MAX_RETRIES ?? '3', 10),
        logLevel: process.env.TAIGA_LOG_LEVEL ?? 'info',
    };
}
//# sourceMappingURL=config.js.map