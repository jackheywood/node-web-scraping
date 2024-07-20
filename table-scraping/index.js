const cheerio = require('cheerio');

const tableUrl = 'https://www.codingwithstefan.com/table-example/';
const tableHeaders = [];
const scrapedData = [];

async function main() {
  const http = await fetch(tableUrl).then(res => res.text());
  const $ = cheerio.load(http);

  $('table > tbody > tr').each((index, row) => {
    if (index === 0) {
      scrapeHeaderRow($, row);
    } else {
      scrapeDataRow($, row);
    }
  });

  console.log(scrapedData);
}

function scrapeHeaderRow($, row) {
  const headers = $(row).find('th');

  headers.each((index, header) => {
    tableHeaders.push($(header).text().toLowerCase());
  });
}

function scrapeDataRow($, row) {
  const cells = $(row).find('td');

  const rowData = {};
  cells.each((index, cell) => {
    rowData[tableHeaders[index]] = $(cell).text();
  })

  scrapedData.push(rowData);
}

// noinspection JSIgnoredPromiseFromCall
main();