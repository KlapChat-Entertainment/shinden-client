import finishLoading from "./lib/finishLoading";
import '../index.scss';
import handleWindowMovement from "./lib/handleWindowMovement";
import handleFavoriteButton from "./lib/handleFavoriteButton";
import Anime from "src/api/Anime";

handleWindowMovement();

/**
 * This eventListener avoids the error of returning to the anime search screen without entering its name.
 */
document.querySelector("#backButton").addEventListener("click", async e => {
    if(localStorage.getItem('FROM') == 'SEARCH') { 
        window.location.href='./searchResults.html';
    } else if(localStorage.getItem('FROM') == 'FAVORITE') { 
        window.location.href='./favorite.html';
    }
});

handleFavoriteButton(document.querySelector("#favButton"));

const ANIME_OBJECT: Anime = JSON.parse(sessionStorage.getItem("ANIME_OBJECT"));
const ANIME_OL = document.querySelector("#episodeOl");
document.querySelector("img").setAttribute("src", ANIME_OBJECT.imageLink);
document.querySelector(".title").innerHTML = ANIME_OBJECT.name;

async function handle() {
    const DESCRIPTION = await window.shindenAPI.getDescription(ANIME_OBJECT.linkToSeries);
    const EPISODES = await window.shindenAPI.getEpisodes(ANIME_OBJECT.linkToSeries);

    ANIME_OL.innerHTML = "";

    EPISODES.forEach(async (EPISODE) => {
        const LI = document.createElement("li");
        const A = document.createElement("a");
        A.innerHTML = EPISODE.name;
        A.href = "./players.html";
        A.addEventListener("click", async () => {
            sessionStorage.setItem("EPISODE_LINK", EPISODE.link);
        });
        LI.appendChild(A);
        ANIME_OL.appendChild(LI);
    });
    
    document.querySelector(".botSection").innerHTML = DESCRIPTION;
    
    
    finishLoading();
}

handle();





