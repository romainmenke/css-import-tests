import { createServer } from './create-server.mjs';

export async function createTestSafe(browser, testPath) {
	try {
		const result = await createTest(browser, testPath);
		return {
			...result,
			label: testPath.slice(1).join('/'),
		}
	} catch (e) {
		return {
			label: testPath.slice(1).join('/'),
			bundlers: [],
			success: false,
			error: e,
		}
	}
}

export async function createTest(browser, testPath) {
	let errors = [];
	let pageError = null;
	let requestHandlerError = null;
	let serverError = null;

	let imageWasRequested = false;

	const resetState = () => {
		pageError = null;
		requestHandlerError = null;
		serverError = null;

		imageWasRequested = false;
	}

	const server = createServer(
	testPath,
		() => {
			imageWasRequested = true;
		},
		(e) => {
			serverError = e;
			errors.push(e);
		},
		(e) => {
			requestHandlerError = e;
			errors.push(e);
		}
	);

	server.listen(8080);

	const context = await (('newContext' in browser) ? browser.newContext() : browser);

	const page = await context.newPage();

	if ('setCacheEnabled' in page) {
		await page.setCacheEnabled(false);
	}

	page.on('pageerror', (msg) => {
		pageError = new Error(msg);
		errors.push(pageError);
	});

	let results = {
		success: false,
		bundlers: []
	}

	{
		resetState();
		await page.goto(`http://localhost:8080/native.html`);
		await page.waitForLoadState('domcontentloaded');
		const result = await page.evaluate(async () => {
			const box = document.getElementById('box');
			const style = window.getComputedStyle(box);
			return [style.backgroundColor, style.backgroundImage];
		});

		results.bundlers.push({
			label: 'native',
			success: (!serverError && !pageError && !requestHandlerError) && (
				result[0] === 'rgb(0, 128, 0)' ||
				(
					imageWasRequested && result[1].includes('/green.png')
				)
			),
			result: result,
		});
	}

	{
		resetState();
		await page.goto(`http://localhost:8080/csstools-postcss-bundler.html`);
		await page.waitForLoadState('domcontentloaded');
		const result = await page.evaluate(async () => {
			const box = document.getElementById('box');
			const style = window.getComputedStyle(box);
			return [style.backgroundColor, style.backgroundImage];
		});

		results.bundlers.push({
			label: 'csstools-postcss-bundler',
			success: (!serverError && !pageError && !requestHandlerError) && (
				result[0] === 'rgb(0, 128, 0)' ||
				(
					imageWasRequested && result[1].includes('/green.png')
				)
			),
			result: result,
		});
	}

	{
		resetState();
		await page.goto(`http://localhost:8080/postcss-import.html`);
		await page.waitForLoadState('domcontentloaded');
		const result = await page.evaluate(async () => {
			const box = document.getElementById('box');
			const style = window.getComputedStyle(box);
			return [style.backgroundColor, style.backgroundImage];
		});

		results.bundlers.push({
			label: 'postcss-import',
			success: (!serverError && !pageError && !requestHandlerError) && (
				result[0] === 'rgb(0, 128, 0)' ||
				(
					imageWasRequested && result[1].includes('/green.png')
				)
			),
			result: result,
		});
	}

	{
		resetState();
		await page.goto(`http://localhost:8080/lightningcss.html`);
		await page.waitForLoadState('domcontentloaded');
		const result = await page.evaluate(async () => {
			const box = document.getElementById('box');
			const style = window.getComputedStyle(box);
			return [style.backgroundColor, style.backgroundImage];
		});

		results.bundlers.push({
			label: 'lightningcss',
			success: (!serverError && !pageError && !requestHandlerError) && (
				result[0] === 'rgb(0, 128, 0)' ||
				(
					imageWasRequested && result[1].includes('/green.png')
				)
			),
			result: result,
		});
	}

	{
		resetState();
		await page.goto(`http://localhost:8080/bun.html`);
		await page.waitForLoadState('domcontentloaded');
		const result = await page.evaluate(async () => {
			const box = document.getElementById('box');
			const style = window.getComputedStyle(box);
			return [style.backgroundColor, style.backgroundImage];
		});

		results.bundlers.push({
			label: 'bun',
			success: (!serverError && !pageError && !requestHandlerError) && (
				result[0] === 'rgb(0, 128, 0)' ||
				(
					imageWasRequested && result[1].includes('/green.png')
				)
			),
			result: result,
		});
	}

	{
		resetState();
		await page.goto(`http://localhost:8080/esbuild.html`);
		await page.waitForLoadState('domcontentloaded');
		const result = await page.evaluate(async () => {
			const box = document.getElementById('box');
			const style = window.getComputedStyle(box);
			return [style.backgroundColor, style.backgroundImage];
		});

		results.bundlers.push({
			label: 'esbuild',
			success: (!serverError && !pageError && !requestHandlerError) && (
				result[0] === 'rgb(0, 128, 0)' ||
				(
					imageWasRequested && result[1].includes('/green.png')
				)
			),
			result: result,
		});
	}

	await page.close();

	await server.closeAllConnections();
	await server.close();

	results.errors = errors.length > 0 ? errors : [];
	results.success = !results.error && results.bundlers.every((x => x.success === true));
	return results;
}
