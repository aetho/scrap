// Scrapes all the airing dramas

const puppeteer = require('puppeteer');

let url = 'https://mydramalist.com/search?adv=titles&ty=68&co=3&st=1&so=top&page=1';
let dramas = [];

async function GetDramas(browser) {
	const page = await browser.newPage();

	// goto URL and wait until page has loaded.
	await page.goto(url, {
		waitUntil: 'networkidle2'
	});

	let pageDramas = await page.$$('.m-t > *[id^="mdl"] h6 > a:nth-child(1)');

	for (let i = 0; i < pageDramas.length; i++) {
		pageDramas[i] = (await (await pageDramas[i].getProperty('href')).jsonValue());
	}

	// push all pageDramas to dramas
	dramas = [...dramas, ...pageDramas];

	let nextBtn = await page.$('li.page-item.next > a');
	if (nextBtn) {
		// Get the url that the next button points to.
		url = (await (await nextBtn.getProperty('href')).jsonValue());

		await page.close();
		await GetDramas(browser);
	} else {
		await page.close();
	}
}

(async () => {
	const browser = await puppeteer.launch();

	await GetDramas(browser);
	
	for (var i = 0, len = dramas.length; i < len; i++) {
		console.log(dramas[i]);
	}

	await browser.close();
})();