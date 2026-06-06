/**
 * Builds the library's self-contained global stylesheet.
 *
 * Runs AFTER `ng build nirengi-ui-kit` (see the `postbuild:ui-kit` npm hook), so
 * it is not wiped by ng-packagr's `deleteDestPath: true`. It compiles the
 * library's `index.scss` (Tailwind directives + inlined theme tokens + base
 * reset + utilities + the portalled select-dropdown styles) into a plain,
 * dependency-free `dist/nirengi-ui-kit/styles.css` that consumers import once:
 *
 *   // angular.json "styles", or a global stylesheet
 *   @import 'nirengi-ui-kit/styles';
 *
 * Pipeline: sass (resolve @use/@import + inline theme) -> tailwindcss (resolve
 * every @apply / @tailwind layer against the LIBRARY tailwind.config.js). The
 * result contains zero `@apply` and zero unresolved `@import`.
 */
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const root = process.cwd();
const bin = (name) => path.join(root, 'node_modules', '.bin', name);

const stylesDir = path.join(root, 'projects', 'nirengi-ui-kit', 'src', 'lib', 'styles');
const indexScss = path.join(stylesDir, 'index.scss');
const tailwindConfig = path.join(root, 'projects', 'nirengi-ui-kit', 'tailwind.config.js');
const distDir = path.join(root, 'dist', 'nirengi-ui-kit');
const outCss = path.join(distDir, 'styles.css');

if (!fs.existsSync(distDir)) {
  console.error(
    `[build-styles] dist not found at ${distDir}. Run "ng build nirengi-ui-kit" first.`
  );
  process.exit(1);
}

const tmpCss = path.join(os.tmpdir(), 'nui-styles-intermediate.css');

try {
  // 1) Sass: resolve @use/@import and inline the theme tokens.
  execFileSync(
    bin('sass'),
    [
      indexScss,
      tmpCss,
      `--load-path=${stylesDir}`,
      '--quiet-deps',
      '--no-source-map',
      '--style=expanded',
    ],
    { stdio: ['ignore', 'ignore', 'inherit'] }
  );

  // 2) Tailwind: resolve every @apply and the @tailwind layers against the library config.
  execFileSync(bin('tailwindcss'), ['-i', tmpCss, '-c', tailwindConfig, '-o', outCss, '--minify'], {
    stdio: ['ignore', 'ignore', 'inherit'],
  });
} finally {
  if (fs.existsSync(tmpCss)) fs.rmSync(tmpCss);
}

const css = fs.readFileSync(outCss, 'utf8');
const rawApply = (css.match(/@apply/g) ?? []).length;
const strayImport = (css.match(/@import/g) ?? []).length;
if (rawApply > 0 || strayImport > 0) {
  console.error(
    `[build-styles] styles.css is not self-contained: @apply=${rawApply}, @import=${strayImport}.`
  );
  process.exit(1);
}

const sizeKb = (fs.statSync(outCss).size / 1024).toFixed(1);
console.log(
  `[build-styles] wrote ${path.relative(root, outCss)} (${sizeKb} KB, 0 @apply, 0 @import).`
);
