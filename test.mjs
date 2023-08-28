import fs from "fs/promises";
import path from "path";
import puppeteer from "puppeteer";

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
			...firefoxRemainder,
		]
	};

	// for (const result of firefoxRemainder) {
	// 	const pairedResult = chromeRemainder.find((x) => x.label === result.label);

	// 	if (result.success !== pairedResult.success) {
	// 		result.success = false;
	// 		combinedResult.errors.push(new Error(`When testing ${result.label} Firefox had success ${result.success} while Chrome had success ${pairedResult.success} for ${testCase}`));
	// 	}
	// }

	results.push(combinedResult)
}

let failureCount = 0;
let postcssImportFailureCount = 0;
let nativeFailureCount = 0;

let relevantTestCounter = 0;
let chromeResultSuccessCounter = 0;
let firefoxResultSuccessCounter = 0;
let csstoolsPostcssBundlerResultSuccessCounter = 0;
let postcssImportResultSuccessCounter = 0;
let lightningcssResultSuccessCounter = 0;
let esbuildResultSuccessCounter = 0;

console.log(`| Test | chrome | firefox | esbuild | lightningcss | p-bundler | p-import |`);
console.log(`| ---- | ------ | ------- | ------- | ------------ | --------- | -------- |`);
for (const result of results) {
	const chromeResultSuccess = result.bundlers.find((x => x.label === 'chrome')).success;
	const firefoxResultSuccess = result.bundlers.find((x => x.label === 'firefox')).success;
	const csstoolsPostcssBundlerResultSuccess = result.bundlers.find((x => x.label === 'csstools-postcss-bundler')).success;
	const postcssImportResultSuccess = result.bundlers.find((x => x.label === 'postcss-import')).success;
	const lightningcssResultSuccess = result.bundlers.find((x => x.label === 'lightningcss')).success;
	const esbuildResultSuccess = result.bundlers.find((x => x.label === 'esbuild')).success;

	const chromeResult = chromeResultSuccess ? '✅' : '❌';
	const firefoxResult = firefoxResultSuccess ? '✅' : '❌';
	const csstoolsPostcssBundlerResult = csstoolsPostcssBundlerResultSuccess ? '✅' : '❌';
	const postcssImportResult = postcssImportResultSuccess ? '✅' : '❌';
	const lightningcssResult = lightningcssResultSuccess ? '✅' : '❌';
	const esbuildResult = esbuildResultSuccess ? '✅' : '❌';

	if (result.label.startsWith('001-') || result.label.startsWith('002-')) {
		relevantTestCounter++;
		chromeResultSuccessCounter += chromeResultSuccess ? 1 : 0;
		firefoxResultSuccessCounter += firefoxResultSuccess ? 1 : 0;
		csstoolsPostcssBundlerResultSuccessCounter += csstoolsPostcssBundlerResultSuccess ? 1 : 0;
		postcssImportResultSuccessCounter += postcssImportResultSuccess ? 1 : 0;
		lightningcssResultSuccessCounter += lightningcssResultSuccess ? 1 : 0;
		esbuildResultSuccessCounter += esbuildResultSuccess ? 1 : 0;
	}

	if (process.env.README) {
		result.label = `[${result.label}](https://github.com/romainmenke/css-import-tests/tree/main/tests/${result.label})`;
	}

	console.log(`| ${result.label} | ${chromeResult} | ${firefoxResult} | ${esbuildResult} | ${lightningcssResult} | ${csstoolsPostcssBundlerResult} | ${postcssImportResult} |`);
}

console.log(`| Total | ${chromeResultSuccessCounter} / ${relevantTestCounter} | ${firefoxResultSuccessCounter} / ${relevantTestCounter} | ${esbuildResultSuccessCounter} / ${relevantTestCounter} | ${lightningcssResultSuccessCounter} / ${relevantTestCounter} | ${csstoolsPostcssBundlerResultSuccessCounter} / ${relevantTestCounter} | ${postcssImportResultSuccessCounter} / ${relevantTestCounter} |`);

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

setTimeout(() => {
	throw new Error('force exit');
}, 1000);

await firefox.close();
await chrome.close();
