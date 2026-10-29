//  @ts-check

import { tanstackConfig } from "@tanstack/eslint-config";
import reactHooks from "eslint-plugin-react-hooks";
import simpleImportSort from "eslint-plugin-simple-import-sort";

export default [
  ...tanstackConfig,
  {
    rules: {
      "import/no-cycle": "off",
      "import/order": "off",
      "sort-imports": "off",
      "@typescript-eslint/array-type": "off",
      "@typescript-eslint/require-await": "off",
      "pnpm/json-enforce-catalog": "off",
    },
  },
  {
    name: "monitor/style",
    files: ["src/**/*.{ts,tsx}"],
    plugins: {
      "react-hooks": reactHooks,
      "simple-import-sort": simpleImportSort,
    },
    rules: {
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "error",
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
      "func-style": [
        "error",
        "expression",
        {
          allowArrowFunctions: true,
          overrides: { namedExports: "expression" },
        },
      ],
      "prefer-arrow-callback": [
        "error",
        { allowNamedFunctions: false, allowUnboundThis: true },
      ],
      "no-restricted-syntax": [
        "error",
        {
          selector: "ExportDefaultDeclaration > FunctionDeclaration",
          message:
            "Gunakan `const Nama = () => {}` lalu `export default Nama`. Dilarang `export default function`.",
        },
        {
          selector: "VariableDeclarator > FunctionExpression[generator=false]",
          message: "Semua fungsi harus arrow function.",
        },
      ],
    },
  },
  {
    ignores: [
      "eslint.config.js",
      "vite.config.ts",
      "src/routeTree.gen.ts",
      "dist/**",
      "design/**",
    ],
  },
];
