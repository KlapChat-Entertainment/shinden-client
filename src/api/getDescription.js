const cheerio = require("cheerio");
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const FrontHeaders = require("./FrontHeaders");


async function getDescription(linkToSeries) {
    const URL = linkToSeries;

    const HEADERS = new Headers(FrontHeaders);

    
    const DATA = await fetch(URL, {
        method: "GET",
        credentials: "same-origin",
        headers: HEADERS
    });

    const HTML = await DATA.text();

    const $ = cheerio.load(HTML);

    const datarow = $("#description");
    let description = datarow.find("p").text();
    if (description.length < 3) {
        description = "Brak opisu !";
    }
    
    return description;

}

module.exports = getDescription;