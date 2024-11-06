module.exports = {
	root: true,
	env: { browser: true, es2020: true },
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:react-hooks/recommended',
		'prettier'
	],
	ignorePatterns: ['dist', '.eslintrc.cjs'],
	parser: '@typescript-eslint/parser',
	plugins: ['react-refresh', "prettier"],
	rules: {
		'react-refresh/only-export-components': [
			'warn',
			{ allowConstantExport: true },
		],
		"prettier/prettier": ["error", {
			"useTabs": true,
			"tabWidth": 4,
			"semi": true,
			"singleQuote": true,
			"printWidth": 150,
			"endOfLine": "auto"
		}]
	},
};
