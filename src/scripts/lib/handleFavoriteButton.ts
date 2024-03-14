import Anime from "../../api/Anime";
import checkLocalStorage from "./checkLocalStorage";

export default async function handleFavoriteButton(HTML_ELEMENT: HTMLElement) {
    const ANIME_OBJECT = JSON.parse(sessionStorage.getItem("ANIME_OBJECT"));
    let favoriteStatus = await checkLocalStorage(ANIME_OBJECT);
    const FAVORITE_ARRAY: Array<Anime> = JSON.parse(localStorage.getItem("FAVORITE"));
    
    if(favoriteStatus) {
        HTML_ELEMENT.innerHTML = "- Usuń z ulubionych -";
    }

    HTML_ELEMENT.addEventListener("click", async e => {
        favoriteStatus = await checkLocalStorage(ANIME_OBJECT);
        console.log(favoriteStatus);
        e.preventDefault();
        if(favoriteStatus) {
            const FILTERED_DEL_ARRAY = FAVORITE_ARRAY.filter(ANIME => {
                return ANIME.name != ANIME_OBJECT.name;
            });
            localStorage.setItem("FAVORITE", JSON.stringify(FILTERED_DEL_ARRAY));
            HTML_ELEMENT.innerHTML = "- Dodaj do ulubionych -";
        } else {
            FAVORITE_ARRAY.push(ANIME_OBJECT);
            localStorage.setItem("FAVORITE", JSON.stringify(FAVORITE_ARRAY));
            HTML_ELEMENT.innerHTML = "- Usuń z ulubionych -";
        }
    });
}