import http from 'http';
import { promises as fsp } from 'fs';
import postcss from 'postcss';
import postcssImport from 'postcss-import';
import postcssImportDev from '../postcss-import/index.js';
import assert from 'assert';
import path from 'path';

function html(bundle = 'native') {
	return `<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Native</title>

	<style>
		@layer base {
			:where(.box) {
				width: 100px;
				height: 100px;
				background-color: red;
			}
		}
	</style>

	<link rel="stylesheet" href="style.css?bundle=${bundle}">
</head>
<body>
	<div id="box" class="box">
	</div>
</body>
</html>
`
}

export async function createTestSafe(browser, testPath) {
	try {
		await createTest(browser, testPath);
		return {
			label: testPath.slice(1).join('/'),
			success: true,
		}
	} catch (e) {
		return {
			label: testPath.slice(1).join('/'),
			success: false,
			error: e,
		}
	}
}

export async function createTest(browser, testPath) {
	const server = http.createServer(async (req, res) => {
		const parsedUrl = new URL(req.url, 'http://localhost:8080');
		const pathname = parsedUrl.pathname;
		const bundle = parsedUrl.searchParams.get('bundle');

		switch (pathname) {
			case '':
			case '/native.html':
				res.setHeader('Content-type', 'text/html');
				res.writeHead(200);
				res.end(html('native'));
				return;
			case '/postcss-import.html':
				res.setHeader('Content-type', 'text/html');
				res.writeHead(200);
				res.end(html('postcss-import'));
				return;
			case '/style.css':
				res.setHeader('Content-type', 'text/css');
				res.writeHead(200);

				switch (bundle) {
					case 'native':
						res.end(await fsp.readFile(path.join(...testPath, 'style.css'), 'utf8'));
						return;

					case 'postcss-import':
						await postcss([
							process.env.DEV && postcssImportDev ? postcssImportDev({
								path: [path.join(...testPath)],
								skipDuplicates: false,
							}) : postcssImport({
								path: [path.join(...testPath)],
								skipDuplicates: false,
							}),
						]).process(await fsp.readFile(path.join(...testPath, 'style.css'), 'utf8'), {
							from: 'style.css',
						}).then((result) => {
							res.end(result.css);
						});
						return;
				}

			default:
				if (pathname.endsWith('.css')) {
					res.setHeader('Content-type', 'text/css');
					res.writeHead(200);
					res.end(await fsp.readFile(path.join(...testPath, pathname.slice(1)), 'utf8'));
					return;
				}

				res.setHeader('Content-type', 'text/plain');
				res.writeHead(404);
				res.end('Not found');
				break;
		}
	});

	server.listen(8080);

	const page = await browser.newPage();
	await page.setCacheEnabled(false);

	let errorMessage = null;
	page.on('pageerror', (msg) => {
		errorMessage = msg;
	});

	let results = {
		native: null,
		postcssImport: null,
	}

	{
		await page.goto(`http://localhost:8080/native.html`);
		results.native = await page.evaluate(async () => {
			const box = document.getElementById('box');
			const style = window.getComputedStyle(box);
			return style.backgroundColor;
		});
	}

	{
		await page.goto(`http://localhost:8080/postcss-import.html`);
		results.postcssImport = await page.evaluate(async () => {
			const box = document.getElementById('box');
			const style = window.getComputedStyle(box);
			return style.backgroundColor;
		});
	}

	await page.close();

	await server.closeAllConnections();
	await server.close();

	if (errorMessage) {
		throw new Error(errorMessage);
	}

	assert.deepStrictEqual(results, {
		native: 'rgb(0, 128, 0)',
		postcssImport: 'rgb(0, 128, 0)',
	});
}
