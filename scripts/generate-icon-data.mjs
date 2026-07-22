/**
 * Generates the library's icon data set from the upstream `remixicon` package.
 *
 * The UI kit deliberately has **no runtime icon dependency**: instead of wrapping
 * a third-party Angular icon library (whose peer range repeatedly blocked us on
 * new Angular majors — see issue #28), we consume RemixIcon's framework-agnostic
 * SVG assets and emit a plain TypeScript constant that is committed to the repo.
 *
 * Every RemixIcon asset is a 24x24 `<svg>` containing exactly one `<path>`, so the
 * generated map holds only the raw `d` attribute per icon. `IconComponent` renders
 * it through `[attr.d]`, which means no `innerHTML`, no sanitizer bypass, and no
 * XSS surface.
 *
 * Run after bumping the `remixicon` devDependency:
 *
 *   npm run generate:icons
 */
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const iconsDir = path.join(root, 'node_modules', 'remixicon', 'icons');
const outFile = path.join(
  root,
  'projects',
  'nirengi-ui-kit',
  'src',
  'lib',
  'components',
  'icon',
  'icon-data.ts'
);

if (!fs.existsSync(iconsDir)) {
  console.error(`[generate-icon-data] remixicon assets not found at ${iconsDir}.`);
  console.error('[generate-icon-data] Run `npm install` first.');
  process.exit(1);
}

const remixiconVersion = JSON.parse(
  fs.readFileSync(path.join(root, 'node_modules', 'remixicon', 'package.json'), 'utf8')
).version;

/** Collects every `*.svg` under the category folders of the remixicon package. */
const collectSvgFiles = (dir) =>
  fs
    .readdirSync(dir, { withFileTypes: true })
    .flatMap((entry) => {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) return collectSvgFiles(full);
      return entry.isFile() && entry.name.endsWith('.svg') ? [full] : [];
    })
    .sort();

/**
 * Upstream path data carries up to five decimals, which is far below a device
 * pixel on a 24-unit viewBox but costs ~30% of the generated file. Rounding to
 * `COORDINATE_PRECISION` decimals (and dropping the leading zero of `0.5`) is
 * visually lossless — 0.01 units is 1/2400 of the icon's width.
 */
const COORDINATE_PRECISION = 2;

const compressCoordinates = (pathData) =>
  pathData.replace(/-?\d*\.\d+/g, (match) =>
    Number.parseFloat(match)
      .toFixed(COORDINATE_PRECISION)
      .replace(/0+$/, '')
      .replace(/\.$/, '')
      .replace(/^(-?)0\./, '$1.')
  );

const files = collectSvgFiles(iconsDir);
const entries = new Map();

for (const file of files) {
  const name = path.basename(file, '.svg');
  const svg = fs.readFileSync(file, 'utf8');

  const paths = [...svg.matchAll(/<path\b[^>]*\bd="([^"]+)"/g)].map((match) => match[1]);

  if (paths.length !== 1) {
    console.error(
      `[generate-icon-data] ${name}.svg has ${paths.length} <path> elements; expected exactly 1.`
    );
    process.exit(1);
  }

  if (entries.has(name)) {
    console.error(`[generate-icon-data] duplicate icon name "${name}".`);
    process.exit(1);
  }

  // The emitted file uses single-quoted literals; path data must not need escaping.
  if (/['\\]/.test(paths[0]) || /['\\]/.test(name)) {
    console.error(`[generate-icon-data] ${name}.svg contains a quote or backslash.`);
    process.exit(1);
  }

  entries.set(name, compressCoordinates(paths[0]));
}

if (entries.size === 0) {
  console.error('[generate-icon-data] no icons found.');
  process.exit(1);
}

const body = [...entries].map(([name, d]) => `  '${name}': '${d}',`).join('\n');

const contents = `/**
 * GENERATED FILE — DO NOT EDIT BY HAND.
 *
 * Source: remixicon@${remixiconVersion} (Apache-2.0) — https://remixicon.com
 * Regenerate with: npm run generate:icons
 *
 * Each value is the \`d\` attribute of the icon's single \`<path>\`, drawn on a
 * \`0 0 24 24\` viewBox and filled with \`currentColor\`. Coordinates are rounded to
 * ${COORDINATE_PRECISION} decimals.
 */
export const ALL_ICONS = {
${body}
};
`;

fs.writeFileSync(outFile, contents, 'utf8');

console.log(
  `[generate-icon-data] wrote ${entries.size} icons from remixicon@${remixiconVersion} -> ${path.relative(root, outFile)}`
);
