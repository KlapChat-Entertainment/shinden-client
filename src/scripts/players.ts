import Player from "../api/Player";
import finishLoading from "./lib/finishLoading";
import handleWindowMovement from "./lib/handleWindowMovement";
import '../index.scss';

handleWindowMovement();

async function handle() {
    const PLAYERS: Array<Player> = await window.shindenAPI.getPlayers(sessionStorage.getItem("EPISODE_LINK"));
    const TABLE: HTMLTableElement = document.querySelector("#animeTable");

    PLAYERS.forEach(async PLAYER => {
        const row = TABLE.insertRow();
        const serviceCell = row.insertCell(0);
        const qualityCell = row.insertCell(1);
        const audioLangCell = row.insertCell(2);
        const subLangCell = row.insertCell(3);
        
        const A = document.createElement("a");
        A.href = "./player.html";
        A.innerText = PLAYER.name;
        A.addEventListener("click", async ()=>{
            sessionStorage.setItem("PLAYER_OBJECT", JSON.stringify(PLAYER));
        });
        serviceCell.appendChild(A);

        qualityCell.innerHTML = PLAYER.quality;
        audioLangCell.innerHTML = PLAYER.audioLang;
        subLangCell.innerHTML = PLAYER.subLang;
        
    });

    finishLoading();
}

handle();
