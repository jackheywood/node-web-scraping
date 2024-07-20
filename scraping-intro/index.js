const cheerio = require('cheerio');

async function main() {
    await selectMultiple();
    await selectId();
    await selectClass();
    await selectAttribute();
}

async function selectMultiple() {
    console.log('\nSELECT MULTIPLE');
    const $ = await getAsync('https://reactnativetutorial.net/lesson2.html');

    $('h2').each((_, element) => {
        console.log($(element).text());
    });
}

async function selectId() {
    console.log('\nSELECT ID');
    const $ = await getAsync('https://reactnativetutorial.net/lesson3.html');

    console.log($('#red').text());
}

async function selectClass() {
    console.log('\nSELECT CLASS');
    const $ = await getAsync('https://reactnativetutorial.net/lesson5.html');

    $('.red').each((_, element) => {
        console.log($(element).text());
    });
}

async function selectAttribute() {
    console.log('\nSELECT ATTRIBUTE');
    const $ = await getAsync('https://reactnativetutorial.net/lesson6.html');

    console.log($('[data-customer="22293"]').text());
}

async function getAsync(url) {
    const html = await fetch(url).then((res) => res.text());
    return cheerio.load(html);
}

// noinspection JSIgnoredPromiseFromCall
main();
