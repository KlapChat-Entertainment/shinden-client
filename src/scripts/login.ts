import '../index.scss';
import finishLoading from './lib/finishLoading';
import handleWindowMovement from './lib/handleWindowMovement';
import startLoading from './lib/startLoading';

handleWindowMovement();

const FORM = document.querySelector("form");
const LOGIN_STATUS_HTML = document.querySelector("#loginStatus");
const LOGOUTBUTTON: HTMLButtonElement = document.querySelector("#clearCookies");

FORM.addEventListener("submit", async event=>{
    event.preventDefault();
    startLoading();
    const EMAIL_IN: HTMLInputElement = document.querySelector("#email");
    const PASSWORD_IN: HTMLInputElement = document.querySelector("#password");
    
    const EMAIL = EMAIL_IN.value;
    const PASSWORD = PASSWORD_IN.value;

    await window.shindenAPI.login({password: PASSWORD, email: EMAIL});

    await updateLoginInfo();
});

async function updateLoginInfo() {
    FORM.style.display="none";
    const LOGIN_STATUS: boolean = await window.shindenAPI.getLoginStatus();

    if(LOGIN_STATUS) {
        const USERNAME = await window.shindenAPI.getUserName();
        if(USERNAME) {
            LOGIN_STATUS_HTML.innerHTML = `Zalogowano jako ${USERNAME}`;
        } else {
            LOGIN_STATUS_HTML.innerHTML = `Zalogowano, brak dostępu do nazwy użytkownika!`;
        }

        LOGOUTBUTTON.style.display="block";
        
    } else {
        FORM.style.display="flex";
        LOGIN_STATUS_HTML.innerHTML = "Brak danych logowania w pamięci.";
        LOGOUTBUTTON.style.display="none";
    }

    finishLoading();
}

LOGOUTBUTTON.addEventListener("click", async _event=>{
    await window.shindenAPI.clearCookies();
    await updateLoginInfo();

});

async function handle() {
    await updateLoginInfo();
}

handle();