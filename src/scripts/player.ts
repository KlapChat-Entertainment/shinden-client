import handleWindowMovement from "./lib/handleWindowMovement";
import finishLoading from "./lib/finishLoading";
import '../index.scss';

handleWindowMovement();

async function handle() {
    const PLAYER_OBJECT = JSON.parse(sessionStorage.getItem("PLAYER_OBJECT"));

    const PLAYER_HTML = await window.shindenAPI.getPlayer(PLAYER_OBJECT.onlineId);

    const DIV: HTMLDivElement = document.createElement("div");

    DIV.innerHTML = PLAYER_HTML;

    if(DIV.firstChild) {
        const iframe: HTMLIFrameElement = DIV.firstChild as HTMLIFrameElement;
        let link = iframe.getAttribute("src");
        if (link.charAt(0) == "/" && link.charAt(1) == "/") {
            link = link.replace("//", "https://");
        }
        iframe.setAttribute("src", link);
        DIV.setAttribute("class", "videoPlayerContainer");
    } else {
        DIV.innerHTML = "Błąd ładowania odtwarzacza! Jeśli uważasz że to problem z aplikacją, zgłoś to na Githubie.";
    }

    document.querySelector(".playerMain").appendChild(DIV);


    finishLoading();
}

handle();
