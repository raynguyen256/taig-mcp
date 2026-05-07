type ToolResult = {
    content: Array<{
        type: 'text';
        text: string;
    }>;
    isError?: boolean;
};
export declare function wrapTool<T extends Record<string, any>>(handler: (args: T) => Promise<unknown>): (args: T) => Promise<ToolResult>;
export {};
//# sourceMappingURL=utils.d.ts.map