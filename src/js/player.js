import handleWindowMovement from "./lib/handleWindowMovement.js";
import finishLoading from "./lib/finishLoading.js";

handleWindowMovement();

const PLAYER_OBJECT = JSON.parse(sessionStorage.getItem("PLAYER_OBJECT"));

const PLAYER_HTML = await window.shindenAPI.getPlayer(PLAYER_OBJECT.onlineId);

const DIV = document.createElement("div");

DIV.innerHTML = PLAYER_HTML;

let link = DIV.firstChild.getAttribute("src");
if (link.charAt(0) == "/" && link.charAt(1) == "/") {
    link = link.replace("//", "https://");
}
DIV.firstChild.setAttribute("src", link);
DIV.setAttribute("class", "videoPlayerContainer");

document.querySelector(".playerMain").appendChild(DIV);

finishLoading();