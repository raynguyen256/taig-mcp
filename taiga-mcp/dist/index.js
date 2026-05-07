import 'dotenv/config';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { loadAppConfig } from './types/config.js';
import { TokenStore } from './client/tokenStore.js';
import { AuthManager } from './client/auth.js';
import { TaigaClient } from './client/TaigaClient.js';
import { Cache } from './client/cache.js';
import { createServer } from './server.js';
async function main() {
    const config = loadAppConfig();
    const tokenStore = new TokenStore(config.configFile);
    const auth = new AuthManager(tokenStore, config);
    await auth.startup();
    const client = new TaigaClient(auth, config);
    const cache = new Cache(config.cacheTtl);
    const server = createServer(client, auth, cache);
    const transport = new StdioServerTransport();
    await server.connect(transport);
}
main().catch((err) => {
    process.stderr.write(`Fatal error: ${err.message}\n`);
    process.exit(1);
});
//# sourceMappingURL=index.js.map