import fs from "fs/promises";
import path from "path";

import './prepare-postcss-import-dev.mjs';
import { createServer } from "./util/create-server.mjs";

let onlyRunTest = process.argv.slice(2)[0];
if (!onlyRunTest) {
	console.log('Please specify a test to run.');
	process.exit(1);
}

if (onlyRunTest.startsWith('tests/')) {
	onlyRunTest = onlyRunTest.slice(6);
}

const testCase = (await fs.readdir('./tests', { withFileTypes: true, recursive: true })).filter(dirent => {
	return dirent.isFile() && dirent.name === 'style.css'
}).map(dirent => {
	return path.relative('tests', dirent.path);
}).sort().find((x) => {
	return x.includes(onlyRunTest);
});

if (!testCase) {
	console.log('Test not found.');
	process.exit(1);
}

console.log(`Testing ${testCase}...`);

const server = createServer(
	['tests', ...testCase.split(path.sep)],
	() => {
		console.log('Image was requested.');
	},
	(e) => {
		console.log('Server error.');
		console.error(e);
	},
	(e) => {
		console.log('Request handler error.');
		console.error(e);
	}
);

server.listen(8080);
console.log('Server listening on http://localhost:8080');
