import '../index.scss';
import handleWindowMovement from './lib/handleWindowMovement';

handleWindowMovement();

document.querySelector("form").addEventListener("submit", async (e: SubmitEvent) => {
    e.preventDefault();
    const input: HTMLInputElement = document.querySelector("#animeName");
    const ANIME_NAME = input.value;
    sessionStorage.setItem("ANIME_NAME", ANIME_NAME);
    window.location.href="./searchResults.html";
});