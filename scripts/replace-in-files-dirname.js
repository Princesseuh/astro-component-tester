module.exports = {
	// /* replace-in-file-dirname-start */ --ALL-CODE-BETWEEN-- /* replace-in-file-dirname-end */
	from: /\/\* replace-in-file-dirname-start \*\/([\s\S]*?)\/\* replace-in-file-dirname-end \*\//,
	to: 'return __dirname;',
};
