const cheerio = require('cheerio');

const tableUrl = 'https://www.codingwithstefan.com/table-example/';

async function main() {
  const http = await fetch(tableUrl).then(res => res.text());
  const $ = cheerio.load(http);

  const scrapedData = [];

  $('table > tbody > tr').each((index, row) => {
    if (index === 0) return;

    const cells = $(row).find('td');

    const company = $(cells[0]).text();
    const contact = $(cells[1]).text();
    const country = $(cells[2]).text();

    scrapedData.push({ company, contact, country });
  });

  console.log(scrapedData);
}

// noinspection JSIgnoredPromiseFromCall
main();