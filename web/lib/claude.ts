import Anthropic from '@anthropic-ai/sdk';
import fs from 'fs';

function getAuthHeaders(): { apiKey?: string; authToken?: string } {
  // 1. Explicit env var (normal API key usage)
  if (process.env.ANTHROPIC_API_KEY) {
    return { apiKey: process.env.ANTHROPIC_API_KEY };
  }

  // 2. Claude Code OAuth token via file descriptor
  const fd = process.env.CLAUDE_CODE_OAUTH_TOKEN_FILE_DESCRIPTOR;
  if (fd) {
    try {
      const token = fs.readFileSync(Number(fd), 'utf8').trim();
      if (token) return { authToken: token };
    } catch {
      // FD not inherited — fall through
    }
  }

  throw new Error('No Anthropic credentials found. Set ANTHROPIC_API_KEY in web/.env.local');
}

let _client: Anthropic | null = null;

export function getClient(): Anthropic {
  if (_client) return _client;
  const { apiKey, authToken } = getAuthHeaders();
  _client = new Anthropic({ apiKey, authToken } as ConstructorParameters<typeof Anthropic>[0]);
  return _client;
}
