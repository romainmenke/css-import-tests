import fs from "fs/promises";
import puppeteer from "puppeteer";
import './prepare-postcss-import-dev.mjs';

const { createTest } = await import('./util/test.mjs')

const browser = await puppeteer.launch({
	headless: 'new',
});

const testCases = (await fs.readdir('./tests', { withFileTypes: true })).filter(dirent => {
	return dirent.isDirectory()
}).map(dirent => {
	return dirent.name
})

const results = [];

for (let i = 0; i < testCases.length; i++) {
	const testCase = testCases[i];
	const port = 8080 + i;

	try {
		await createTest(browser, port, ['tests', testCase])
		results.push({
			label: testCase,
			success: true,
		});
	} catch (e) {
		results.push({
			label: testCase,
			success: false,
			error: e,
		});
	}
}

let hasFailures = false
for (const result of results) {
	if (result.success === false) {
		hasFailures = true;

		console.error(`FAIL - ${result.label}`)

		if (process.env.DEBUG) {
			console.error(result.error);
		}

		continue;
	}
	
	console.log(`OK - ${result.label}`)
}

await browser.close()

if (hasFailures) {
	process.exit(1);
}
