const cheerio = require('cheerio');
const puppeteer = require('puppeteer');

const craigslistUrl = 'https://newyork.craigslist.org/search/sof#search=1~thumb~0~0';

async function scrapeJobs() {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  const listings = await scrapeJobListings(page);
  const jobs = await scrapeJobPages(listings, page);
  await browser.close();
  return jobs;
}

async function scrapeJobListings(page) {
  const $ = await loadHtml(craigslistUrl, page);

  return $('.result-info')
    .map((_, result) => {
      const titleElement = $(result).find('.posting-title');
      const supertitleElement = $(result).find('.supertitle');

      const title = $(titleElement).text().trim();
      const url = $(titleElement).attr('href').trim();
      const location = $(supertitleElement).text().trim();

      return { title, url, location };
    }).get();
}

async function scrapeJobPages(listings, page) {
  for (let i = 0; i < listings.length; i++) {
    console.log(`Processing job ${i + 1}/${listings.length}`);
    const $ = await loadHtml(listings[i].url, page);

    listings[i].companyName = $('.company-name').text().trim();
    listings[i].jobTitle = $('.job_title > .valu').text().trim();
    listings[i].compensation = $('.remuneration > .valu').text().trim();
    listings[i].employmentType = $('.employment_type > .valu').text().trim();
    listings[i].datePosted = new Date($('#display-date > time').attr('datetime'));
    listings[i].description = $('#postingbody').text().trim();
  }
  return listings;
}

async function loadHtml(url, page) {
  await sleep(getRandomInt(500, 1500));

  console.log(`Loading url: ${url}`);

  await page.goto(url, { timeout: 60000, waitUntil: 'networkidle0' });
  const html = await page.content();

  console.log('Url loaded');

  return cheerio.load(html);
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

scrapeJobs()
  .then((results) => console.log(results));
