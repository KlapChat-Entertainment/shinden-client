const cheerio = require("cheerio");
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const shindenUrl = "https://shinden.pl";
const Anime = require("./Anime");
const FrontHeaders = require("./FrontHeaders");


async function searchAnime(name) {
    let animeName = name.replace(/\s/g, "+");

    const URL = `${shindenUrl}/series?search=${animeName}`

    const HEADERS = new Headers(FrontHeaders);

    
    const DATA = await fetch(URL, {
        method: "GET",
        credentials: "same-origin",
        headers: HEADERS
    });

    const HTML = await DATA.text();

    const $ = cheerio.load(HTML);

    const datarow = $(".title-table");

    const ANIME_ARRAY = new Array();
    

    datarow.find(".div-row").each(async (i, data)=>{   
        let name, link_to_series, link_to_image, animetype, episodes, rating;

        $(data).find("h3").each(async (i, data)=>{
            name = $(data).find("a").text();
            link_to_series = shindenUrl + $(data).find("a").attr("href");
        });


        

        if($(data).find(".cover-col").find("a").attr("href") == "javascript:void(0)") {
            link_to_image = shindenUrl+ "/res/other/placeholders/title/100x100.jpg";
        } else {
            link_to_image = shindenUrl + $(data).find(".cover-col").find("a").attr("href");
        }

        animetype = $(data).find(".title-kind-col").text();
        episodes = $(data).find(".episodes-col").text();
        episodes = episodes.replace(" ", "");
        rating = $(data).find(".rate-top").text();

        if(name != undefined) {
            name = name.replace(/["]/g, "");
            ANIME_ARRAY.push(new Anime(name, link_to_series, link_to_image, animetype, rating, episodes, ""));
        }

    });

    return ANIME_ARRAY;

}

module.exports = searchAnime;