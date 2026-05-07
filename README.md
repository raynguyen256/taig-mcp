# taig-mcp

An [MCP](https://modelcontextprotocol.io) server that connects Claude (and other AI agents) to [Taiga](https://taiga.io) project management. Exposes projects, sprints, user stories, tasks, epics, issues, members, history, and search as MCP tools.

## Tools

| Group | Tools |
|---|---|
| Auth | login, logout, auth status |
| Projects | list, get, stats |
| Sprints | list, get, create, update, stats |
| User Stories | list, get, create, update, move to sprint, history |
| Tasks | list, get, create, update, history |
| Issues | list, get, create, update, history |
| Epics | list, get, create, user stories |
| Members | list |
| Search | full-text search across project items |
| Export / Import | export project, import project |

## Requirements

- Node.js 20+
- A running Taiga instance with API v1

## Setup

```bash
cd taiga-mcp
npm install
cp .env.example .env
```

Edit `.env` with your Taiga credentials:

```env
TAIGA_BASE_URL=https://your-taiga.example.com/api/v1
TAIGA_USERNAME=your_username
TAIGA_PASSWORD=your_password
```

Build and start:

```bash
npm run build
npm start
```

## Claude Code / Claude Desktop configuration

Add to your `claude_desktop_config.json` (or `.claude/settings.json` for Claude Code):

```json
{
  "mcpServers": {
    "taiga": {
      "command": "node",
      "args": ["/absolute/path/to/taiga-mcp/dist/index.js"],
      "env": {
        "TAIGA_BASE_URL": "https://your-taiga.example.com/api/v1",
        "TAIGA_USERNAME": "your_username",
        "TAIGA_PASSWORD": "your_password"
      }
    }
  }
}
```

## Development

```bash
npm run dev        # watch mode (recompiles on change)
npm test           # run unit tests
npm run typecheck  # type-check without emitting
```

## Environment variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `TAIGA_BASE_URL` | yes | — | Taiga API base URL |
| `TAIGA_USERNAME` | yes | — | Login username |
| `TAIGA_PASSWORD` | yes | — | Login password |
| `TAIGA_CONFIG_FILE` | no | `~/.taiga-mcp/config.json` | Token persistence path |
| `TAIGA_TOKEN` | no | — | Use a pre-existing token directly |
| `TAIGA_TOKEN_REFRESH_THRESHOLD` | no | `72000` | Seconds before token refresh |
| `TAIGA_CACHE_TTL` | no | `300` | Cache TTL for static data (seconds) |
| `TAIGA_REQUEST_TIMEOUT` | no | `30000` | HTTP timeout (ms) |
| `TAIGA_MAX_RETRIES` | no | `3` | Retry limit for 429/5xx errors |
| `TAIGA_LOG_LEVEL` | no | `info` | `debug` \| `info` \| `warn` \| `error` |
