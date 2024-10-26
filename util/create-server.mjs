import * as esbuild from 'esbuild'
import fs from 'node:fs/promises';
import fsSync from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import postcss from 'postcss';
import postcssBundler from '@csstools/postcss-bundler';
import { bundle as lightningcss } from 'lightningcss';
import module from 'node:module';
import { spawn } from 'node:child_process';

const require = module.createRequire(import.meta.url);
const postcssImport = require('postcss-import');
const strictParse = require('./postcss/strict-parse.cjs');

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
		<li><a href="./esbuild.html">esbuild</a></li>
		<li><a href="./lightningcss.html">lightningcss</a></li>
		<li><a href="./bun.html">bun</a></li>
		<li><a href="./csstools-postcss-bundler.html">@csstools/postcss-bundler</a></li>
		<li><a href="./postcss-import.html">postcss-import</a></li>
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
	<div class="donut-edge">
		<div class="donut-body">
			<div class="donut-hole">
				<div id="box" class="box"></div>
			</div>
		</div>
	</div>
</body>
</html>
`
}

export function createServer(testPath, imageWasRequestedCallback, serverErrorCallback, requestErrorCallback) {
	const server = http.createServer(async (req, res) => {		
		const parsedUrl = new URL(req.url, 'http://localhost:8080');
		const pathname = decodeURIComponent(parsedUrl.pathname);
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
			case '/csstools-postcss-bundler.html':
				res.setHeader('Content-type', 'text/html');
				res.writeHead(200);
				res.end(html('csstools-postcss-bundler'));
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
			case '/bun.html':
				res.setHeader('Content-type', 'text/html');
				res.writeHead(200);
				res.end(html('bun'));
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

					case 'csstools-postcss-bundler':
						await postcss([
							postcssBundler(),
						]).process(await fs.readFile(path.join(...testPath, 'style.css'), 'utf8'), {
							parser: strictParse,
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
							postcssImport({
								skipDuplicates: false
							}),
						]).process(await fs.readFile(path.join(...testPath, 'style.css'), 'utf8'), {
							parser: strictParse,
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
								errorRecovery: true,
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
					case 'bun':
						try {
							const result = await (new Promise((resolve, reject) => {
								const bun = spawn(
									path.join('node_modules', '.bin', 'bun'),
									[
										'build',
										'--experimental-css',
										path.join(...testPath, 'style.css'),
									]
								);

								let stdoutBuffer = '';
								let stderrBuffer = '';

								bun.stdout.on('data', (data) => {
									stdoutBuffer += data.toString('utf-8');
								});

								bun.stderr.on('data', (data) => {
									stderrBuffer += data.toString('utf-8');
								});

								bun.on('close', (code) => {
									if (code !== 0) {
										reject(new Error(`bun exited with code: ${code}\n\t${stderrBuffer}`));
										return;
									}

									resolve(stdoutBuffer);
								});
							}));

							res.end(result);
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

					if (fileExistsWithCaseSync(path.join(...testPath, pathname.slice(1)))) {
						res.setHeader('Content-type', 'text/css');
						res.writeHead(200);
						res.end(await fs.readFile(path.join(...testPath, pathname.slice(1)), 'utf8'));
						return;
					}
				}

				if (pathname.endsWith('.png')) {
					if (fileExistsWithCaseSync(path.join(...testPath, pathname.slice(1)))) {
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

function fileExistsWithCaseSync(filepath) {
	const filename = path.basename(filepath);
	try {
		return fsSync.readdirSync(path.dirname(filepath)).some((x) => x === filename);
	} catch (_) {
		return false;
	}
}
