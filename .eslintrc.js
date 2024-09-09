// .eslintrc.js
import unusedImports from 'eslint-plugin-unused-imports';

export default [
    {
        env: {
            node: true,
            es2021: true,
        },
        plugins: {
            'unused-imports': unusedImports,
        },
        extends: ['eslint:recommended'],
        parserOptions: {
            ecmaVersion: 2021,
            sourceType: 'module',
        },
        rules: {
            indent: ['error', 4],
            'linebreak-style': ['error', 'unix'],
            semi: ['error', 'always'],
            'no-console': ['error', { allow: ['error'] }],
            'no-unused-vars': 'off',
            'unused-imports/no-unused-imports': 'error',
            'unused-imports/no-unused-vars': [
                'warn',
                {
                    vars: 'all',
                    varsIgnorePattern: '^_',
                    args: 'after-used',
                    argsIgnorePattern: '^_',
                },
            ],
        },
        ignorePatterns: ['node_modules/', 'build/', 'dist/', 'lib/', 'index.ts', 'public/*'],
    },
];
