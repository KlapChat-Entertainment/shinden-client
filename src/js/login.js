import finishLoading from "./lib/finishLoading.js";
import handleAutoLogin from "./lib/handleAutoLogin.js";
import handleWindowMovement from "./lib/handleWindowMovement.js";
import startLoading from "./lib/startLoading.js";

handleWindowMovement();

await handleAutoLogin();

const FORM = document.querySelector("form");

// Diagnostic

const LOGIN_STATUS = document.querySelector("#loginStatus");

FORM.addEventListener("submit", async event=>{
    event.preventDefault();
    startLoading();
    const EMAIL = document.querySelector("#email").value;
    const PASSWORD = document.querySelector("#password").value;
    
    await window.shindenAPI.login({password: PASSWORD, email: EMAIL});
    
    const COOKIES = await window.shindenAPI.getCookies();
    localStorage.setItem("SHINDEN.PL_COOKIES", JSON.stringify(COOKIES));

    await loginDiag();

    finishLoading();
});

document.querySelector("#clearCookies").addEventListener("click", async _event=>{
    await window.shindenAPI.clearCookies();
    const COOKIES = await window.shindenAPI.getCookies();
    localStorage.setItem("SHINDEN.PL_COOKIES", JSON.stringify(COOKIES));
    LOGIN_STATUS.innerHTML = "Brak danych logowania w pamięci";
});



async function loginDiag() {
    const COOKIES = await window.shindenAPI.getCookies();
    if(COOKIES.jwt && COOKIES.session && COOKIES.autologin) {
        LOGIN_STATUS.innerHTML = "Logowanie powiodło sie."
        return true;
    } else if(COOKIES.session){
        LOGIN_STATUS.innerHTML = "Błąd logowania, nie otrzymano wszystkich ciasteczek."
        return false;
    } else {
        LOGIN_STATUS.innerHTML = "Brak danych logowania w pamięci.";
    }
}

await loginDiag();

finishLoading();