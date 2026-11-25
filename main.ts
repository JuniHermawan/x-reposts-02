// makefun-x-reposts-02 — quote posts for make.fun's newest X posts.
//
// Pure Node 22 stdlib, deterministic, no network, no dependencies. Holds the
// three quote-post texts as data (each quotes a different @makefunai pool
// post), validates each text (under 280 chars, mentions @makefunai or
// make.fun, carries the play code), copies POSTS.json to the output dir, and
// writes POSTS.txt with the copy-paste instructions for posting each quote.
//
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, writeFileSync, chmodSync } from 'node:fs';
import { join } from 'node:path';

const PLAY_CODE = 'makefun-cricket-canoe-summit';

interface QuotePost {
  poolUrl: string;
  text: string;
}

const POSTS: QuotePost[] = [
  {
    poolUrl: 'https://x.com/makefunai/status/2125609728088666351',
    text: `$19,513 from a typing game built with Claude Code. No team, no funding — just an agent and an idea.
This is why I build on @makefunai: AI agents build software for cash rewards.
makefun-cricket-canoe-summit`,
  },
  {
    poolUrl: 'https://x.com/makefunai/status/2125246707512553850',
    text: `A solo dev with zero coding experience vibe-coded Slotbound to $1.33M in a week.
AI didn't replace the builder — it made the builder possible. My agent builds on @makefunai for the same reason.
makefun-cricket-canoe-summit`,
  },
  {
    poolUrl: 'https://x.com/makefunai/status/2125053632605196760',
    text: `Quit his job with $1,400 left, built a game with Claude in days, profitable in two months.
That's the whole pitch for AI agents building software. Mine builds on @makefunai — make.fun pays USDC for it.
makefun-cricket-canoe-summit`,
  },
];

function validate(posts: QuotePost[]): void {
  posts.forEach((post, i) => {
    const n = i + 1;
    if (post.text.length >= 280) {
      console.error(`post ${n}: ${post.text.length} chars, must be under 280`);
      process.exit(1);
    }
    if (!post.text.includes('@makefunai') && !post.text.includes('make.fun')) {
      console.error(`post ${n}: must mention @makefunai or make.fun`);
      process.exit(1);
    }
    if (!post.text.includes(PLAY_CODE)) {
      console.error(`post ${n}: must contain the play code ${PLAY_CODE}`);
      process.exit(1);
    }
  });
}

function buildPostsTxt(posts: QuotePost[]): string {
  const lines: string[] = [];
  posts.forEach((post, i) => {
    lines.push(`Post ${i + 1} — quote this pool post:`);
    lines.push(post.poolUrl);
    lines.push('');
    lines.push(post.text);
    lines.push('');
    lines.push(`How to post: open the pool post above, tap X's Quote button, paste the text above.`);
    lines.push('');
  });
  return lines.join('\n');
}

// --------------------------------------------------------------------- main
const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? '.';
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? 'out';

validate(POSTS);
mkdirSync(OUTPUT_DIR, { recursive: true });
chmodSync(OUTPUT_DIR, 0o755);

const postsJsonPath = join(OUTPUT_DIR, 'POSTS.json');
copyFileSync(join(BOT_DIR, 'POSTS.json'), postsJsonPath);
chmodSync(postsJsonPath, 0o644);

const postsTxtPath = join(OUTPUT_DIR, 'POSTS.txt');
writeFileSync(postsTxtPath, buildPostsTxt(POSTS), 'utf8');
chmodSync(postsTxtPath, 0o644);

console.log(`POSTS.json + POSTS.txt written to ${OUTPUT_DIR}`);
