/**
 * Vendors the RemixIcon web font into the library.
 *
 * The kit deliberately has **no runtime icon dependency**: wrapping a third-party
 * Angular icon library repeatedly blocked us on new Angular majors (issue #28).
 * Upstream `remixicon` is a plain CSS + font package with zero dependencies and no
 * framework coupling, so we copy its two shipping artefacts into the library and
 * publish them as the `nirengi-ui-kit/icons` stylesheet entry point. Consumers
 * install one package and import one stylesheet.
 *
 * Emitting the glyphs as TypeScript path data instead — which is what this script
 * used to do — put all 3229 icons into every consumer's JavaScript bundle and
 * could not be tree-shaken (issue #30). The font keeps the bundle at zero bytes:
 * the CSS gzips to ~16 kB and the browser fetches the woff2 lazily, once, as a
 * cacheable static asset.
 *
 * Three artefacts are written:
 *
 * 1. `styles/icons.css` — upstream's class rules, with the `@font-face` reduced to
 *    woff2 (supported by every browser Angular 20+ targets) so the .eot/.ttf/.svg
 *    fallbacks are not published.
 * 2. `styles/remixicon.woff2` — the font itself, referenced relatively so it
 *    resolves from wherever the consumer's bundler emits the stylesheet.
 * 3. `components/icon/icon-names.ts` — the name list, for `IconName` autocomplete
 *    and for icon browsers. Only ever reached through a dynamic `import()`.
 *
 * Run after bumping the `remixicon` devDependency:
 *
 *   npm run generate:icons
 */
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const fontsDir = path.join(root, 'node_modules', 'remixicon', 'fonts');
const upstreamCss = path.join(fontsDir, 'remixicon.css');
const upstreamFont = path.join(fontsDir, 'remixicon.woff2');

const libDir = path.join(root, 'projects', 'nirengi-ui-kit', 'src', 'lib');
const stylesDir = path.join(libDir, 'styles');
const cssFile = path.join(stylesDir, 'icons.css');
const fontFile = path.join(stylesDir, 'remixicon.woff2');
const namesFile = path.join(libDir, 'components', 'icon', 'icon-names.ts');

const FONT_FILE_NAME = 'remixicon.woff2';

if (!fs.existsSync(upstreamCss) || !fs.existsSync(upstreamFont)) {
  console.error(`[generate-icons] remixicon font assets not found in ${fontsDir}.`);
  console.error('[generate-icons] Run `npm install` first.');
  process.exit(1);
}

const remixiconVersion = JSON.parse(
  fs.readFileSync(path.join(root, 'node_modules', 'remixicon', 'package.json'), 'utf8')
).version;

const source = fs.readFileSync(upstreamCss, 'utf8');

/**
 * Upstream serves five formats behind cache-busting query strings, for browsers
 * (IE9, iOS 4) far outside our support matrix. woff2 alone saves ~1.4 MB in the
 * published package; the query strings would also defeat the consumer bundler's
 * own content hashing.
 */
const fontFaceBlock = /@font-face\s*\{[\s\S]*?\}/;

if (!fontFaceBlock.test(source)) {
  console.error('[generate-icons] no @font-face block found in remixicon.css.');
  process.exit(1);
}

const rewritten = source.replace(
  fontFaceBlock,
  `@font-face {
  font-family: "remixicon";
  src: url("./${FONT_FILE_NAME}") format("woff2");
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}`
);

/** `.ri-home-line:before { content: "\\ee2b"; }` — helper classes carry no `:before`. */
const names = [...rewritten.matchAll(/^\.ri-([a-z0-9-]+):before\s*\{/gm)].map((match) => match[1]);

if (names.length === 0) {
  console.error('[generate-icons] no icon class rules found in remixicon.css.');
  process.exit(1);
}

const duplicates = names.filter((name, index) => names.indexOf(name) !== index);

if (duplicates.length > 0) {
  console.error(`[generate-icons] duplicate icon names: ${[...new Set(duplicates)].join(', ')}.`);
  process.exit(1);
}

const banner = (summary) => `/*
 * GENERATED FILE — DO NOT EDIT BY HAND.
 *
 * Source: remixicon@${remixiconVersion} — https://remixicon.com
 * Regenerate with: npm run generate:icons
 *
 * ${summary}
 */`;

fs.mkdirSync(stylesDir, { recursive: true });
fs.writeFileSync(cssFile, `${banner('RemixIcon web font, woff2 only.')}\n${rewritten}`, 'utf8');
fs.copyFileSync(upstreamFont, fontFile);

fs.writeFileSync(
  namesFile,
  `${banner('Every icon name the bundled font provides.').replace('/*', '/**')}

/**
 * Names in upstream kebab-case (\`home-line\`) — the CSS classes minus the \`ri-\`
 * prefix.
 *
 * Weighing ~60 kB, this array must stay behind the dynamic \`import()\` in
 * \`icon-names.loader.ts\`; \`IconName\` reads it through \`typeof import(...)\`, which
 * is erased at compile time and costs nothing.
 */
export const ICON_NAMES = [
${names.map((name) => `  '${name}',`).join('\n')}
] as const;
`,
  'utf8'
);

const relative = (file) => path.relative(root, file);
const kb = (file) => `${Math.round(fs.statSync(file).size / 1024)} kB`;

console.log(
  `[generate-icons] vendored remixicon@${remixiconVersion} (${names.length} icons):\n` +
    `  ${relative(cssFile)} (${kb(cssFile)})\n` +
    `  ${relative(fontFile)} (${kb(fontFile)})\n` +
    `  ${relative(namesFile)} (${kb(namesFile)})`
);
