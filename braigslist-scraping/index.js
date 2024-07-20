const cheerio = require('cheerio');

const braigslistUrl = 'https://braigslist.vercel.app/jobs/1/';

async function main() {
  const jobIndexPage = await fetch(braigslistUrl).then(res => res.text());
  const $ = cheerio.load(jobIndexPage);

  const titleLinks = $('.title-blob > a');

  const jobs = titleLinks.map((index, link) => {
    const title = $(link).text();
    const url = $(link).attr('href');
    return { title, url };
  }).get();

  console.log(jobs);
}

// noinspection JSIgnoredPromiseFromCall
main();