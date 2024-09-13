import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";

export default [
  {files: ["src/app/**/*.ts"]},
  {languageOptions: { globals: globals.browser }},
  {
    ...pluginJs.configs.all,
    files: ["src/app/**/*.ts"],
  },
  ...[...tseslint.configs.strictTypeChecked, ...tseslint.configs.stylisticTypeChecked].map((config) => ({
    ...config,
    files: config.files ? config.files : ["src/app/**/*.ts"],
  })),
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    rules: {
      "@typescript-eslint/no-confusing-void-expression": "off",
      "@typescript-eslint/restrict-template-expressions": "off",
      "@typescript-eslint/no-misused-promises": [
        "error",
        {
          "checksVoidReturn": false
        }
      ],
      "func-style": ["error", "declaration"],
      "no-ternary": "off",
      "no-magic-numbers": "off",
      "one-var": "off",
      "id-length": "off",
      "no-undefined": "off",
      "sort-imports": ["error", { "allowSeparatedGroups": true }],
      "max-statements": ["error", 15],
      "no-void": "off"
    },
    files: ["src/app/**/*.ts"],
  }
];
