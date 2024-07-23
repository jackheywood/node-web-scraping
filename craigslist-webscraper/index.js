const cheerio = require('cheerio');
const mongoose = require('mongoose');
const puppeteer = require('puppeteer');
require('dotenv').config();

const JobListing = require('./models/job-listing');

const craigslistUrl = 'https://newyork.craigslist.org/search/sof#search=1~thumb~0~0';

async function scrapeJobs() {
  await connectToMongoDb();
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  const jobs = await scrapeJobListings(page);
  await scrapeAndSaveJobListingPages(jobs, page);
  await browser.close();
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

async function scrapeAndSaveJobListingPages(listings, page) {
  for (let i = 0; i < listings.length; i++) {
    console.log(`Processing job ${i + 1}/${listings.length}`);
    const $ = await loadHtml(listings[i].url, page);

    listings[i].companyName = $('.company-name').text().trim();
    listings[i].jobTitle = $('.job_title > .valu').text().trim();
    listings[i].compensation = $('.remuneration > .valu').text().trim();
    listings[i].employmentType = $('.employment_type > .valu').text().trim();
    listings[i].datePosted = new Date($('#display-date > time').attr('datetime'));
    listings[i].description = $('#postingbody').text().trim();

    await saveJobListing(listings[i]);
  }
  return listings;
}

async function saveJobListing(job) {
  console.log('Saving job listing');
  const jobListing = new JobListing(job);
  await jobListing.save();
  console.log('Saved job listing');
}

async function connectToMongoDb() {
  console.log('Connect to MongoDB');
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');
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

scrapeJobs().then(() => console.log('Completed'));
