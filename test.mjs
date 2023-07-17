import puppeteer from "puppeteer";
import fs from "fs/promises";
import { createTest } from "./util/test.mjs";

const browser = await puppeteer.launch({
	headless: 'new',
});

const testCases = (await fs.readdir('./tests', { withFileTypes: true })).filter(dirent => {
	return dirent.isDirectory()
}).map(dirent => {
	return dirent.name
})

for (let i = 0; i < testCases.length; i++) {
	const testCase = testCases[i];
	const port = 8080 + i;

	try {
		await createTest(browser, port, ['tests', testCase])
		console.log(`OK - ${testCase}`);
	} catch (e) {
		console.error(`FAIL - ${testCase}`);
		console.error(e);
		process.exit(1);
	}
}

await browser.close()
