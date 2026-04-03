#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TASK_ROOT = __dirname;
const RAW_DIR = path.join(TASK_ROOT, 'reports', 'stability-raw');
const OUT = path.join(TASK_ROOT, 'reports', 'STABILITY_EMAIL_REPORT.md');

function* walkSuite(suite) {
  if (!suite || typeof suite !== 'object') return;
  const s = suite;
  for (const spec of s.specs || []) {
    for (const test of spec.tests || []) {
      for (const result of test.results || []) {
        yield {
          specTitle: spec.title || '',
          project: test.projectName || '',
          status: result.status || 'unknown',
          errorMessage: result.error?.message || '',
        };
      }
    }
  }
  for (const child of s.suites || []) {
    yield* walkSuite(child);
  }
}

function collectResults(report) {
  const rows = [];
  for (const top of report?.suites || []) rows.push(...walkSuite(top));
  return rows;
}

function summarizeRun(rows) {
  const counts = { passed: 0, failed: 0, skipped: 0, timedOut: 0, interrupted: 0, unknown: 0 };
  const failures = [];
  for (const r of rows) {
    if (r.status === 'passed') counts.passed += 1;
    else if (r.status === 'failed') {
      counts.failed += 1;
      failures.push({
        specTitle: r.specTitle,
        project: r.project,
        message: (r.errorMessage || '').split('\n')[0].slice(0, 240),
      });
    } else if (r.status === 'skipped') counts.skipped += 1;
    else if (r.status === 'timedOut') counts.timedOut += 1;
    else if (r.status === 'interrupted') counts.interrupted += 1;
    else counts.unknown += 1;
  }
  return { counts, failures, total: rows.length };
}

const runFiles = fs.existsSync(RAW_DIR)
  ? fs
      .readdirSync(RAW_DIR, { withFileTypes: true })
      .filter((entry) => entry.isFile() && /^run-\d+\.json$/.test(entry.name))
      .map((entry) => entry.name)
      .sort((a, b) => Number(a.match(/\d+/)?.[0] || 0) - Number(b.match(/\d+/)?.[0] || 0))
  : [];

const runs = runFiles.map((fileName) => {
  const index = Number(fileName.match(/\d+/)?.[0] || 0);
  const raw = fs.readFileSync(path.join(RAW_DIR, fileName), 'utf8');
  const report = JSON.parse(raw);
  return { index, summary: summarizeRun(collectResults(report)) };
});

const present = runs.filter((r) => r.summary);
const failSeries = present.map((r) => r.summary.counts.failed);
let trend = 'insufficient data';
if (present.length >= 2) {
  const maxFail = Math.max(...failSeries);
  const minFail = Math.min(...failSeries);
  if (maxFail === 0) trend = 'stable (all runs green)';
  else if (maxFail !== minFail) trend = 'flaky (failure count varies across runs)';
  else trend = 'failing consistently';
}

const failureFrequency = new Map();
for (const r of present) {
  for (const f of r.summary.failures) {
    const key = `${f.project} :: ${f.specTitle}`;
    failureFrequency.set(key, (failureFrequency.get(key) || 0) + 1);
  }
}

const lines = [
  '# Task 3 — MeetNira stability (after code changes)',
  '',
  `Generated: ${new Date().toISOString()}`,
  '',
  '## Subject line suggestion',
  '',
  `[MeetNira QA] Task 3 stability matrix — ${trend} — runs with data: ${present.length}`,
  '',
  '## Pass / fail counts per run (Chromium — Task 3 matrix)',
  '',
  '| Run | Total results | Passed | Failed | Skipped | Interrupted / timedOut |',
  '|-----|---------------|--------|--------|---------|-------------------------|',
];

for (const r of runs) {
  const c = r.summary.counts;
  lines.push(`| ${r.index} | ${r.summary.total} | ${c.passed} | ${c.failed} | ${c.skipped} | ${c.interrupted + c.timedOut} |`);
}

lines.push('');
lines.push('## Repeated failure patterns');
lines.push('');
if (failureFrequency.size === 0) lines.push('_No repeated failures._');
else {
  for (const [key, count] of [...failureFrequency.entries()].sort((a, b) => b[1] - a[1])) {
    lines.push(`- **${count}/${present.length}** — ${key}`);
  }
}

lines.push('');
lines.push('## How this was produced');
lines.push('');
lines.push('- Repo root: `npm run stability:after`');
lines.push('- Override passes: `MEETNIRA_TASK3_PASSES=<n> npm run stability:after`');
lines.push('- Raw JSON: `./reports/stability-raw/run-*.json`');
lines.push('- Regenerate: `npm run stability:report` in this folder');
lines.push('');

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, lines.join('\n'), 'utf8');
console.log(`Wrote ${path.relative(TASK_ROOT, OUT)}`);
