const fs = require('fs');
const cheerio = require('cheerio');

const url = 'https://reactnativetutorial.net/css-selectors/';

async function main() {
    const html = await fetch(url).then((res) => res.text());
    const $ = await cheerio.load(html);

    const text = $('h1').text();
    console.log(text);

    fs.writeFileSync('./test.html', html);
}

// noinspection JSIgnoredPromiseFromCall
main();
