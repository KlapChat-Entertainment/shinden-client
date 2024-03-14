import Anime from "../../api/Anime";

export default async function checkLocalStorage(ANIME_OBJECT: Anime) : Promise<boolean> {
    if(localStorage.getItem("FAVORITE")) {
        const FAVORITE_ARRAY : Array<Anime> = JSON.parse(localStorage.getItem("FAVORITE"));
        const FILTER_ARRAY = FAVORITE_ARRAY.filter(ANIME => {
            return ANIME.name == ANIME_OBJECT.name;
        });
        if(FILTER_ARRAY.length < 1) {
            return false;
        } else {
            return true;
        }
    } else {
        localStorage.setItem("FAVORITE", JSON.stringify([]));
        return false;
    }
}