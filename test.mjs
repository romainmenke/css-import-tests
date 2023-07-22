import fs from "fs/promises";
import path from "path";
import puppeteer from "puppeteer";

import './prepare-postcss-import-dev.mjs';

const { createTestSafe } = await import('./util/test.mjs')

const firefox = await puppeteer.launch({
	headless: 'new',
	product: 'firefox',
});

const chrome = await puppeteer.launch({
	headless: 'new',
});

const testCases = (await fs.readdir('./tests', { withFileTypes: true, recursive: true })).filter(dirent => {
	return dirent.isFile() && dirent.name === 'style.css'
}).map(dirent => {
	return path.relative('tests', dirent.path);
})

testCases.sort();

const results = [];

for (const testCase of testCases) {
	// https://bugzilla.mozilla.org/show_bug.cgi?id=1844683
	// Ideally we test everything against one browser as we aren't trying to create a second WPT.
	// Firefox supports `support()` conditions, Chrome better supports cyclic imports.
	if (testCase.includes('cycles/006') || testCase.includes('cycles/007') || testCase.includes('cycles/008')) {
		results.push(
			await createTestSafe(chrome, ['tests', ...testCase.split(path.sep)])
		);
	} else {
		results.push(
			await createTestSafe(firefox, ['tests', ...testCase.split(path.sep)])
		);
	}
}

let failureCount = 0;
let postcssImportFailureCount = 0;
let nativeFailureCount = 0;

let formattedResults = [];

console.log(`| Test | native | postcss-import | lightningcss | esbuild |`);
console.log(`| ---- | ------ | -------------- | ------------ | ------- |`);
for (const result of results) {
	const nativeResult = result.bundlers.find((x => x.label === 'native')).success ? '✅' : '❌';
	const postcssImportResult = result.bundlers.find((x => x.label === 'postcss-import')).success ? '✅' : '❌';
	const lightningcssResult = result.bundlers.find((x => x.label === 'lightningcss')).success ? '✅' : '❌';
	const esbuildResult = result.bundlers.find((x => x.label === 'esbuild')).success ? '✅' : '❌';

	console.log(`| ${result.label} | ${nativeResult} | ${postcssImportResult} | ${lightningcssResult} | ${esbuildResult} |`);
}

if (process.env.DEBUG) {
	for (const result of results) {
		if (result.success === false) {
			failureCount++;

			if (!result.bundlers.find((x => x.label === 'postcss-import')).success) {
				postcssImportFailureCount++;
			}

			if (!result.bundlers.find((x => x.label === 'native')).success) {
				nativeFailureCount++;
			}

			console.error(`FAIL - ${result.label}`)
			console.table(result.bundlers)
			console.error(result.error);

			continue;
		}
	
		console.log(`OK   - ${result.label}`)
	}
}

await firefox.close()
await chrome.close()
