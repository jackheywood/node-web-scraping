const cheerio = require('cheerio');

const tableUrl = 'https://www.codingwithstefan.com/table-example/';

async function main() {
  const http = await fetch(tableUrl).then(res => res.text());
  const $ = cheerio.load(http);

  $('table > tbody > tr').each((index, row) => {
    const cells = $(row).find('td');

    const company = $(cells[0]).text();
    const contact = $(cells[1]).text();
    const country = $(cells[2]).text();

    console.log('Company:', company);
    console.log('Contact:', contact);
    console.log('Country:', country);
  });
}

// noinspection JSIgnoredPromiseFromCall
main();