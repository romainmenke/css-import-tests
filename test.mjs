import fs from "fs/promises";
import path from "path";
import puppeteer from "puppeteer";

import './prepare-postcss-import-dev.mjs';

const { createTestSafe } = await import('./util/test.mjs')

const onlyRunTest = process.argv.slice(2)[0];

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
}).filter((x) => {
	return !onlyRunTest || x.includes(onlyRunTest);
});

testCases.sort();

const results = [];

for (const testCase of testCases) {
	const chromeResult = await createTestSafe(chrome, ['tests', ...testCase.split(path.sep)]);
	const firefoxResult = await createTestSafe(firefox, ['tests', ...testCase.split(path.sep)]);

	const chromeNativeResult = chromeResult.bundlers.find((x) => x.label === 'native');
	const chromeRemainder = chromeResult.bundlers.filter((x) => x.label !== 'native');
	chromeNativeResult.label = 'chrome';

	const firefoxNativeResult = firefoxResult.bundlers.find((x) => x.label === 'native');
	const firefoxRemainder = firefoxResult.bundlers.filter((x) => x.label !== 'native');
	firefoxNativeResult.label = 'firefox';

	const combinedResult = {
		...chromeResult,
		errors: [
			...chromeResult.errors,
		],
		bundlers: [
			chromeNativeResult,
			firefoxNativeResult,
			...chromeRemainder,
		]
	};

	for (const result of chromeRemainder) {
		const pairedResult = firefoxRemainder.find((x) => x.label === result.label);

		if (result.success !== pairedResult.success) {
			result.success = false;
			combinedResult.errors.push(new Error(`When testing ${result.label} Firefox had success ${pairedResult.success} while Chrome had success ${result.success} for ${testCase}`));
		}
	}

	results.push(combinedResult)
}

let failureCount = 0;
let postcssImportFailureCount = 0;
let nativeFailureCount = 0;

console.log(`| Test | chrome | firefox | p-bundle | p-import | lightningcss | esbuild |`);
console.log(`| ---- | ------ | ------- | ------ | ------ | ------------ | ------- |`);
for (const result of results) {
	const chromeResult = result.bundlers.find((x => x.label === 'chrome')).success ? '✅' : '❌';
	const firefoxResult = result.bundlers.find((x => x.label === 'firefox')).success ? '✅' : '❌';
	const csstoolsPostcssBundleResult = result.bundlers.find((x => x.label === 'csstools-postcss-bundle')).success ? '✅' : '❌';
	const postcssImportResult = result.bundlers.find((x => x.label === 'postcss-import')).success ? '✅' : '❌';
	const lightningcssResult = result.bundlers.find((x => x.label === 'lightningcss')).success ? '✅' : '❌';
	const esbuildResult = result.bundlers.find((x => x.label === 'esbuild')).success ? '✅' : '❌';

	if (process.env.README) {
		result.label = `[${result.label}](https://github.com/romainmenke/css-import-tests/tree/main/tests/${result.label})`;
	}

	console.log(`| ${result.label} | ${chromeResult} | ${firefoxResult} | ${csstoolsPostcssBundleResult} | ${postcssImportResult} | ${lightningcssResult} | ${esbuildResult} |`);
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

			console.error(`FAIL - ${result.label}`);
			console.table(result.bundlers);
			result.errors.forEach((x) => {
				console.error(x);
			});

			continue;
		}
	
		console.log(`OK   - ${result.label}`);
	}
}

// setTimeout(() => {
// 	throw new Error('force exit');
// }, 1000);

await firefox.close();
await chrome.close();
