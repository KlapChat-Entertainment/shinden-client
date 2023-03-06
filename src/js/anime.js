import handleWindowMovement from "./lib/handleWindowMovement.js";
import finishLoading from "./lib/finishLoading.js";

handleWindowMovement()

const ANIME_OBJECT = JSON.parse(sessionStorage.getItem("ANIME_OBJECT"));
const ANIME_OL = document.querySelector("#episodeOl");
document.querySelector("img").setAttribute("src", ANIME_OBJECT.imageLink);
document.querySelector(".title").innerHTML = ANIME_OBJECT.name;

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