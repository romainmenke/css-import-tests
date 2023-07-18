import fs from "fs/promises";
import path from "path";
import puppeteer from "puppeteer";

import './prepare-postcss-import-dev.mjs';

const { createTestSafe } = await import('./util/test.mjs')

const browser = await puppeteer.launch({
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
	results.push(
		await createTestSafe(browser, ['tests', ...testCase.split(path.sep)])
	);
}

let failureCount = 0;
for (const result of results) {
	if (result.success === false) {
		failureCount++;

		console.error(`FAIL - ${result.label}`)
		console.table(result.bundlers)

		if (process.env.DEBUG) {
			console.error(result.error);
		}

		continue;
	}
	
	console.log(`OK   - ${result.label}`)
}

await browser.close()

if (failureCount > 0) {
	console.error(`\n${failureCount} / ${testCases.length} test(s) failed in at least one bundler.`);
	process.exit(1);
}
