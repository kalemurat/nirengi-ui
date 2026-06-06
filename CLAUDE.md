# CLAUDE.md

Guidance for Claude Code (and any AI agent) working in this repository.

## What is this project?

**This is a UI kit project.** Its sole purpose is to produce a library of reusable, themeable Angular components (`nirengi-ui-kit`). This repo is **not** a product or an application — it is a **component library**.

The workspace contains two Angular projects:

- **`nirengi-ui-kit`** (`projects/nirengi-ui-kit`) — The published library. This is the actual product. Selector prefix: `nui`. Built with `ng-packagr`.
- **`nirengi-ui`** (`src/`) — A showcase/demo application (Storybook-like) that exhibits the library. Selector prefix: `app`. It exists only to display and try out the components; it is not a product on its own.

When doing work, the default target is the library (`projects/nirengi-ui-kit`). If a component is added or changed, the demo side (`src/app`) is updated only to showcase it.

## Tech stack

- **Angular 20** (signal-based, zoneless)
- TypeScript (strict)
- Tailwind CSS 3 + SCSS (`@apply`)
- Standalone components (no NgModule)
- Karma + Jasmine for tests

## ⚠️ Absolute rule: everything is written signal-based

This project **mandates the signal-based approach**. In every new or changed piece of code, without exception:

- Use `input()` / `input.required()` for inputs — do **not** use the `@Input()` decorator.
- Use `output()` for outputs — do **not** use `@Output()` + `EventEmitter`.
- Use `computed()` for derived values — instead of getters or manual recomputation.
- Use `effect()` for side effects.
- Use `signal()` for state — instead of plain fields.
- Use the signal queries `viewChild()` / `viewChildren()` / `contentChild()` / `contentChildren()` — do **not** use the `@ViewChild()` decorator.
- Use `model()` for two-way binding.
- Use `changeDetection: ChangeDetectionStrategy.OnPush` on every component.
- The app runs zoneless (`provideZonelessChangeDetection`); do not write Zone.js-dependent code.
- In templates use the new control flow (`@if`, `@for`, `@switch`) — do **not** use `*ngIf` / `*ngFor`.

Form components extend the signal-based `ValueAccessorBase` in `projects/nirengi-ui-kit/src/lib/common/base/value-accessor.base.ts`. Use this base when writing a new form control.

Existing components follow this pattern; for reference see `projects/nirengi-ui-kit/src/lib/components/button/button.component.ts` and `switch/switch.component.ts`.

## 📚 Angular best practices — consult the MCP

For any Angular-related decision, pattern, or "right way" question, **consult the Angular MCP server first**. Do not write from memory or old habits.

The Angular CLI MCP server is configured in this workspace (`angular-cli`). Use these tools:

- **`get_best_practices`** — Retrieves the Angular Best Practices Guide. Call it **before** writing component/service/signal/template code.
- **`search_documentation`** — Searches the official Angular documentation at https://angular.dev. Use it to verify the current signature / recommended usage of any API.
- **`list_projects`** — Lists the projects (apps + libraries) in the workspace.

Rule: if there is any uncertainty about an Angular pattern, **do not guess** — verify via the MCP. If the best-practices guide conflicts with a rule in this file, apply the stricter/newer one and note the difference.

## Architecture rules

- **No barrel files (index.ts)** — Import components/enums/tokens via their direct paths to guarantee tree-shaking (e.g. `nirengi-ui-kit/components/button/button.component`).
- **Styling**: English BEM class names + Tailwind utilities applied via SCSS `@apply`. Do not hard-code px values in components; sizes are managed centrally in `projects/nirengi-ui-kit/tailwind.config.js`.
- **Size/color system**: Use the `common/enums/size.enum.ts` and `common/enums/color-variant.enum.ts` enums. The source-of-truth size values live in the tailwind config.
- **Accessibility**: Honor WCAG 2.1 AA (keyboard navigation, ARIA, focus management).
- When creating a new component, mirror the existing component file structure exactly: `*.component.ts`, `*.component.html`, `*.component.scss`, `*.component.spec.ts`.

## Testing — required

This project uses **Karma + Jasmine**, with specs co-located next to source as `*.spec.ts`.

- **Write a unit test for every new component, service, directive, or behavior you add or change.** Cover inputs, outputs, computed signals, effects, and edge cases (disabled/loading/empty states, keyboard interaction, accessibility attributes).
- Run the relevant test suite after changes and make sure it passes before considering the work done.
- Coverage thresholds are enforced (library Karma: statements 93 / branches 85 / functions 100 / lines 92; merged global gate: 96/96/90/96 via `scripts/merge-coverage.mjs`). New code must keep coverage above these gates.

Commands:

```bash
npm run test:ui-kit       # Library unit tests (ChromeHeadless, single run, with coverage)
npm run test:app          # Showcase app unit tests (ChromeHeadless, single run, with coverage)
npm run test              # Full run: app + library tests, then coverage merge/gate

# Run a single library spec interactively while developing:
ng test nirengi-ui-kit
ng test nirengi-ui-kit --code-coverage
```

## 🔒 Security review — required after every change

**After completing any task that changes code, run the `security-review` skill** to catch security vulnerabilities before finishing. Treat this as a mandatory final step, not optional.

- Invoke it via the `/security-review` slash command (the `security-review` skill).
- Address any findings it reports; do not consider the task done while there are unresolved security issues.
- This applies to component logic, services, directives, build/config changes, and dependency updates alike.

## Other commands

```bash
npm start                 # Run the showcase app (localhost:4200)
npm run build:ui-kit      # Build the library
npm run lint              # ESLint
npm run format            # Prettier
```

## Git / commit rules

- **Do not add signatures to commit messages.** Never add `Co-Authored-By: ...` or any AI signature. Commit messages must be clean and plain.
- Use conventional commit format (`feat:`, `fix:`, `chore:`, `refactor:`, `test:`, `docs:`).
- `.mcp.json` and `.claude/github-mcp.env` contain secret tokens; they are gitignored and must **never** be committed.

## Secrets

- Do **not** read, echo, or print the contents of `.claude/github-mcp.env` or `.mcp.json`. The MCP reads these itself; you do not need to see them.
- Do not print the `GITHUB_PERSONAL_ACCESS_TOKEN` environment variable.
