import { mkdir, readFile, writeFile, rm } from 'fs/promises';
import { relative } from 'path';
/*
It would be neat to access those directly but they're unfortunately not exported
import { default as buildAstro } from "astro/core/build/index.js";
import { loadConfig } from "astro/core/config.js";
*/
import { execSync } from 'child_process';

export interface BuildComponentResult {
	html: string;
	raw: string;
}

export async function buildComponent(path: string, props: Record<string, unknown>): Promise<BuildComponentResult> {
	const projectRoot = process.cwd() + '/.test';
	const pathToComponent = relative(projectRoot + '/src/pages', path);

	const content = dedent(`
        ---
            import Component from "${pathToComponent}"
            const props = ${JSON.stringify(props) || '{}'}
        ---

        <Component {...props} />
        `).trim();

	const config = `export default ({renderers: [],});`;

	// Scaffold an environnement for building the component
	await mkdir(projectRoot + '/src/pages/', { recursive: true });
	await writeFile(projectRoot + '/src/pages/' + 'index.astro', content, {
		encoding: 'utf-8',
	});
	await writeFile(projectRoot + '/astro.config.js', config, {
		encoding: 'utf-8',
	});

	// Load our config and build using Astro's internal function.
	// This doesn't work as they're not exported, so instead we use the CLI
	// const loadedConfig = await loadConfig({ cwd: process.cwd() });
	// process.chdir(projectRoot);
	// await buildAstro(loadedConfig, { logging: true });

	// Build our project using the Astro CLI
	execSync('npx astro build', { cwd: projectRoot });

	const result = await readFile(projectRoot + '/dist/index.html', {
		encoding: 'utf-8',
	});

	// Clean up after ourselves
	await rm(projectRoot, { recursive: true, force: true });

	// Since we're building a page and not a component, Astro includes a DOCTYPE and stuff, we don't want that
	const resultContent = result.toString().match(/<html>(.*)<\/html>/ms)[1];

	return {
		html: resultContent,
		raw: result,
	};
}

const dedent = (str: string) =>
	str
		.split('\n')
		.map((ln) => ln.trimStart())
		.join('\n');
