// local dev server to test plugin development
// see prior Node.js method here - https://github.com/jthegedus/docsify-select/blob/main/server.js

import { Application, Router } from "https://deno.land/x/oak@v11.1.0/mod.ts";
import { pluginBuild } from "./build.ts";

const router = new Router();

const PORT = 8000;
const HOST = "localhost";
const app = new Application();

router.get("/mod.js", (context) => {
	context.response.body = Deno.readTextFileSync(
		`${Deno.cwd()}/npm/esm/mod.js`,
	);
});

router.get("/mod.min.js", (context) => {
	context.response.body = Deno.readTextFileSync(
		`${Deno.cwd()}/npm/esm/mod.min.js`,
	);
});

app.use(router.routes());
app.use(router.allowedMethods());

console.log("Building plugin...");
await pluginBuild();
console.log("Plugin built!");

// Read index.html file and replace CDN URL for local plugin build output
const indexHtml = Deno.readTextFileSync(`${Deno.cwd()}/docs/index.html`);
const modifiedIndexHtml = indexHtml.replace(
	"https://cdn.jsdelivr.net/npm/docsify-select@2",
	`http://${HOST}:${PORT}/mod.js`,
);

// Static content
app.use(async (context, next) => {
	if (context.request.url.pathname === "/") {
		context.response.body = modifiedIndexHtml;
	} else {
		try {
			await context.send({
				root: `${Deno.cwd()}/docs`,
				index: "index.html",
			});
		} catch {
			await next();
		}
	}
});

console.log(`Dev server available on: http://${HOST}:${PORT}`);
await app.listen({ port: PORT });
