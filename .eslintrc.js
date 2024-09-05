// .eslintrc.js
module.exports = {
    env: {
        node: true,
        es2021: true,
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
    },
    ignorePatterns: ['node_modules/', 'build/', 'dist/', 'lib/', 'index.ts'],
};
