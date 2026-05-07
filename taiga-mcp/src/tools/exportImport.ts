import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import fs from 'fs';
import path from 'path';
import os from 'os';
import FormData from 'form-data';
import { TaigaClient } from '../client/TaigaClient.js';
import { wrapTool } from './utils.js';

function expandHome(filePath: string): string {
  if (filePath.startsWith('~/')) {
    return path.join(os.homedir(), filePath.slice(2));
  }
  return filePath;
}

export function registerExportImportTools(server: McpServer, client: TaigaClient) {
  server.tool(
    'taiga_export_project',
    'Export an entire Taiga project to a JSON dump file on disk. Useful for backups.',
    {
      project_id: z.number().describe('Project ID to export'),
      output_path: z.string().describe('File path where the JSON dump will be saved, e.g. ~/backups/project-2026-05-07.json'),
    },
    wrapTool(async ({ project_id, output_path }) => {
      const resolvedPath = expandHome(output_path);
      const dir = path.dirname(resolvedPath);

      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      const dump = await client.get<unknown>(`/exporter/${project_id}`);
      const json = JSON.stringify(dump, null, 2);
      fs.writeFileSync(resolvedPath, json, 'utf-8');

      const stats = fs.statSync(resolvedPath);
      const sizeKb = Math.round(stats.size / 1024);

      const summary = typeof dump === 'object' && dump !== null ? {
        userstories: (dump as Record<string, unknown[]>).userstories?.length ?? '?',
        tasks: (dump as Record<string, unknown[]>).tasks?.length ?? '?',
        issues: (dump as Record<string, unknown[]>).issues?.length ?? '?',
        milestones: (dump as Record<string, unknown[]>).milestones?.length ?? '?',
      } : {};

      return {
        message: 'Project exported successfully',
        output_path: resolvedPath,
        size_kb: sizeKb,
        ...summary,
      };
    }),
  );

  server.tool(
    'taiga_import_project',
    'Import a Taiga project from a JSON dump file on disk. Creates a new project.',
    {
      dump_file_path: z.string().describe('Path to the JSON dump file to import, e.g. ~/backups/project-2026-05-07.json'),
    },
    wrapTool(async ({ dump_file_path }) => {
      const resolvedPath = expandHome(dump_file_path);

      if (!fs.existsSync(resolvedPath)) {
        throw new Error(`File not found: ${resolvedPath}`);
      }

      const form = new FormData();
      form.append('dump', fs.createReadStream(resolvedPath), {
        filename: path.basename(resolvedPath),
        contentType: 'application/json',
      });

      const result = await client.postMultipart<{
        id: number;
        name: string;
        slug: string;
      }>('/importer/load_dump', form);

      return {
        message: 'Project imported successfully',
        project_id: result.id,
        project_name: result.name,
        project_slug: result.slug,
      };
    }),
  );
}
