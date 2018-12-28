// Scrapes all the airing dramas

const puppeteer = require('puppeteer');

const url = 'https://wiki.d-addicts.com/List_of_Dramas_aired_in_Korea_by_Network_in_2018';
const reYear = 2018;

(async () => {
	const browser = await puppeteer.launch();
	const page = await browser.newPage();

	await page.goto(url);

	await page.waitForSelector('.mw-parser-output'); // Make dramas have loaded before continuing
	const airing = await page.$$('#airing > td:nth-child(3) > a:nth-child(1)'); // Get drama anchors elements


	// extract href attribute from anchors
	for (let i = 0; i < airing.length; i++) {
		let dramaURL = await (await airing[i].getProperty('href')).jsonValue();

		dramaURL = dramaURL.replace('https://wiki.d-addicts.com/', 'https://mydramalist.com/search?q=');
		dramaURL += `&adv=titles&re=${reYear},${reYear}&adv=titles&ty=68&co=3&re=2018,2018&so=relevance`;
		dramaURL = dramaURL.replace(new RegExp('_', 'g'), '+');
		
		console.log(dramaURL);
	}
	await browser.close();
})();