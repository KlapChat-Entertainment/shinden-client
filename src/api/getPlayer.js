const cheerio = require("cheerio");
const ApiHeaders = require("./ApiHeaders");
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const sleep = require("./sleep");



async function getPlayer(onlineId) {
    const URL_1 = `https://api4.shinden.pl/xhr/${onlineId}/player_load?auth=X2d1ZXN0XzowLDUsMjEwMDAwMDAsMjU1LDQxNzQyOTM2NDQ%3D`;
    const URL_2 = `https://api4.shinden.pl/xhr/${onlineId}/player_show?auth=X2d1ZXN0XzowLDUsMjEwMDAwMDAsMjU1LDQxNzQyOTM2NDQ%3D&width=0&height=-1`;

    const HEADERS = new Headers(ApiHeaders);
    // First request

    const RESP_1_DATA = await fetch(URL_1, {
        method: "GET",
        credentials: "same-site",
        headers: HEADERS
    });

    // Fix cookies bug
    const SET_COOKIE = RESP_1_DATA.headers.get("set-cookie");
    HEADERS.set("Cookie", SET_COOKIE);

    await sleep(5000);
    // Second request after 5 seconds, beacuse shinden moment lmao

    const DATA = await fetch(URL_2, {
        method: "GET",
        credentials: "same-site",
        headers: HEADERS
    });

    const HTML = await DATA.text();

    const $ = cheerio.load(HTML);

    const datarow = $("iframe");

    return datarow.toString();
}

module.exports = getPlayer;