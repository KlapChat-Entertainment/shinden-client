import finishLoading from "./lib/finishLoading.js";
import handleWindowMovement from "./lib/handleWindowMovement.js";

handleWindowMovement();


const PLAYERS = await window.shindenAPI.getPlayers(sessionStorage.getItem("EPISODE_LINK"));
const TABLE = document.querySelector("#animeTable");

PLAYERS.forEach(async PLAYER => {
    let row = TABLE.insertRow();
    let serviceCell = row.insertCell(0);
    let qualityCell = row.insertCell(1);
    let audioLangCell = row.insertCell(2);
    let subLangCell = row.insertCell(3);
    
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