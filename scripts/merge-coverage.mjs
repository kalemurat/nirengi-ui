import fs from 'node:fs';
import path from 'node:path';

const workspaceRoot = process.cwd();
const coverageRoot = path.join(workspaceRoot, 'coverage');
const thresholds = {
  lines: Number(process.env.COVERAGE_LINES ?? 0),
  branches: Number(process.env.COVERAGE_BRANCHES ?? 0),
  functions: Number(process.env.COVERAGE_FUNCTIONS ?? 0),
  statements: Number(process.env.COVERAGE_STATEMENTS ?? 0),
};

const reportPaths = ['nirengi-ui', 'nirengi-ui-kit'].map((project) =>
  path.join(coverageRoot, project, 'index.html')
);

function parseSummary(html) {
  const pattern =
    /<span class="quiet">(Statements|Branches|Functions|Lines)<\/span>\s*<span class='fraction'>(\d+)\/(\d+)<\/span>/g;

  const metrics = {
    statements: { hit: 0, found: 0 },
    branches: { hit: 0, found: 0 },
    functions: { hit: 0, found: 0 },
    lines: { hit: 0, found: 0 },
  };

  for (const match of html.matchAll(pattern)) {
    const metric = match[1].toLowerCase();
    metrics[metric] = {
      hit: Number(match[2]),
      found: Number(match[3]),
    };
  }

  return metrics;
}

function toPct(hit, found) {
  return found === 0 ? 100 : (hit / found) * 100;
}

function printMetric(label, metric) {
  console.log(
    `${label.padEnd(10)}: ${metric.pct.toFixed(2)}% (${metric.hit}/${metric.found})`
  );
}

for (const reportPath of reportPaths) {
  if (!fs.existsSync(reportPath)) {
    console.error(`Coverage report not found: ${reportPath}`);
    process.exit(1);
  }
}

const merged = {
  statements: { hit: 0, found: 0 },
  branches: { hit: 0, found: 0 },
  functions: { hit: 0, found: 0 },
  lines: { hit: 0, found: 0 },
};

for (const reportPath of reportPaths) {
  const html = fs.readFileSync(reportPath, 'utf8');
  const summary = parseSummary(html);

  merged.statements.hit += summary.statements.hit;
  merged.statements.found += summary.statements.found;
  merged.branches.hit += summary.branches.hit;
  merged.branches.found += summary.branches.found;
  merged.functions.hit += summary.functions.hit;
  merged.functions.found += summary.functions.found;
  merged.lines.hit += summary.lines.hit;
  merged.lines.found += summary.lines.found;
}

const metrics = {
  statements: { ...merged.statements, pct: toPct(merged.statements.hit, merged.statements.found) },
  branches: { ...merged.branches, pct: toPct(merged.branches.hit, merged.branches.found) },
  functions: { ...merged.functions, pct: toPct(merged.functions.hit, merged.functions.found) },
  lines: { ...merged.lines, pct: toPct(merged.lines.hit, merged.lines.found) },
};

console.log('\nMerged coverage summary (single score):');
printMetric('Lines', metrics.lines);
printMetric('Functions', metrics.functions);
printMetric('Branches', metrics.branches);
printMetric('Statements', metrics.statements);

const failures = Object.entries(thresholds).filter(
  ([key, threshold]) => metrics[key].pct < threshold
);

if (failures.length > 0) {
  console.warn('\nCoverage threshold check failed:');
  for (const [key, threshold] of failures) {
    console.warn(
      `- ${key}: expected >= ${threshold}%, actual ${metrics[key].pct.toFixed(2)}%`
    );
  }
  process.exit(1);
}

if (failures.length === 0) {
  console.log('\nCoverage threshold check passed.');
}
