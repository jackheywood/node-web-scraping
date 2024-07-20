const axios = require('axios');
const cheerio = require('cheerio');

const braigslistUrl = 'https://braigslist.vercel.app';

async function scrapeJobsFromIndexPages() {
  const jobs = [];

  for (let i = 1; i <= 14; i++) {
    const jobPageUrl = `${braigslistUrl}/jobs/${i}/`;
    const jobPage = await axios.get(jobPageUrl);
    const $ = cheerio.load(jobPage.data);

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
  // Firing off all requests at once is not a good idea
  // Uses up all the ports and is likely to get you blocked
  return await Promise.all(
    jobs.map(async job => {
      const descriptionPageUrl = `${braigslistUrl}${job.url}`;
      const descriptionPage = await axios.get(descriptionPageUrl);

      const $ = cheerio.load(descriptionPage.data);

      job.description = $('div').text();
      return job;
    }));
}

async function main() {
  return await scrapeJobsFromIndexPages()
    .then(jobs => scrapeJobDescriptions(jobs));
}

main().then(jobs => {
  console.log(jobs);
});