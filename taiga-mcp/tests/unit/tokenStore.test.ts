import { describe, it, expect, afterEach } from 'vitest';
import { TokenStore } from '../../src/client/tokenStore.js';
import fs from 'fs';
import os from 'os';
import path from 'path';

const tmpFile = path.join(os.tmpdir(), `taiga-mcp-test-${Date.now()}.json`);
const store = new TokenStore(tmpFile);

const sampleConfig = {
  auth_token: 'eyJhbGciOiJIUzI1NiJ9.test',
  refresh_token: 'eyJhbGciOiJIUzI1NiJ9.refresh',
  token_created_at: new Date().toISOString(),
  username: 'testuser',
};

afterEach(() => {
  if (fs.existsSync(tmpFile)) fs.unlinkSync(tmpFile);
  if (fs.existsSync(`${tmpFile}.tmp`)) fs.unlinkSync(`${tmpFile}.tmp`);
});

describe('TokenStore', () => {
  it('saves and loads config correctly', () => {
    store.save(sampleConfig);
    expect(store.load()).toEqual(sampleConfig);
  });

  it('sets file permissions to 600', () => {
    store.save(sampleConfig);
    const stat = fs.statSync(tmpFile);
    expect(stat.mode & 0o777).toBe(0o600);
  });

  it('returns null when file does not exist', () => {
    expect(store.load()).toBeNull();
  });

  it('returns null when file is corrupted JSON', () => {
    fs.writeFileSync(tmpFile, 'not-valid-json', 'utf-8');
    expect(store.load()).toBeNull();
  });

  it('clears the config file', () => {
    store.save(sampleConfig);
    expect(store.exists()).toBe(true);
    store.clear();
    expect(store.exists()).toBe(false);
  });

  it('clear is idempotent when file does not exist', () => {
    expect(() => store.clear()).not.toThrow();
  });
});
