import * as cheerio from "cheerio"
import { session } from "electron";
import fetch, { Headers } from 'electron-fetch'
import Anime from "../Anime";
import AnimeHeaders from "../AnimeHeaders";
import Episode from "../Episode";
import Player from "../Player";
import sleep from "../Sleep";
import FormData from 'form-data'

const shindenUrl = "https://shinden.pl";

export default {
    async cookieFetch(URL: string, REQ_HEADERS: HeadersInit) : Promise<string> {
        const HEADERS = new Headers(REQ_HEADERS);

        const REQUEST = await fetch(URL, {
            method: "GET",
            headers:  HEADERS,
            redirect: "manual",
            follow: 0,
            session: session.defaultSession,
            useSessionCookies: true,
        });

        const HTML: string = await REQUEST.text();

        return HTML;
    },
    async searchAnime(name: string) : Promise<Array<Anime>> {
        const animeName = name.replace(/\s/g, "+");
    
        const URL = `${shindenUrl}/series?search=${animeName}`

        const HTML = await this.cookieFetch(URL, AnimeHeaders.Shinden.FRONTEND);
    
        const $ = cheerio.load(HTML);
    
        const datarow = $(".title-table");
    
        const ANIME_ARRAY = new Array<Anime>(); 

        datarow.find(".div-row").each((i: number, data: cheerio.Element) => {   
            let name: string, link_to_series: string, link_to_image: string, episodes: string;
    
            $(data).find("h3").each((i: number, data: cheerio.Element) => {
                name = $(data).find("a").text();
                link_to_series = shindenUrl + $(data).find("a").attr("href");
            });
    
    
            
    
            if($(data).find(".cover-col").find("a").attr("href") == "javascript:void(0)") {
                link_to_image = shindenUrl+ "/res/other/placeholders/title/100x100.jpg";
            } else {
                link_to_image = shindenUrl + $(data).find(".cover-col").find("a").attr("href");
            }
    
            const animetype = $(data).find(".title-kind-col").text();
            episodes = $(data).find(".episodes-col").text();
            episodes = episodes.replace(" ", "");
            const rating = $(data).find(".rate-top").text();
    
            if(name != undefined) {
                name = name.replace(/["]/g, "");
                ANIME_ARRAY.push(new Anime(name, link_to_series, link_to_image, animetype, rating, episodes, ""));
            }

        });

        return ANIME_ARRAY;
    },
    async getDescription(linkToSeries: string) : Promise<string> {
        const URL = linkToSeries;
    
        const HTML = await this.cookieFetch(URL, AnimeHeaders.Shinden.FRONTEND);
    
        const $ = cheerio.load(HTML);
    
        const datarow = $("#description");
        let description = datarow.find("p").text();
        if (description.length < 3) {
            description = "Brak opisu !";
        }
        
        return description;
    
    },
    async getEpisodes(linkToSeries: string) : Promise<Array<Episode>> {
        const URL = linkToSeries + "/all-episodes";
    
        const HTML = await this.cookieFetch(URL, AnimeHeaders.Shinden.FRONTEND);
    
        const $ = cheerio.load(HTML);
    
        const datarow = $("tbody");
    
        const EPISODES: Array<Episode> = [];
    
        datarow.find(".ep-title").each((i: number, data: cheerio.Element)=>{
            EPISODES.push(new Episode($(data).text(), ""));
        });
    
        datarow.find("a.button.active").each((i: number, data: cheerio.Element)=>{
            if(EPISODES[i]) {
                EPISODES[i].link = shindenUrl + $(data).attr("href");
            }
        });
    
        EPISODES.reverse();
    
        return EPISODES;
    
    },
    async getPlayer(onlineId: string) : Promise<string> {
        const URL_1 = `https://api4.shinden.pl/xhr/${onlineId}/player_load?auth=X2d1ZXN0XzowLDUsMjEwMDAwMDAsMjU1LDQxNzQyOTM2NDQ%3D`;
        const URL_2 = `https://api4.shinden.pl/xhr/${onlineId}/player_show?auth=X2d1ZXN0XzowLDUsMjEwMDAwMDAsMjU1LDQxNzQyOTM2NDQ%3D&width=0&height=-1`;

        const HEADERS = new Headers(AnimeHeaders.Shinden.API);

        const RESP_1_DATA = await fetch(URL_1, {
            method: "GET",
            headers: HEADERS
        });

        const SET_COOKIE = RESP_1_DATA.headers.get("set-cookie");
        HEADERS.set("Cookie", SET_COOKIE);

        await sleep(5000);

        const DATA = await fetch(URL_2, {
            method: "GET",
            headers: HEADERS
        });

        const HTML = await DATA.text();
    
        const $ = cheerio.load(HTML);
    
        const datarow = $("iframe");
    
        return datarow.toString();
    },
    async getPlayers(episodeLink: string) : Promise<Array<Player>> {
        const PLAYERS = new Array<Player>();
        const URL = episodeLink;
    
        if(URL == "") {
            return PLAYERS;
        }
    
        const HTML = await this.cookieFetch(URL, AnimeHeaders.Shinden.FRONTEND);
    
        const $ = cheerio.load(HTML);
    
        const datarow = $("tbody");
    
        datarow.find(".ep-buttons").each((i: number, data: cheerio.Element)=>{
            $(data).find("a").each((a_i: number, a_data: cheerio.Element)=>{
                const JSON_STRING = $(a_data).attr("data-episode");
                const JSON_OBJ = JSON.parse(JSON_STRING);
                PLAYERS.push(new Player(JSON_OBJ.player, JSON_OBJ.max_res, JSON_OBJ.lang_audio, JSON_OBJ.lang_subs, JSON_OBJ.online_id));
            });
        });
    
        return PLAYERS;
    },
    async login(loginData: {password: string, email: string}) {
        const FORMDATA = new FormData();
        FORMDATA.append("password", loginData.password);
        FORMDATA.append("remember", "on");
        FORMDATA.append("username", loginData.email);

        const url = "https://shinden.pl/main/login";

        const HEADERS = new Headers(AnimeHeaders.Shinden.FRONTEND);

        await fetch(url, {
            method: 'GET',
            headers: new Headers(AnimeHeaders.Shinden.FRONTEND),
            session: session.defaultSession,
            useSessionCookies: true
        });

        await fetch(url, {
            method: 'POST',
            headers: HEADERS,
            body: FORMDATA,
            session: session.defaultSession,
            useSessionCookies: true
        });
    },
    async clearCookies() {
        session.defaultSession.clearStorageData();
    },
    async getLoginStatus() : Promise<boolean> {
        const cookies = await session.defaultSession.cookies.get({url: 'https://shinden.pl', name: 'autologin'});

        if(cookies.length > 0) {
            return true;
        } else {
            return false;
        }
    },
    async getUserName() : Promise<string | null> {
        const LOGIN_STATUS: boolean = await this.getLoginStatus();

        if(LOGIN_STATUS) {
            const REQ = await fetch(`${shindenUrl}/user`, {
                headers: new Headers(AnimeHeaders.Shinden.FRONTEND),
                session: session.defaultSession,
                useSessionCookies: true
            });

            if(REQ.ok) {
                const HTML = await REQ.text();
                const $ = cheerio.load(HTML);
                const title = $('title').text();
                const username = title.split('(użytkownik)')[0].replace(' ', '');
                return username;
            } else {
                return null;
            }
        } else {
            return null;
        }
    },
    async getUserProfileImage() : Promise<string | null> {
        const LOGIN_STATUS: boolean = await this.getLoginStatus();

        if(LOGIN_STATUS) {
            const REQ = await fetch(`${shindenUrl}/user`, {
                headers: new Headers(AnimeHeaders.Shinden.FRONTEND),
                session: session.defaultSession,
                useSessionCookies: true
            });

            if(REQ.ok) {
                const HTML = await REQ.text();
                const $ = cheerio.load(HTML);
                const img = $('.info-aside-img').attr('src');
                const src = shindenUrl + img;
                return src;
            } else {
                return null;
            }
        } else {
            return null;
        }
    }
}