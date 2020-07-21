module.exports = {
  parser: '@typescript-eslint/parser', // Specifies the ESLint parser
  globals: {
    jest: true,
  },
  ignorePatterns: ['node_modules', 'build', 'example-app'],
  plugins: ['@typescript-eslint', 'import'],
  extends: [
    'plugin:@typescript-eslint/recommended', // Uses the recommended rules from the @typescript-eslint/eslint-plugin
    'plugin:import/typescript',
  ],
  parserOptions: {
    ecmaVersion: 2018, // Allows for the parsing of modern ECMAScript features
    sourceType: 'module', // Allows for the use of imports
  },
  rules: {
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    'import/order': [
      'error',
      {
        pathGroups: [
          {
            pattern: 'shared/**',
            group: 'external',
            position: 'after',
          },
        ],
        pathGroupsExcludedImportTypes: ['builtin'],
        groups: [['builtin', 'external'], 'internal', 'parent', 'sibling'],
        'newlines-between': 'always',
        alphabetize: {
          order: 'asc',
        },
      },
    ],
  },
};
