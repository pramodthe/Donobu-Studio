#!/usr/bin/env node
/**
 * Task 2 — reads ./reports/stability-raw/run-{1..5}.json, writes ./reports/STABILITY_EMAIL_REPORT.md
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TASK_ROOT = __dirname;
const RAW_DIR = path.join(TASK_ROOT, 'reports', 'stability-raw');
const OUT = path.join(TASK_ROOT, 'reports', 'STABILITY_EMAIL_REPORT.md');

/** @param {unknown} suite */
function* walkSuite(suite) {
  if (!suite || typeof suite !== 'object') return;
  const s = /** @type {{ specs?: unknown[]; suites?: unknown[] }} */ (suite);
  for (const spec of s.specs || []) {
    const sp = /** @type {{ title?: string; tests?: unknown[] }} */ (spec);
    for (const test of sp.tests || []) {
      const t = /** @type {{ projectName?: string; results?: unknown[] }} */ (test);
      for (const result of t.results || []) {
        const r = /** @type {{ status?: string; error?: { message?: string } }} */ (result);
        yield {
          specTitle: sp.title || '',
          project: t.projectName || '',
          status: r.status || 'unknown',
          errorMessage: r.error?.message || '',
        };
      }
    }
  }
  for (const child of s.suites || []) {
    yield* walkSuite(child);
  }
}

/** @param {unknown} report */
function collectResults(report) {
  const root = /** @type {{ suites?: unknown[] }} */ (report || {});
  const rows = [];
  for (const top of root.suites || []) {
    rows.push(...walkSuite(top));
  }
  return rows;
}

function summarizeRun(rows) {
  const counts = { passed: 0, failed: 0, skipped: 0, timedOut: 0, interrupted: 0, unknown: 0 };
  const failures = [];
  for (const r of rows) {
    const st = r.status;
    if (st === 'passed') counts.passed += 1;
    else if (st === 'failed') {
      counts.failed += 1;
      failures.push({
        specTitle: r.specTitle,
        project: r.project,
        message: (r.errorMessage || '').split('\n')[0].slice(0, 240),
      });
    } else if (st === 'skipped') counts.skipped += 1;
    else if (st === 'timedOut') counts.timedOut += 1;
    else if (st === 'interrupted') counts.interrupted += 1;
    else counts.unknown += 1;
  }
  const total = rows.length;
  return { counts, failures, total };
}

function main() {
  const runs = [];
  for (let i = 1; i <= 5; i += 1) {
    const fp = path.join(RAW_DIR, `run-${i}.json`);
    if (!fs.existsSync(fp)) {
      runs.push({ index: i, missing: true, summary: null, rows: [] });
      continue;
    }
    const raw = fs.readFileSync(fp, 'utf8');
    let report;
    try {
      report = JSON.parse(raw);
    } catch {
      runs.push({ index: i, missing: true, parseError: true, summary: null, rows: [] });
      continue;
    }
    const rows = collectResults(report);
    runs.push({ index: i, missing: false, summary: summarizeRun(rows), rows });
  }

  const present = runs.filter((r) => r.summary);
  const passSeries = present.map((r) => r.summary.counts.passed);
  const failSeries = present.map((r) => r.summary.counts.failed);

  let trend = 'insufficient data';
  if (passSeries.length >= 3) {
    const last = passSeries[passSeries.length - 1];
    const first = passSeries[0];
    const maxFail = Math.max(...failSeries);
    const minFail = Math.min(...failSeries);
    if (maxFail === 0 && minFail === 0) trend = 'stable (all runs green)';
    else if (failSeries[failSeries.length - 1] > failSeries[0]) trend = 'degrading (more failures in later runs)';
    else if (minFail > 0 && maxFail !== minFail) trend = 'flaky (failure count varies across runs)';
    else if (last < first) trend = 'improving (more passes in later runs)';
    else if (maxFail > 0) trend = 'failing consistently';
    else trend = 'mixed';
  }

  const failureKey = (f) => `${f.project} :: ${f.specTitle}`;
  const failureFrequency = new Map();
  for (const r of present) {
    const seen = new Set();
    for (const f of r.summary.failures) {
      const key = failureKey(f);
      if (seen.has(key)) continue;
      seen.add(key);
      failureFrequency.set(key, (failureFrequency.get(key) || 0) + 1);
    }
  }
  const topPatterns = [...failureFrequency.entries()]
    .filter(([, n]) => n >= 2)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 12);

  const now = new Date().toISOString();

  const lines = [];
  lines.push(`# Task 2 — MeetNira stability (before code changes)`);
  lines.push('');
  lines.push(`Generated: ${now}`);
  lines.push('');
  lines.push('## Subject line suggestion');
  lines.push('');
  lines.push(
    `[MeetNira QA] Task 2 stability 5× — ${trend} — runs with data: ${present.length}/5`,
  );
  lines.push('');
  lines.push('## Pass / fail counts per run (Chromium — Task 1 suite)');
  lines.push('');
  lines.push('| Run | Total results | Passed | Failed | Skipped | Interrupted / timedOut |');
  lines.push('|-----|---------------|--------|--------|---------|-------------------------|');
  for (const r of runs) {
    if (r.missing || !r.summary) {
      lines.push(`| ${r.index} | — | — | — | — | (no report file) |`);
      continue;
    }
    const c = r.summary.counts;
    lines.push(
      `| ${r.index} | ${r.summary.total} | ${c.passed} | ${c.failed} | ${c.skipped} | ${c.interrupted + c.timedOut} |`,
    );
  }
  lines.push('');
  lines.push('## Overall trend');
  lines.push('');
  lines.push(trend + '.');
  lines.push('');
  if (present.length && present.every((r) => r.summary.counts.skipped === present[0].summary.counts.skipped)) {
    const sk = present[0].summary.counts.skipped;
    lines.push('## Skipped tests (consistent across runs)');
    lines.push('');
    lines.push(`Each run reported **${sk}** skipped result(s).`);
    lines.push('');
  }
  if (topPatterns.length) {
    lines.push('## Repeated failure patterns (same test failed in 2+ runs)');
    lines.push('');
    for (const [key, n] of topPatterns) {
      lines.push(`- **${n}/5** — ${key}`);
    }
    lines.push('');
  }
  lines.push('## Notable failures (last failing run with details)');
  lines.push('');
  const lastFail = [...present].reverse().find((r) => r.summary.counts.failed > 0);
  if (!lastFail) {
    lines.push('_No failed results in any run with JSON data._');
  } else {
    for (const f of lastFail.summary.failures.slice(0, 15)) {
      lines.push(`- **${f.project}** — ${f.specTitle}`);
      if (f.message) lines.push(`  - ${f.message}`);
    }
  }
  lines.push('');
  lines.push('## How this was produced');
  lines.push('');
  lines.push('- Repo root: `npm run stability:5x` — or `./run-stability-5x.sh` from this folder');
  lines.push('- Raw JSON: `./reports/stability-raw/run-*.json`');
  lines.push('- Regenerate: `npm run stability:report` (root) or `node generate-stability-email-report.mjs` here');
  lines.push('');

  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, lines.join('\n'), 'utf8');
  console.log(`Wrote ${path.relative(TASK_ROOT, OUT)}`);
}

main();
