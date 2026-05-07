import axios from 'axios';
// Wraps a tool handler: serializes the return value and formats errors consistently
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function wrapTool(handler) {
    return async (args) => {
        try {
            const result = await handler(args);
            return {
                content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
            };
        }
        catch (err) {
            const message = formatError(err);
            return {
                content: [{ type: 'text', text: message }],
                isError: true,
            };
        }
    };
}
function formatError(err) {
    if (axios.isAxiosError(err)) {
        const status = err.response?.status ?? 'unknown';
        const data = err.response?.data;
        const detail = typeof data === 'object' && data !== null && 'detail' in data
            ? String(data.detail)
            : err.message;
        return `Taiga API error ${status}: ${detail}`;
    }
    if (err instanceof Error) {
        return `Error: ${err.message}`;
    }
    return 'Unknown error occurred';
}
//# sourceMappingURL=utils.js.map