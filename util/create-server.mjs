import * as esbuild from 'esbuild'
import crypto from 'crypto';
import fs from 'fs/promises';
import fsSync from 'fs';
import http from 'http';
import path, { parse } from 'path';
import postcss from 'postcss';
import postcssImport from 'postcss-import';
import postcssImportDev from '../postcss-import/index.js';
import postcssRebaseURL from '../postcss-rebase-url/index.mjs'
import { bundle as lightningcss } from 'lightningcss';

function hashLayerName(index, rootFilename) {
	if (!rootFilename) {
		return `import-anon-layer-${index}`;
	}

	// A stable, deterministic and unique layer name:
	// - layer index
	// - relative rootFilename to current working directory
	return `import-anon-layer-${crypto
		.createHash('sha256')
		.update(`${index}-${rootFilename}`)
		.digest('hex')
		.slice(0, 12)}`;
}

function index() {
	return `<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Index</title>
</head>
<body>
	<ul>
		<li><a href="./native.html">native</a></li>
		<li><a href="./csstools-postcss-bundle.html">@csstools/postcss-bundle</a></li>
		<li><a href="./postcss-import.html">postcss-import</a></li>
		<li><a href="./lightningcss.html">lightningcss</a></li>
		<li><a href="./esbuild.html">esbuild</a></li>
	</ul>
</body>
</html>
`
}

function html(bundle = 'native') {
	return `<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>${bundle}</title>

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

export function createServer(testPath, imageWasRequestedCallback, serverErrorCallback, requestErrorCallback) {
	const server = http.createServer(async (req, res) => {
		const parsedUrl = new URL(req.url, 'http://localhost:8080');
		const pathname = parsedUrl.pathname;
		const bundle = parsedUrl.searchParams.get('bundle');
		const backgroundColor = parsedUrl.searchParams.get('background-color');

		switch (pathname) {
			case '/':
				res.setHeader('Content-type', 'text/html');
				res.writeHead(200);
				res.end(index('native'));
				return;
			case '/native.html':
				res.setHeader('Content-type', 'text/html');
				res.writeHead(200);
				res.end(html('native'));
				return;
			case '/csstools-postcss-bundle.html':
				res.setHeader('Content-type', 'text/html');
				res.writeHead(200);
				res.end(html('csstools-postcss-bundle'));
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
						res.end(await fs.readFile(path.join(...testPath, 'style.css'), 'utf8'));
						return;

					case 'csstools-postcss-bundle':
						await postcss([
							postcssImportDev({
								skipDuplicates: false,
								nameLayer: hashLayerName,
							}),
							postcssRebaseURL(),
						]).process(await fs.readFile(path.join(...testPath, 'style.css'), 'utf8'), {
							from: path.join(...testPath, 'style.css'),
							to: path.join(...testPath, 'style.css'),
						}).then((result) => {
							res.end(result.css);
						}).catch((e) => {
							requestErrorCallback(e);

							res.end('');
						});
						return;
					case 'postcss-import':
						await postcss([
							postcssImportDev(),
						]).process(await fs.readFile(path.join(...testPath, 'style.css'), 'utf8'), {
							from: path.join(...testPath, 'style.css'),
							to: path.join(...testPath, 'style.css'),
						}).then((result) => {
							res.end(result.css);
						}).catch((e) => {
							requestErrorCallback(e);

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
							requestErrorCallback(e);

							res.end('');
						}

						return;
					case 'esbuild':
						try {
							const esBundle = await esbuild.build({
								entryPoints: [path.join(...testPath, 'style.css')],
								bundle: true,
								logLevel: 'silent',
								write: false,
								external: ['*.png']
							})

							res.end(esBundle.outputFiles[0].text);
						} catch (e) {
							requestErrorCallback(e);

							res.end('');
						}

						return;
				}

				res.end('');
				return;

			default:
				if (pathname.endsWith('.css')) {
					if (backgroundColor) {
						res.setHeader('Content-type', 'text/css');
						res.writeHead(200);
						res.end(`.box { background-color: ${backgroundColor}; }`);
						return;
					}

					if (fsSync.existsSync(path.join(...testPath, pathname.slice(1)))) {
						res.setHeader('Content-type', 'text/css');
						res.writeHead(200);
						res.end(await fs.readFile(path.join(...testPath, pathname.slice(1)), 'utf8'));
						return;
					}
				}

				if (pathname.endsWith('.png')) {
					if (fsSync.existsSync(path.join(...testPath, pathname.slice(1)))) {
						imageWasRequestedCallback();

						const responseContent = await fs.readFile(path.join(...testPath, pathname.slice(1)));

						res.setHeader('Content-type', 'image/png');
						res.setHeader('Content-length', responseContent.length);
						res.writeHead(200);

						
						res.end(responseContent);
						return;
					}
				}

				res.setHeader('Content-type', 'text/plain');
				res.writeHead(404);
				res.end('Not found');
				break;
		}
	});

	server.timeout = 100;

	server.on('error', (e) => {
		serverErrorCallback(e);
	});

	return server;
}
