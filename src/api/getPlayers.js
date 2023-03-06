const cheerio = require("cheerio");
const Episode = require("./Episode");
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const FrontHeaders = require("./FrontHeaders");
const Player = require("./Player");
const shindenUrl = "https://shinden.pl";


async function getPlayers(episodeLink) {
    const PLAYERS = new Array();
    const URL = episodeLink;

    if(URL == "") {
        return PLAYERS;
    }

    const HEADERS = new Headers(FrontHeaders);

    
    const DATA = await fetch(URL, {
        method: "GET",
        credentials: "same-origin",
        headers: HEADERS
    });

    const HTML = await DATA.text();

    const $ = cheerio.load(HTML);

    const datarow = $("tbody");

    

    datarow.find(".ep-buttons").each(async(i, data)=>{
        $(data).find("a").each(async(a_i, a_data)=>{
            const JSON_STRING = $(a_data).attr("data-episode");
            const JSON_OBJ = JSON.parse(JSON_STRING);
            PLAYERS.push(new Player(JSON_OBJ.player, JSON_OBJ.max_res, JSON_OBJ.lang_audio, JSON_OBJ.lang_subs, JSON_OBJ.online_id));
        });
    });

    return PLAYERS;
}

module.exports = getPlayers;