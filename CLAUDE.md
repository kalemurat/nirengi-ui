# CLAUDE.md

Guidance for Claude Code (and any AI agent) working in this repository.

## ⚠️ Communication language

**Always talk to the user in Turkish.** All conversational replies, explanations,
summaries, and questions directed at the user must be written in Turkish — even
if the user writes in another language. This rule applies only to the
conversation with the user; code, identifiers, comments, commit messages, and
GitHub issues/PRs still follow their own language conventions (issues and PRs are
written in English as defined elsewhere in this file).

## What is this project?

**This is a UI kit project.** Its sole purpose is to produce a library of reusable, themeable Angular components (`nirengi-ui-kit`). This repo is **not** a product or an application — it is a **component library**.

The workspace contains two Angular projects:

- **`nirengi-ui-kit`** (`projects/nirengi-ui-kit`) — The published library. This is the actual product. Selector prefix: `nui`. Built with `ng-packagr`.
- **`nirengi-ui`** (`src/`) — A showcase/demo application (Storybook-like) that exhibits the library. Selector prefix: `app`. It exists only to display and try out the components; it is not a product on its own.

When doing work, the default target is the library (`projects/nirengi-ui-kit`). If a component is added or changed, the demo side (`src/app`) is updated only to showcase it.

## The two sides — library and showcase

There are two sides to every component, and a new component is **not complete
until both sides exist**:

1. **The library component** — `projects/nirengi-ui-kit/src/lib/components/<name>/`
   with the four co-located files (`*.component.ts/.html/.scss/.spec.ts`). This is
   the actual product (`nui` selector prefix).
2. **The showcase** — the demo app under `src/` (`app` selector prefix) that
   displays and lets you try the component. Existing showcase components live
   under `src/app/components/`, `src/app/pages/`, and `src/app/core/`.

### ⚠️ Adding a new UI-kit element → also add it to the showcase

Whenever a **new component is added to `nirengi-ui-kit`**, it **must also be
surfaced in the showcase app** so it is visible/usable in the demo. Mirror how
existing components are wired up:

- Add a showcase **config** at `src/app/configs/<name>.showcase.json` (every
  existing component has one — e.g. `button.showcase.json`, `heading.showcase.json`).
- If the component has a dedicated demo page, add it under
  `src/app/pages/<name>-page/` (mirroring the four-file structure of
  `heading-page/`, `button-page/`, etc.).
- Register any new route in `src/app/app.routes.ts` (follow the existing
  `loadComponent` lazy-route pattern used for most pages).
- Match how the closest existing component is showcased — do not invent a new
  pattern; copy the established one (config-driven `ShowcaseLayoutComponent`
  and/or a dedicated `*-page` component).

If a component **already** has its showcase entry, that's fine — no extra work is
needed; just confirm it is present and up to date.

Conversely, changing an existing library component means checking whether its
showcase entry (config/page) needs updating to reflect the change.

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

## 📝 Docblock convention — write signal, not noise

Comments must add information the code cannot convey on its own. A docblock that
only restates the symbol's name, type, or signature is noise: it costs reading and
maintenance effort, drifts out of sync, and adds nothing. Favour fewer, denser
docblocks over a docblock on every member.

### KEEP — these earn their place

- **Public-API docs that reach consumers** — docblocks on library (`nui`) component
  classes, `input()` / `output()` / `model()` members, and exported
  types/enums/tokens surface in consumer IDE IntelliSense via the published
  `.d.ts`. Keep them.
- **`@example` usage** and **`@default <value>`** — concrete usage and default
  values the signature alone doesn't show.
