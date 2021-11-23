/*
 * @Author: Xavier Yin
 * @Date: 2021-11-24 10:44:00
 */

module.exports = {
  env: {
    node: true,
    es6: true,
  },

  extends: [
    'eslint:recommended',
    'airbnb',
    'airbnb/hooks',
    // eslint-plugin-react 用以支持 jsx 语法
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    // eslint-plugin-prettier 调用 prettier 对代码风格进行检查
    'prettier',
  ],

  overrides: [
    {
      files: ['*.d.ts', '*.ts', '*.tsx'],
      parserOptions: {
        ecmaVersion: 11,
        ecmaFeatures: {
          jsx: true,
        },
        project: './tsconfig.json',
      },
    },
  ],

  parser: '@typescript-eslint/parser',

  plugins: ['@typescript-eslint', 'prettier', 'react', 'react-hooks'],

  root: true,

  rules: {
    '@typescript-eslint/no-explicit-any': 0,
    '@typescript-eslint/no-unsafe-argument': 0,
    '@typescript-eslint/no-unsafe-assignment': 0,
    '@typescript-eslint/no-unsafe-call': 0,
    '@typescript-eslint/no-unsafe-member-access': 0,
    '@typescript-eslint/no-unsafe-return': 0,
    'import/extensions': 0,
    'no-nested-ternary': 0,
    'no-param-reassign': 0,
    'no-plusplus': 0,
    'no-restricted-syntax': 0,
    'no-shadow': 0,
    'no-underscore-dangle': 0,
    'no-unused-expressions': 0,
    'react/display-name': 0,
    'react/jsx-boolean-value': 0,
    'react/jsx-filename-extension': [
      1,
      {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    ],
    'react/jsx-props-no-spreading': 0,
    'react/react-in-jsx-scope': 'off',
    'react/self-closing-comp': 0,
    'prefer-template': 0,
    'prettier/prettier': 1,
  },

  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
    react: {
      pragma: 'React',
      version: 'detect',
    },
  },
};

// module.exports = {
//   env: {
//     node: true,
//     browser: true,
//     es6: true,
//     jest: true,
//   },
//   rules: {
//     'no-console': 'error',
//     'import/first': 'error',
//     'react/prop-types': 'off',
//   },
//   extends: [
//     // 'react-app',
//     // 'react-app/jest',
//     'eslint:recommended',
//     'plugin:react/recommended',
//     'plugin:@typescript-eslint/recommended',
//     'plugin:react-hooks/recommended',
//     'prettier',
//   ],
//   overrides: [
//     {
//       files: ['*.ts', '*.tsx'],
//       parserOptions: {
//         ecmaVersion: 11,
//         ecmaFeatures: {
//           jsx: true,
//         },
//         project: './tsconfig.json',
//       },
//     },
//   ],
//   parser: '@typescript-eslint/parser',
//   root: true,
//   plugins: ['react', '@typescript-eslint'],
//   settings: {
//     react: {
//       pragma: 'React',
//       version: 'detect',
//     },
//   },
// };
