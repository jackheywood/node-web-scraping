const cheerio = require('cheerio');

const braigslistUrl = 'https://braigslist.vercel.app/jobs/1/';

async function main() {
  const jobIndexPage = await fetch(braigslistUrl).then(res => res.text());
  const $ = cheerio.load(jobIndexPage);

  $('.title-blob').each((index, title) => {
    console.log($(title).text());
  });
}

// noinspection JSIgnoredPromiseFromCall
main();