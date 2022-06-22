/** @type {import("@types/prettier").Options */
module.exports = {
	printWidth: 180,
	semi: true,
	singleQuote: true,
	tabWidth: 2,
	useTabs: true,
	trailingComma: 'es5',
	overrides: [
		{
			files: ['*.json', '*.md', '*.toml', '*.yml'],
			options: {
				useTabs: false,
			},
		},
	],
};
