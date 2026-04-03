# Task 3 — Stability Run #2 (After Code Changes)

Runs the post-change Donobu Page.AI stability matrix across lower- and upper-grade flows. Local runs are headed by default and use 2 workers so multiple browser windows stay visible while Donobu Studio records the agent trace and assertions.

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

## Matrix scenarios

- Grade 2 + Wonder Star → dashboard progress visible
- Grade 1 + Sparkle → topic selection opens start-practice modal
- Grade 6 + Cipher → middle-school dashboard loads topic cards
- Grade 8 + Nova → standards picker opens from a topic

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
