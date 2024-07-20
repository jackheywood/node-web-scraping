const cheerio = require('cheerio');

const braigslistUrl = 'https://braigslist.vercel.app';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function getHtml(url) {
  const timeout = Math.floor(Math.random() * 2000) + 1000;
  await sleep(timeout);
  return await fetch(url).then(response => response.text());
}

async function scrapeJobsFromIndexPages() {
  console.log('Scraping index pages...');
  const jobs = [];

  for (let i = 1; i <= 14; i++) {
    const jobPage = await getHtml(`${braigslistUrl}/jobs/${i}/`);
    printProgress(i, 14);

    const $ = cheerio.load(jobPage);

    const titleLinks = $('.title-blob > a');

    const pageJobs = titleLinks.map((index, link) => {
      const title = $(link).text();
      const url = $(link).attr('href');
      return { title, url };
    }).get();

    jobs.push(...pageJobs);
  }

  return jobs;
}

async function scrapeJobDescriptions(jobs) {
  console.log('Scraping job descriptions...');
  let i = 0;

  for (const job of jobs) {
    const descriptionPage = await getHtml(`${braigslistUrl}${job.url}`);
    printProgress(++i, jobs.length);

    const $ = cheerio.load(descriptionPage);
    job.description = $('div').text();
  }

  return jobs;
}

function printProgress(index, total) {
  const progress = ((index / total) * 100).toFixed(1);
  process.stdout.clearLine(0);
  process.stdout.cursorTo(0);
  process.stdout.write(`Progress: ${progress}%`);
  if (index >= total) {
    process.stdout.write('\n');
  }
}

async function main() {
  return await scrapeJobsFromIndexPages()
    .then(jobs => scrapeJobDescriptions(jobs));
}

main().then(jobs => {
  console.log(jobs);
});