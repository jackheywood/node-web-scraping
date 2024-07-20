const fs = require('fs');
const cheerio = require('cheerio');

const url = 'https://reactnativetutorial.net/lesson2.html';

async function main() {
    const html = await fetch(url).then((res) => res.text());
    fs.writeFileSync('./test.html', html);

    const $ = await cheerio.load(html);

    $('h2').each((index, element) => {
        console.log($(element).text());
    });
}

// noinspection JSIgnoredPromiseFromCall
main();
