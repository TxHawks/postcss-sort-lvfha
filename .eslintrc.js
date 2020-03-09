module.exports = {
  extends: ["airbnb-base", "plugin:security/recommended"],
  // extends: ["airbnb-base", "plugin:security/recommended", "prettier"],
  plugins: ["security"],
  // plugins: ["prettier", "security"],
  env: {
    commonjs: true,
    es6: true,
    node: true
  },
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly"
  },
  parserOptions: {
    ecmaVersion: 2018
  },
  rules: {
    "security/detect-object-injection": "off",

    "array-bracket-spacing": ["error", "always"],
    "arrow-parens": ["error", "as-needed"],
    "brace-style": [2, "stroustrup"],
    "comma-dangle": [
      "error",
      {
        arrays: "always",
        objects: "always",
        imports: "always",
        exports: "always",
        functions: "never"
      }
    ],
    "comma-style": ["error", "last"],
    indent: [
      "error",
      2,
      {
        flatTernaryExpressions: false,
        MemberExpression: 1,
        SwitchCase: 1
      }
    ],
    "linebreak-style": ["error", "unix"],
    "max-len": [
      "warn",
      {
        code: 100,
        comments: 110,
        tabWidth: 2,
        ignoreComments: false,
        ignoreUrls: true,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
        ignoreRegExpLiterals: true
      }
    ],
    "multiline-ternary": ["error", "always-multiline"],
    "newline-per-chained-call": ["error", { ignoreChainWithDepth: 3 }],
    "no-debugger": "warn",
    /* Allow nested ternaries */
    "no-nested-ternary": "off",
    "no-restricted-syntax": ["error", "SequenceExpression"],
    /* Warn when declaring a variable with a name that already exists in the containing scope */
    "no-shadow": "warn",
    /* Forbid referencing a variable before it is defined, but allow using declared functions */
    "no-use-before-define": ["error", "nofunc"],
    /* Warn when referencing an undefined variable */
    "no-undef": "error",
    /* Forbid expressions that are never used */
    "no-unused-expressions": [
      "error",
      { allowShortCircuit: true, allowTernary: true }
    ],
    /* Throw when declaring a variable without using it */
    "no-unused-vars": [
      "error",
      { vars: "local", args: "none", ignoreRestSiblings: true }
    ],
    "object-curly-newline": "off",
    "object-curly-spacing": ["error", "always"],
    "operator-linebreak": ["error", "before"],
    "prefer-destructuring": "off",
    quotes: ["error", "single"],
    semi: ["error", "always"],
    "spaced-comment": ["error", "always", { exceptions: ["/", "-", "+", "*"] }]
  },
  overrides: [
    {
      extends: ["plugin:jest/all"],
      files: ["*.test.js"],
      plugins: ["jest"],
      env: {
        "jest/globals": true,
        jest: true
      },
      rules: {
        "import/no-extraneous-dependencies": [
          "error",
          {
            devDependencies: true,
            optionalDependencies: false,
            peerDependencies: true
          }
        ]
      }
    }
  ]
};
