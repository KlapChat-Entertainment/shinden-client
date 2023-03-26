const cheerio = require("cheerio");
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const Episode = require("../Episode");
const sleep = require("../sleep");
const AnimeSitesHeaders = require("../AnimeSitesHeaders");
const Anime = require('../Anime');
const Player = require('../Player');
const shindenUrl = "https://shinden.pl";


module.exports = {
    jwtCookie: "",
    sess_shinden: "",
    async cookieFetch(URL, REQ_HEADERS) {
        const HEADERS = new Headers(REQ_HEADERS);
        
        let cookieString = "";

        if(this.jwtCookie) {
            cookieString += `jwtCookie=${this.jwtCookie};`;
        }

        if(this.sess_shinden) {
            cookieString += `sess_shinden=${this.sess_shinden}`;
        }

        HEADERS.append("Cookie", cookieString);

        const REQUEST = await fetch(URL, {
            method: "GET",
            headers: HEADERS
        });

        const HTML = await REQUEST.text();

        REQUEST.headers.raw()["set-cookie"].forEach(scstring=>{
            let newSetCookie = scstring.split(";")[0];
            if(newSetCookie.split("=")[0]=="jwtCookie") {
                this.jwtCookie = newSetCookie.split("=")[1]
            } else if(newSetCookie.split("=")[0]=="sess_shinden") {
                this.sess_shinden = newSetCookie.split("=")[1];
            }
        });

        return HTML;
    },
    async searchAnime(name) {

        let animeName = name.replace(/\s/g, "+");
    
        const URL = `${shindenUrl}/series?search=${animeName}`

        const HTML = await this.cookieFetch(URL, AnimeSitesHeaders.Shinden.FRONTEND);
    
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
    
    },
    async getDescription(linkToSeries) {
        const URL = linkToSeries;
    
        const HTML = await this.cookieFetch(URL, AnimeSitesHeaders.Shinden.FRONTEND);
    
        const $ = cheerio.load(HTML);
    
        const datarow = $("#description");
        let description = datarow.find("p").text();
        if (description.length < 3) {
            description = "Brak opisu !";
        }
        
        return description;
    
    },
    async getEpisodes(linkToSeries) {
        const URL = linkToSeries + "/all-episodes";
    
        const HTML = await this.cookieFetch(URL, AnimeSitesHeaders.Shinden.FRONTEND);
    
        const $ = cheerio.load(HTML);
    
        const datarow = $("tbody");
    
        const EPISODES = new Array();
    
        datarow.find(".ep-title").each(async (i, data)=>{
            EPISODES.push(new Episode($(data).text(), ""));
        });
    
        datarow.find("a.button.active").each(async (i, data)=>{
            if(EPISODES[i]) {
                EPISODES[i].link = shindenUrl + $(data).attr("href");
            }
        });
    
        EPISODES.reverse()
    
        return EPISODES;
    
    },
    async getPlayer(onlineId) {
        const URL_1 = `https://api4.shinden.pl/xhr/${onlineId}/player_load?auth=X2d1ZXN0XzowLDUsMjEwMDAwMDAsMjU1LDQxNzQyOTM2NDQ%3D`;
        const URL_2 = `https://api4.shinden.pl/xhr/${onlineId}/player_show?auth=X2d1ZXN0XzowLDUsMjEwMDAwMDAsMjU1LDQxNzQyOTM2NDQ%3D&width=0&height=-1`;
    
        const HEADERS = new Headers(AnimeSitesHeaders.Shinden.API);
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
    },
    async getPlayers(episodeLink) {
        const PLAYERS = new Array();
        const URL = episodeLink;
    
        if(URL == "") {
            return PLAYERS;
        }
    
        const HTML = await this.cookieFetch(URL, AnimeSitesHeaders.Shinden.FRONTEND);
    
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
    },
    async login(loginData) {
        /* {password: "example", email: "example@example.com"} */
        const FORMDATA = new URLSearchParams();
        FORMDATA.append("password", loginData.password);
        FORMDATA.append("remember", "on");
        FORMDATA.append("username", loginData.email);

        const url = "https://shinden.pl/main/login";

        const HEADERS = new Headers(AnimeSitesHeaders.Shinden.LOGIN);

        const REQUEST1 = await fetch(url, {
            method: "POST",
            headers: HEADERS,
            body: FORMDATA.toString(),
            redirect: "manual",
            follow: 0
        });

        const SET_COOKIE = REQUEST1.headers.get("set-cookie");

        const REDIRECT_URL = REQUEST1.headers.get("Location");

        HEADERS.append("Cookie", SET_COOKIE);

        HEADERS.append("Referer", url);

        const REQUEST2 = await fetch(REDIRECT_URL, {
            method: "POST",
            headers: HEADERS,
            body: FORMDATA.toString(),
            redirect: "manual",
            follow: 0
        });

        let cookiesToReturn = [];
        cookiesToReturn.push("cb-rodo=accepted;");
        cookiesToReturn = [...cookiesToReturn, ...REQUEST2.headers.raw()["set-cookie"]];

        cookiesToReturn = cookiesToReturn.filter(sc=>{
            return sc.split("=")[0]=="sess_shinden" || sc.split("=")[0]=="jwtCookie";
        });


        REQUEST2.headers.raw()["set-cookie"].forEach(scstring=>{
            let newSetCookie = scstring.split(";")[0];
            if(newSetCookie.split("=")[0]=="jwtCookie") {
                this.jwtCookie = newSetCookie.split("=")[1]
            } else if(newSetCookie.split("=")[0]=="sess_shinden") {
                this.sess_shinden = newSetCookie.split("=")[1];
            }
        });

    },
    
}