module.exports = {
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:import/errors",
    "plugin:import/warnings"
  ],
  settings: {
    "import/resolver": {
      node: { extensions: [".js", ".mjs", ".jsx", ".ts", ".tsx"] }
    }
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: "latest",
    sourceType: "module"
  },
  plugins: [
    "react",
    "@typescript-eslint"
  ],
  rules: {
    "object-curly-spacing": ["error", "always"],
    "array-bracket-spacing": ["error", "always"],
    "comma-dangle": ["error", "never"],
    "quotes": [2, "single", { "avoidEscape": true }],
    "semi": ["error", "never"],
    "arrow-parens": ["error", "as-needed", { "requireForBlockBody": true }],
    "generator-star-spacing": "off",
    "import/order": "error",
    "import/first": "error",
    "import/no-mutable-exports": "error",
    "import/no-unresolved": "off",
    'react/no-unknown-property': 'off',
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off'
  }
}
