import { FlatCompat } from '@eslint/eslintrc';
import eslintPluginPrettier from 'eslint-plugin-prettier';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    plugins: {
      prettier: eslintPluginPrettier,
    },
    rules: {
      'prettier/prettier': 'error',
      'no-unused-vars': 'error',
      'no-undef': 'error',
      'import/no-unresolved': 'off',
    },
  },
];

export default eslintConfig;
