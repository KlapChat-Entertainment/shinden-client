const cheerio = require("cheerio");
const Episode = require("./Episode");
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const FrontHeaders = require("./FrontHeaders");
const shindenUrl = "https://shinden.pl";


async function getEpisodes(linkToSeries) {
    const URL = linkToSeries + "/all-episodes";

    const HEADERS = new Headers(FrontHeaders);

    
    const DATA = await fetch(URL, {
        method: "GET",
        credentials: "same-origin",
        headers: HEADERS
    });

    const HTML = await DATA.text();

    const $ = cheerio.load(HTML);

    const datarow = $("tbody");

    const EPISODES = new Array();

    datarow.find(".ep-title").each(async (i, data)=>{
        EPISODES.push(new Episode($(data).text(), ""));
    });

    datarow.find("a").each(async (i, data)=>{
        EPISODES[i].link = shindenUrl + $(data).attr("href");
    });

    EPISODES.reverse()

    return EPISODES;

}

module.exports = getEpisodes;