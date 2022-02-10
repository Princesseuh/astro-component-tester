import { readFile } from 'fs/promises';
import { buildComponent, BuildOption } from './builder.js';

export interface ComponentOutput {
	html: string;
	raw: string;
}

export async function getComponentOutput(path: string, props: Record<string, unknown>, buildOptions: BuildOption): Promise<ComponentOutput> {
	// Build the component
	const component = await buildComponent(path, props, buildOptions);

	// Read its content
	const result = await readFile(component, {
		encoding: 'utf-8',
	});

	// Since we're building a page and not a component, Astro includes a DOCTYPE and stuff, we don't want that
	const resultContent = result.toString().match(/<html>(.*)<\/html>/ms)[1];

	// Return its output, simple enough!
	return {
		html: resultContent,
		raw: result,
	};
}

export { cleanTests } from './builder';
