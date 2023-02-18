import { pluginBuild } from "./build.ts";

if (Deno.args.length !== 0) {
	console.log("Usage: deno run -A scripts/build_npm.ts");
	Deno.exit(1);
}

await pluginBuild();
