import puppeteer from 'puppeteer';
import http from 'http';
import { promises as fsp } from 'fs';
import postcss from 'postcss';
import postcssImport from 'postcss-import';
import assert from 'assert';
import path from 'path';

export function createTest() {
	function html(bundle = 'native') {
		return `<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Native</title>

	<style>
		:where(.box) {
			width: 100px;
			height: 100px;
			background-color: red;
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

	return async () => {
		const requestListener = async function (req, res) {

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
							res.end(await fsp.readFile('style.css', 'utf8'));
							return;

						case 'postcss-import':
							await postcss([
								postcssImport(),
							]).process(await fsp.readFile('style.css', 'utf8'), {
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
						res.end(await fsp.readFile(path.join('.', pathname), 'utf8'));
						return;
					}

					res.setHeader('Content-type', 'text/plain');
					res.writeHead(404);
					res.end('Not found');
					break;
			}
		};

		const server = http.createServer(requestListener);
		server.listen(8080);

		if (!process.env.DEBUG) {
			const browser = await puppeteer.launch({
				headless: 'new',
			});

			const page = await browser.newPage();
			page.on('pageerror', (msg) => {
				throw msg;
			});

			{
				await page.goto('http://localhost:8080/native.html');
				const result = await page.evaluate(async () => {
					const box = document.getElementById('box');
					const style = window.getComputedStyle(box);
					return style.backgroundColor;
				});
				assert.strictEqual(result, 'rgb(0, 128, 0)');
			}

			{
				await page.goto('http://localhost:8080/postcss-import.html');
				const result = await page.evaluate(async () => {
					const box = document.getElementById('box');
					const style = window.getComputedStyle(box);
					return style.backgroundColor;
				});
				assert.strictEqual(result, 'rgb(0, 128, 0)');
			}

			await browser.close();

			await server.close();
		} else {
			console.log('visit : http://localhost:8080');
		}
	};
}
