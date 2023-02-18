import { build, emptyDir } from "https://deno.land/x/dnt@0.32.0/mod.ts";
import { bundle } from "https://deno.land/x/bundler@0.9.0/mod.ts";

const logPrefix = "[bundler][docsify-select]";

function version() {
	return Deno.readTextFileSync("./version.txt");
}

function year() {
	return new Date().getFullYear();
}

function fileBanner() {
	return `/*
* docsify-select
* v${version()}
* https://jthegedus.github.io/docsify-select/
* (c) 2020-${year()} James Hegedus
* MIT license
*/`;
}

const sourceDnt = {
	mod: `${Deno.cwd()}/npm/esm/mod.js`,
	typesMod: `${Deno.cwd()}/npm/types/mod.d.ts`,
	srcMod: `${Deno.cwd()}/npm/src/mod.ts`,
	shims: `${Deno.cwd()}/npm/esm/_dnt.shims.js`,
	typesShim: `${Deno.cwd()}/npm/types/_dnt.shims.d.ts`,
	srcShim: `${Deno.cwd()}/npm/src/_dnt.shims.ts`,
};

const bundleOptions = [
	{ optimize: false, outputFilename: `${Deno.cwd()}/.tmp/bundled.js` },
	{ optimize: true, outputFilename: `${Deno.cwd()}/.tmp/bundled.min.js` },
];

export async function pluginBuild() {
	await emptyDir("./npm");
	await emptyDir(".tmp");

	await build({
		entryPoints: ["./mod.ts"],
		outDir: "./npm",
		shims: {
			// see JS docs for overview and more options
			deno: "dev",
		},
		scriptModule: false,
		compilerOptions: {
			lib: [
				"es2021",
				"dom",
			],
		},
		package: {
			// package.json properties
			name: "docsify-select",
			version: version(),
			description:
				"A docsify.js plugin for variably rendering content with html select menus from markdown",
			author: "James Hegedus",
			license: "MIT",
			homepage: "https://jthegedus.github.io/docsify-select/",
			repository: {
				type: "git",
				url: "git+https://github.com/jthegedus/docsify-select.git",
			},
			bugs: {
				url: "https://github.com/jthegedus/docsify-select/issues",
			},
			keywords: [
				"docsify",
				"docsify.js",
				"docsify-plugin",
				"docsify-select",
				"select",
				"select-menus",
				"select-dropdown",
				"markdown",
				"md",
				"markdown-select-menu",
				"markdown-select-dropdown",
				"documentation",
			],
			publishConfig: {
				access: "public",
			},
		},
		postBuild: async () => {
			await bundleDnt();
			await copyLicenseReadme();
		},
	});
}

/**
 * dnt outputs the following dir which we work with here.
 *
 * npm/esm/_dnt.shims.js
 * npm/esm/mod.js
 * npm/node_modules/*
 * npm/src/_dnt.shims.ts
 * npm/src/mod.ts
 * npm/types/_dnt.shims.d.ts
 * npm/types/mod.d.ts
 * npm/package-lock.json
 * npm/package.json
 * test_runner.js
 */
async function bundleDnt() {
	// Bundle /npm/esm/mod.js & /npm/esm/_dnt.shims.js into two files, one normal, another minified
	for (const opt of bundleOptions) {
		console.log(`${logPrefix} Bundling`);
		const bundled = await bundle([sourceDnt.mod], { optimize: opt.optimize });
		await Deno.writeTextFile(
			opt.outputFilename,
			`${fileBanner()}\n${bundled.bundles[0].source}`,
		);
	}

	// Remove npm/esm/mod.js & npm/esm/_dnt.shims.js
	await Deno.remove(sourceDnt.mod);
	await Deno.remove(sourceDnt.shims);

	// rename bundled output to /npm/esm/mod.js & /npm/esm/mod.min.js
	const esmOutputFilenameMinified = sourceDnt.mod.replace(".js", ".min.js");
	const [bundleOpts, minifiedBundleOpts] = bundleOptions;
	await Deno.rename(bundleOpts.outputFilename, sourceDnt.mod);
	await Deno.rename(
		minifiedBundleOpts.outputFilename,
		esmOutputFilenameMinified,
	);
	console.log(`${logPrefix}Bundle written to ${sourceDnt.mod}`);
	console.log(`${logPrefix}Bundle written to ${esmOutputFilenameMinified}`);

	// fix /npm/types/* generated from dnt because we bundled into a single file so types should match /npm/types/mod.d.ts
	const dntTypes = await Deno.readTextFile(sourceDnt.typesShim);
	await Deno.writeTextFile(sourceDnt.typesMod, dntTypes);
	await Deno.remove(sourceDnt.typesShim);
	console.log(`${logPrefix} Types fixed in ${sourceDnt.typesMod}`);

	// fix /npm/src/mod.ts generated from dnt. TypeScript shim import is incorrect
	const text = await Deno.readTextFile(sourceDnt.srcMod);
	const fixedText = text.replace("_dnt.shims.js", "_dnt.shims.ts");
	await Deno.writeTextFile(sourceDnt.srcMod, fixedText);
	console.log(
		`${logPrefix}Fixed dnt shim import in ${sourceDnt.srcMod}`,
	);
}

async function copyLicenseReadme() {
	await Deno.copyFile("LICENSE", `${Deno.cwd()}/npm/LICENSE`);
	await Deno.copyFile("README.md", `${Deno.cwd()}/npm/README.md`);
	console.log(`${logPrefix} Copied LICENSE & README.md to npm/`);
}
