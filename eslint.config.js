// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['dist/*', 'node_modules/*', '.expo/*'],
  },
  {
    // Node-run build helpers (scripts/*.js) — expose Node globals.
    files: ['scripts/**/*.js'],
    languageOptions: {
      globals: {
        Buffer: 'readonly',
        __dirname: 'readonly',
        require: 'readonly',
        module: 'readonly',
        process: 'readonly',
        console: 'readonly',
      },
    },
  },
]);