import fs from "fs/promises";
import path from "path";
import { chromium, firefox, webkit } from "playwright";

const { createTestSafe } = await import('./util/test.mjs')

let onlyRunTest = process.argv.slice(2)[0];

if (onlyRunTest && onlyRunTest.startsWith('tests/')) {
	onlyRunTest = onlyRunTest.slice(6);
}

const testCases = (await fs.readdir('./tests', { withFileTypes: true, recursive: true })).filter(dirent => {
	return dirent.isFile() && dirent.name === 'style.css'
}).map(dirent => {
	return path.relative('tests', dirent.path);
}).filter((x) => {
	return !onlyRunTest || x.includes(onlyRunTest);
});

testCases.sort();

const results = [];

const [
	chromiumInstance,
	firefoxInstance,
	webkitInstance,
] = await Promise.all([
	chromium.launch(),
	firefox.launch(),
	webkit.launch(),
]);

for (const testCase of testCases) {
	const chromeResult = await createTestSafe(chromiumInstance, ['tests', ...testCase.split(path.sep)]);
	const firefoxResult = await createTestSafe(firefoxInstance, ['tests', ...testCase.split(path.sep)]);
	const webkitResult = await createTestSafe(webkitInstance, ['tests', ...testCase.split(path.sep)]);

	const chromeNativeResult = chromeResult.bundlers.find((x) => x.label === 'native');
	const chromeRemainder = chromeResult.bundlers.filter((x) => x.label !== 'native');
	chromeNativeResult.label = 'chrome';

	const firefoxNativeResult = firefoxResult.bundlers.find((x) => x.label === 'native');
	const firefoxRemainder = firefoxResult.bundlers.filter((x) => x.label !== 'native');
	firefoxNativeResult.label = 'firefox';

	const webkitNativeResult = webkitResult.bundlers.find((x) => x.label === 'native');
	const webkitRemainder = webkitResult.bundlers.filter((x) => x.label !== 'native');
	webkitNativeResult.label = 'webkit';

	const combinedResult = {
		...chromeResult,
		errors: [
			...chromeResult.errors,
		],
		bundlers: [
			chromeNativeResult,
			firefoxNativeResult,
			webkitNativeResult,
			...chromeRemainder,
		]
	};

	// for (const result of chromeRemainder) {
	// 	const pairedResults = [
	// 		result,
	// 		firefoxRemainder.find((x) => x.label === result.label),
	// 		webkitRemainder.find((x) => x.label === result.label),
	// 	];

	// 	const allPassed = pairedResults.every((x) => x.success === true);
	// 	const allFailed = pairedResults.every((x) => x.success === false);

	// 	if (!allPassed && !allFailed) {
	// 		result.success = false;
	// 		combinedResult.errors.push(new Error(`When testing ${result.label} got | chrome ${result.success} | firefox ${pairedResults[1].success} | webkit ${pairedResults[2].success} | for ${testCase}`));
	// 	}
	// }

	results.push(combinedResult)
}

let failureCount = 0;

let relevantTestCounter = 0;
let chromeResultSuccessCounter = 0;
let firefoxResultSuccessCounter = 0;
let webkitResultSuccessCounter = 0;
let csstoolsPostcssBundlerResultSuccessCounter = 0;
let postcssImportResultSuccessCounter = 0;
let lightningcssResultSuccessCounter = 0;
let esbuildResultSuccessCounter = 0;

console.log(`| Test | chrome | firefox | webkit | esbuild | lightningcss | p-bundler | p-import |`);
console.log(`| ---- | ------ | ------- | ------ | ------- | ------------ | --------- | -------- |`);
for (const result of results) {
	const chromeResultSuccess = result.bundlers.find((x => x.label === 'chrome')).success;
	const firefoxResultSuccess = result.bundlers.find((x => x.label === 'firefox')).success;
	const webkitResultSuccess = result.bundlers.find((x => x.label === 'webkit')).success;
	const csstoolsPostcssBundlerResultSuccess = result.bundlers.find((x => x.label === 'csstools-postcss-bundler')).success;
	const postcssImportResultSuccess = result.bundlers.find((x => x.label === 'postcss-import')).success;
	const lightningcssResultSuccess = result.bundlers.find((x => x.label === 'lightningcss')).success;
	const esbuildResultSuccess = result.bundlers.find((x => x.label === 'esbuild')).success;

	const chromeResult = chromeResultSuccess ? '✅' : '❌';
	const firefoxResult = firefoxResultSuccess ? '✅' : '❌';
	const webkitResult = webkitResultSuccess ? '✅' : '❌';
	const csstoolsPostcssBundlerResult = csstoolsPostcssBundlerResultSuccess ? '✅' : '❌';
	const postcssImportResult = postcssImportResultSuccess ? '✅' : '❌';
	const lightningcssResult = lightningcssResultSuccess ? '✅' : '❌';
	const esbuildResult = esbuildResultSuccess ? '✅' : '❌';

	if (result.label.startsWith('001-') || result.label.startsWith('002-')) {
		relevantTestCounter++;
		chromeResultSuccessCounter += chromeResultSuccess ? 1 : 0;
		firefoxResultSuccessCounter += firefoxResultSuccess ? 1 : 0;
		webkitResultSuccessCounter += webkitResultSuccess ? 1 : 0;
		csstoolsPostcssBundlerResultSuccessCounter += csstoolsPostcssBundlerResultSuccess ? 1 : 0;
		postcssImportResultSuccessCounter += postcssImportResultSuccess ? 1 : 0;
		lightningcssResultSuccessCounter += lightningcssResultSuccess ? 1 : 0;
		esbuildResultSuccessCounter += esbuildResultSuccess ? 1 : 0;
	}

	if (process.env.README) {
		result.label = `[${result.label}](https://github.com/romainmenke/css-import-tests/tree/main/tests/${result.label})`;
	}

	console.log(`| ${result.label} | ${chromeResult} | ${firefoxResult} | ${webkitResult} | ${esbuildResult} | ${lightningcssResult} | ${csstoolsPostcssBundlerResult} | ${postcssImportResult} |`);
}

console.log(`| Total | ${chromeResultSuccessCounter} / ${relevantTestCounter} | ${firefoxResultSuccessCounter} / ${relevantTestCounter} | ${webkitResultSuccessCounter} / ${relevantTestCounter} | ${esbuildResultSuccessCounter} / ${relevantTestCounter} | ${lightningcssResultSuccessCounter} / ${relevantTestCounter} | ${csstoolsPostcssBundlerResultSuccessCounter} / ${relevantTestCounter} | ${postcssImportResultSuccessCounter} / ${relevantTestCounter} |`);

if (process.env.DEBUG) {
	for (const result of results) {
		if (result.success === false) {
			failureCount++;

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

await Promise.all([
	firefoxInstance.close(),
	chromiumInstance.close(),
	webkitInstance.close(),
]);