- **"Why" / rationale** — design-system notes (e.g. "sizes come from central
  `size.constants.ts` for cross-component consistency"), non-obvious decisions,
  links (`@see`).
- **Edge cases / contracts** — behaviour the reader can't infer, e.g. "does not
  emit while disabled or loading", "returns `null` when the host is detached".
- **Terse enum-member notes** — single-line `/** ... */` clarifying a member's
  semantics or marking the default.

### REMOVE / TRIM — these are noise

- **Restating the name/type** — `/** Size. */ size = input<Size>()`,
  `/** Component's value state. */ value = signal(...)`. Delete, or trim to only
  the value-carrying part (keep the `@default`, drop the restatement).
- **Trivial method docs** — `/** Click handler method. @returns void */`,
  `/** Constructor */`, `/** Toggles the theme. */ toggleTheme()`. Delete unless
  they document a non-obvious contract/edge case (keep only that line).
- **Self-evident `@returns void` / `@param` that repeat the signature** — drop.
- **`ControlValueAccessor` boilerplate restatement** — `/** Writes value from
  model to view */ writeValue()` adds nothing over the interface; drop.

### Rules of thumb

- Library (`projects/nirengi-ui-kit`) public API gets the benefit of the doubt —
  it's the published product. Showcase (`src/app`, `app` prefix) internals are
  not public; trim aggressively.
- This is a comments-only concern — never change behaviour to satisfy it.
- When trimming a block down to one useful line, prefer a single-line `/** ... */`
  over a multi-line block.

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

## 🏗️ Build verification — required when the task is done

**When a task is complete, build BOTH projects and confirm there are no errors.**
Treat this as a mandatory final step alongside tests and the security review — the
work is not done until both builds are green.

- Build the library first, then the showcase app (the app consumes the library
  from `dist/`, so order matters):

  ```bash
  npm run build:ui-kit   # Build the library (nirengi-ui-kit)
  npm run build          # Build the showcase app (nirengi-ui)
  ```

- If either build reports an error (or warning that breaks the build), **fix it**
  before considering the task finished. Do not leave a broken build.
- This applies to any change — component logic, enums/tokens, styles, configs, or
  the showcase wiring.

## Other commands

```bash
npm start                 # Run the showcase app (localhost:4200)
npm run build:ui-kit      # Build the library
npm run build             # Build the showcase app
npm run lint              # ESLint
npm run format            # Prettier
```

## Git / commit rules

- **Do not add signatures to commit messages.** Never add `Co-Authored-By: ...` or any AI signature. Commit messages must be clean and plain.
- Use conventional commit format (`feat:`, `fix:`, `chore:`, `refactor:`, `test:`, `docs:`).
- `.mcp.json` and `.claude/github-mcp.env` contain secret tokens; they are gitignored and must **never** be committed.

## Branch & issue workflow

Work tied to a GitHub issue follows a strict branch/commit naming convention. The
branch **type** is chosen from the issue's primary label, and the branch is always
cut from the **latest remote `develop`** (`git fetch origin` → branch off
`origin/develop`). PRs target `develop`, never `master`.

| Issue label              | Branch name (`<prefix><issue#>`) | Commit message prefix |
| ------------------------ | -------------------------------- | --------------------- |
| `bug`                    | `bugfix/7`                       | `bugfix-7:`           |
| `feature`                | `feature/12`                     | `feature-12:`         |
| `release`                | `release/3`                      | `release-3:`          |
| `documentation`          | `docs/9`                         | `docs-9:`             |
| anything else / unsure   | `bugfix/<issue#>`                | `bugfix-<issue#>:`    |

- Branch name = `<prefix>/<issue-number>` (e.g. issue #7 with label `bug` → `bugfix/7`).
- Commit message = `<prefix>-<issue-number>: <imperative summary>`
  (e.g. `bugfix-7: differentiate H5 and H6 default sizes`). Still **no AI signature**.
- The issue number is encoded in the branch name; when already on such a branch,
  the issue id can be read from the branch (`bugfix/7` → issue `7`) without asking.
- The end-to-end flow (open issue → branch off `develop` → solve → PR to `develop`)
  is automated by the `create-issue` and `solve-issue` skills in `.claude/skills/`.

## Secrets

- Do **not** read, echo, or print the contents of `.claude/github-mcp.env` or `.mcp.json`. The MCP reads these itself; you do not need to see them.
- Do not print the `GITHUB_PERSONAL_ACCESS_TOKEN` environment variable.
