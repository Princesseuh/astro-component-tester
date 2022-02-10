import { mkdir, writeFile } from 'fs/promises';
import { execSync } from 'child_process';
import { relative, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createHash } from 'crypto';
import { existsSync, rmSync } from 'fs';
import { AstroUserConfig } from 'astro';

// I'm sure there must be an easier way to do this?
const TESTER_DIR = dirname(fileURLToPath(import.meta.url)).slice(0, -5);

export interface BuildOption {
	astroConfig: AstroUserConfig;
	forceBuild: boolean;
}

/**
 * @param path The path to the component to build
 * @param props Props to pass to component
 * @param buildOptions Build options, such as forceBuild to force new builds instead of using cache
 * @returns The path to the built component
 */
export async function buildComponent(path: string, props: Record<string, unknown>, buildOptions: BuildOption): Promise<string> {
	const hash = getHash(path, props, buildOptions.astroConfig);

	const projectRoot = TESTER_DIR + '/.test/' + `test-${hash}`;
	const pathToComponent = relative(projectRoot + '/src/pages', path);

	// If the dir already exists and the user didn't request to a build, let's skip all that work
	if (!existsSync(projectRoot) || buildOptions?.forceBuild) {
		const content = dedent(`
        ---
            import Component from "${pathToComponent}"
            const props = ${JSON.stringify(props) || '{}'}
        ---

        <Component {...props} />
        `).trim();

		// Set the default Astro config if the user didn't provide one
		buildOptions.astroConfig ??= { renderers: [] };
		const config = `export default (${JSON.stringify(buildOptions.astroConfig)});`;

		// Scaffold an environnement for building the component
		await mkdir(projectRoot + '/src/pages/', { recursive: true });
		await writeFile(projectRoot + '/src/pages/' + 'index.astro', content, {
			encoding: 'utf-8',
		});
		await writeFile(projectRoot + '/astro.config.js', config, {
			encoding: 'utf-8',
		});

		// Build it using the Astro CLI
		execSync('npx astro build', { cwd: projectRoot });
	}

	// Return the path to the built file
	return projectRoot + '/dist/index.html';
}

const dedent = (str: string) =>
	str
		.split('\n')
		.map((ln) => ln.trimStart())
		.join('\n');

function getHash(path, options = {}, astroOptions = {}) {
	const hash = createHash('sha256');

	hash.update(path);
	hash.update(JSON.stringify(options));
	hash.update(JSON.stringify(astroOptions));

	return hash.digest('base64url').toString().substring(0, 6);
}

/**
 * Remove all test directories created
 */
export function cleanTests() {
	rmSync(TESTER_DIR + '/.test/', { recursive: true, force: true });
}
