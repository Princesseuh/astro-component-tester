import { readFile, rm, stat } from 'fs/promises';
import { join } from 'path';
import { buildComponent, BuildOption } from './builder.js';

export interface ComponentOutput {
	html: string;
	raw: string;
	readFile: (path: string) => Promise<string>;
	fileExists: (path: string) => Promise<boolean>;
	clean: () => Promise<void>;
}

export async function getComponentOutput(path: string, props: Record<string, unknown> = {}, buildOptions: BuildOption = {}): Promise<ComponentOutput> {
	// Build the component
	const component = await buildComponent(path, props, buildOptions);

	// Read its content
	const result = await readFile(component.builtFile, {
		encoding: 'utf-8',
	});

	// Since we're building a page and not a component, Astro includes a DOCTYPE and stuff, we don't want that
	const resultContent = result.toString().match(/<html>(.*)<\/html>/ms)[1];

	return {
		html: resultContent,
		raw: result,
		// Few utilities functions that might be useful
		readFile: (filePath) => readFile(join(component.projectRoot, filePath), 'utf8'),
		fileExists: (filePath) =>
			stat(join(component.projectRoot, filePath)).then(
				() => true,
				() => false
			),
		clean: () => rm(component.projectRoot, { recursive: true, force: true }),
	};
}

export { cleanTests } from './builder.js';
