// @ts-check
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import angular from 'angular-eslint';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';

export default tseslint.config(
  {
    ignores: ['**/*.spec.ts', 'dist/**', 'node_modules/**'],
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
            'public-field',
            'protected-field',
            'private-field',
            'constructor',
            'public-method',
            'protected-method',
            'private-method',
          ],
        },
      ],
    },
  },
  ...angular.configs.templateRecommended.map((c) => ({ ...c, files: ['**/*.html'] })),
  ...angular.configs.templateAccessibility.map((c) => ({ ...c, files: ['**/*.html'] })),
  eslintPluginPrettierRecommended
);
