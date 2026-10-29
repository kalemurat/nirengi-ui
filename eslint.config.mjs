// @ts-check
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import angular from 'angular-eslint';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';

export default tseslint.config(
  {
    ignores: [
      '**/*.spec.ts',
      'dist/**',
      'node_modules/**',
      // Generated from the remixicon assets — see scripts/generate-icons.mjs
      'projects/nirengi-ui-kit/src/lib/components/icon/icon-names.ts',
    ],
  },
  {
    files: ['**/*.ts'],
    rules: {
      ...eslint.configs.recommended.rules,
    },
  },
  ...tseslint.configs.recommended.map((c) => ({ ...c, files: ['**/*.ts'] })),
  ...tseslint.configs.stylistic.map((c) => ({ ...c, files: ['**/*.ts'] })),
  ...angular.configs.tsRecommended.map((c) => ({ ...c, files: ['**/*.ts'] })),
  {
    files: ['**/*.ts'],
    processor: angular.processInlineTemplates,
    rules: {
      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: ['app', 'nui'],
          style: 'camelCase',
        },
      ],
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: ['app', 'nui'],
          style: 'kebab-case',
        },
      ],
      '@angular-eslint/component-class-suffix': 'off',
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'interface',
          format: ['PascalCase'],
          prefix: ['I'],
        },
        {
          selector: 'variable',
          modifiers: ['const'],
          format: ['camelCase', 'UPPER_CASE', 'PascalCase'],
        },
      ],
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/member-ordering': [
        'error',
        {
          default: [
            'static-field',
            'instance-field',
            'constructor',
            'static-method',
            'instance-method',
          ],
        },
      ],
    },
  },
  ...angular.configs.templateRecommended.map((c) => ({ ...c, files: ['**/*.html'] })),
  ...angular.configs.templateAccessibility.map((c) => ({ ...c, files: ['**/*.html'] })),
  {
    /*
     * Select implements the WAI-ARIA APG combobox pattern. Which element is the combobox
     * follows DOM focus, because `aria-activedescendant` is only honoured on the focused
     * element: the search input while `searchable` and open (APG editable/autocomplete-list
     * combobox), otherwise the trigger (APG select-only combobox).
     *   https://www.w3.org/WAI/ARIA/apg/patterns/combobox/examples/combobox-select-only/
     *   https://www.w3.org/WAI/ARIA/apg/patterns/combobox/examples/combobox-autocomplete-list/
     * Either way the listbox options must NOT be focusable and must NOT carry their own key
     * handlers — all keyboard interaction lives on the focused combobox element
     * (SelectComponent.onTriggerKeydown / onSearchKeydown). These two rules cannot express
     * "focus is managed on another element", so they would force a structure that breaks the
     * pattern. Angular template ESLint has no inline-comment disables, hence this
     * file-scoped override.
     */
    files: ['projects/nirengi-ui-kit/src/lib/components/select/select.component.html'],
    rules: {
      '@angular-eslint/template/click-events-have-key-events': 'off',
      '@angular-eslint/template/interactive-supports-focus': 'off',
    },
  },
  eslintPluginPrettierRecommended
);
