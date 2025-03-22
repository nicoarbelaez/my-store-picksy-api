import { defineConfig } from "eslint/config";
import globals from "globals";
import prettier from "eslint-config-prettier";

export default defineConfig([
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      ecmaVersion: "lastet",
      sourceType: "module",
    },
    rules: {
      "no-console": "warn",
      "no-unused-vars": "error",
      "no-undef": "error", // Error si se usa una variable no definida
      "init-declarations": ["error", "always"], // Fuerza la inicialización en la declaración
      "no-use-before-define": ["error", { functions: false, classes: true, variables: true }],
      "prefer-const": "error" // Recomienda const si la variable no se reasigna
    },
  },
  prettier,
]);
