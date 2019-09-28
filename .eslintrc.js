module.exports = {
    "extends": [
        "eslint:recommended",
        "plugin:react/recommended",
        "plugin:@typescript-eslint/recommended",
        "prettier/@typescript-eslint",
        "plugin:prettier/recommended"
    ],
    "plugins": ["react", "@typescript-eslint", "prettier"],
    "env": {
        "browser": true,
        "jasmine": true,
        "jest": true,
        "amd": true,
        "node": true,
        "mocha": true
    },
    "rules": {
        "prettier/prettier": ["error", {"singleQuote": true}],
        "@typescript-eslint/no-unused-vars": ["error", {
            "vars": "all",
            "args": "after-used",
            "ignoreRestSiblings": false
        }],
        "@typescript-eslint/explicit-function-return-type": "error"
    },
    "settings": {
        "react": {
            "pragma": "React",
            "version": "detect"
        }
    },
    "parser": "@typescript-eslint/parser",
    "globals": {
        "process": true
    },
    "overrides": [
        {
            "files": ["MeasuringController.ts"],
            "rules": {
                "@typescript-eslint/consistent-type-assertions": "off",
                "@typescript-eslint/no-explicit-any": "off"
            }
        },
        {
            "files": ["*.ts"],
            "rules": {
                "@typescript-eslint/no-var-requires": "off"
            }
        },
        {
            "files": ["CommonRequest.ts", "IntegrationTest.ts"],
            "rules": {
                "@typescript-eslint/no-explicit-any": "off"
            }
        }
    ]
};