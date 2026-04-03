# Task 3 — Cookies And Browser-State Suite

Runs cookie and browser-state coverage for the anonymous free-practice experience. Local runs are headed by default and use 2 workers so browser windows remain visible while Donobu captures the flow and cookie report artifacts.

## Run

From this folder:

```bash
npm run stability:after
```

From repo root:

```bash
npm run stability:after
```

Headless:

```bash
npm run stability:after:headless
```

Override passes:

```bash
MEETNIRA_TASK3_PASSES=3 npm run stability:after
```

## Scenarios

- Privacy page discloses usage and preference data handling
- Grade 1 anonymous free-practice flow writes local browser state and generates a cookie report

## Reports

From this folder:

```bash
npm run report
npm run stability:report
```

From repo root:

```bash
npm run report:task-3
```
