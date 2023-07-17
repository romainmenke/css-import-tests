import * as esbuild from 'esbuild'
import http from 'http';
import path from 'path';
import fs from 'fs/promises';
import postcss from 'postcss';
import postcssImport from 'postcss-import';
import postcssImportDev from '../postcss-import/index.js';
import { bundle as lightningcss } from 'lightningcss';
import { promises as fsp } from 'fs';

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
		const result = await createTest(browser, testPath);
		return {
			...result,
			label: testPath.slice(1).join('/'),
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
			case '/lightningcss.html':
				res.setHeader('Content-type', 'text/html');
				res.writeHead(200);
				res.end(html('lightningcss'));
				return;
			case '/esbuild.html':
				res.setHeader('Content-type', 'text/html');
				res.writeHead(200);
				res.end(html('esbuild'));
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
						}).catch((e) => {
							res.end('');
						});
						return;
					case 'lightningcss':
						try {
							let { code } = lightningcss({
								filename: path.join(...testPath, 'style.css'),
								minify: false
							});

							res.end(code);
						} catch (e) {
							res.end('');
						}

						return;
					case 'esbuild':
						try {
							await esbuild.build({
								entryPoints: [path.join(...testPath, 'style.css')],
								outfile: path.join(...testPath, 'esbuild.css'),
								bundle: true,
							})

							res.end(await fsp.readFile(path.join(...testPath, 'esbuild.css'), 'utf8'));
							await fs.rm(path.join(...testPath, 'esbuild.css'));
						} catch (e) {
							res.end('');
						}
						

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
		success: false,
		bundlers: []
	}

	{
		await page.goto(`http://localhost:8080/native.html`);
		const result = await page.evaluate(async () => {
			const box = document.getElementById('box');
			const style = window.getComputedStyle(box);
			return style.backgroundColor;
		});

		results.bundlers.push({
			label: 'native',
			success: result === 'rgb(0, 128, 0)',
			result: result,
		});
	}

	{
		await page.goto(`http://localhost:8080/postcss-import.html`);
		const result = await page.evaluate(async () => {
			const box = document.getElementById('box');
			const style = window.getComputedStyle(box);
			return style.backgroundColor;
		});

		results.bundlers.push({
			label: 'postcss-import',
			success: result === 'rgb(0, 128, 0)',
			result: result,
		});
	}

	{
		await page.goto(`http://localhost:8080/lightningcss.html`);
		const result = await page.evaluate(async () => {
			const box = document.getElementById('box');
			const style = window.getComputedStyle(box);
			return style.backgroundColor;
		});

		results.bundlers.push({
			label: 'lightningcss',
			success: result === 'rgb(0, 128, 0)',
			result: result,
		});
	}

	{
		await page.goto(`http://localhost:8080/esbuild.html`);
		const result = await page.evaluate(async () => {
			const box = document.getElementById('box');
			const style = window.getComputedStyle(box);
			return style.backgroundColor;
		});

		results.bundlers.push({
			label: 'esbuild',
			success: result === 'rgb(0, 128, 0)',
			result: result,
		});
	}

	await page.close();

	await server.closeAllConnections();
	await server.close();

	if (errorMessage) {
		throw new Error(errorMessage);
	}

	results.success = results.bundlers.every((x => x.success === true));
	return results;
}
