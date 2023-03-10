import finishLoading from "./lib/finishLoading.js";
import handleWindowMovement from "./lib/handleWindowMovement.js";

handleWindowMovement();

const TABLE = document.getElementById("animeTable");

const ANIME_NAME = sessionStorage.getItem("ANIME_NAME");

const ANIME_ARRAY = await window.shindenAPI.searchAnime(ANIME_NAME);

localStorage.setItem("FROM", "SEARCH");


ANIME_ARRAY.forEach(async (ANIME) => {
    let row = TABLE.insertRow();
    let imagecell = row.insertCell(0);
    let namecell = row.insertCell(1);
    let typecell = row.insertCell(2);
    let episodescell = row.insertCell(3);
    let ratingcell = row.insertCell(4);
    imagecell.innerHTML = `<img src="${ANIME.imageLink}">`;
    namecell.innerHTML = `<a href="./anime.html">${ANIME.name}</a>`;
    namecell.addEventListener("click", async () => {
        sessionStorage.setItem("ANIME_OBJECT", JSON.stringify(ANIME));
    });
    typecell.innerHTML = ANIME.animeType;
    episodescell.innerHTML = ANIME.episodes;
    ratingcell.innerHTML = ANIME.rating;
});

finishLoading();