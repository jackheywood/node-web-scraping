const cheerio = require('cheerio');

const tableUrl = 'https://www.codingwithstefan.com/table-example/';

async function main() {
  const http = await fetch(tableUrl).then(res => res.text());
  const $ = cheerio.load(http);

  $('table > tbody > tr > td').each((_, el) => {
    console.log($(el).text());
  });
}

// noinspection JSIgnoredPromiseFromCall
main();