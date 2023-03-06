import handleWindowMovement from "./lib/handleWindowMovement.js";

handleWindowMovement();

document.querySelector("form").addEventListener("submit", async e => {
    e.preventDefault();
    const ANIME_NAME = e.target.animeName.value;
    sessionStorage.setItem("ANIME_NAME", ANIME_NAME);
    window.location.href="./searchresults.html";
});