module.exports = {
    "plugins": [
        "prettier"
    ],
    "parserOptions": {
        // "parser": "babel-eslint",
        "parser": "babel-eslint",
        "ecmaVersion": 9,
        "ecmaFeatures": {
            "jsx": true
        },
        "sourceType": "module"
    },
    "extends": [
        "eslint:recommended"
    ],
    "rules": {
        "arrow-parens": "off",
        "valid-jsdoc": "off",
        "eol-last": "off",
        "no-alert": "error",
        "array-bracket-spacing": "off",
        "no-prototype-builtins": "off",
        "no-unused-vars": ["error", {"vars": "all", "args": "none", "ignoreRestSiblings": false}],
        "no-else-return": "off",
        "strict": "off",
        "linebreak-style": "off",
        "spaced-comment": 0,
        "newline-per-chained-call": "off",
        "space-before-function-paren": 0,
        "no-unneeded-ternary": 2,
        "quotes": [
            "error",
            "double",
            {
                "avoidEscape": true,
                "allowTemplateLiterals": true
            }
        ],
        "prettier/prettier": [
            "warn",
            {
                "printWidth": 120, // 换行字符串阈值
                "proseWrap": "preserve",  // 是否要换行
                "tabWidth": 4,
                "useTabs": true,
                "singleQuote": false,
                "trailingComma": "none",
                "bracketSpacing": true,
                "jsxBracketSameLine": true,
                "arrowParens": "avoid",
                "requirePragma": true,
                "insertPragma": false,
                "semi": false,
                "parser": "flow"
            }
        ],
        "use-isnan": "off",
        "semi": [
            "error",
            "never"
        ],
        "no-console": "off",
        "no-irregular-whitespace": [
            "error",
            {
                "skipComments": true
            }
        ],
        "comma-dangle": [
            "error",
            {
                "arrays": "only-multiline",
                "objects": "only-multiline"
            }
        ],
    },
    "env": {
        "browser": true,
        "node": true,
        "commonjs": true,
        "jquery": true,
        "es6": true
    },
    "globals": {
        "wx": true,
        "getApp": true,
        "Page": true,
        "getCurrentPages": true,
        "Component": true,
        "Component": true,
        "App": true,
        "define": true,
    }
}
