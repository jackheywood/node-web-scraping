const cheerio = require('cheerio');
const puppeteer = require('puppeteer');

const craigslistUrl = 'https://newyork.craigslist.org/search/sls?cc=gb&lang=en#search=1~thumb~0~0';

async function scrapeCraigslistSalesJobs() {
  const browser = await puppeteer.launch({ headless: true });
  const $ = await loadHtml(browser, craigslistUrl);

  const jobs = $('.result-info')
    .map((_, result) => {
      const titleElement = $(result).find('.posting-title');
      const supertitleElement = $(result).find('.supertitle');

      const title = $(titleElement).text().trim();
      const url = $(titleElement).attr('href').trim();
      const location = $(supertitleElement).text().trim();

      return { title, url, location };
    }).get();

  await browser.close();
  return jobs;
}

async function loadHtml(browser, url) {
  console.log('Loading url: %s', url);
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'networkidle0' });
  const html = await page.content();
  console.log('Url loaded');
  return cheerio.load(html);
}

scrapeCraigslistSalesJobs()
  .then((results) => console.log(results));
