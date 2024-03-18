import '../index.scss';
import finishLoading from './lib/finishLoading';
import handleWindowMovement from './lib/handleWindowMovement';
import startLoading from './lib/startLoading';

handleWindowMovement();

const FORM = document.querySelector("form");
const LOGIN_STATUS_HTML = document.querySelector("#loginStatus");
const LOGOUTBUTTON: HTMLButtonElement = document.querySelector("#clearCookies");
const USERIMAGE: HTMLImageElement = document.querySelector(".userImage");

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
    const LOGIN_STATUS: boolean = await window.shindenAPI.getLoginStatus();
    const EMAIL_IN: HTMLInputElement = document.querySelector("#email");
    const PASSWORD_IN: HTMLInputElement = document.querySelector("#password");
    const LOGIN_BUTTON: HTMLButtonElement = document.querySelector("#login");

    if(LOGIN_STATUS) {
        const USERNAME = await window.shindenAPI.getUserName();
        const USER_IMAGE = await window.shindenAPI.getUserProfileImage();

        if(USERIMAGE) {
            USERIMAGE.src = USER_IMAGE;
        }

        if(USERNAME) {
            LOGIN_STATUS_HTML.innerHTML = `Zalogowano jako ${USERNAME}`;
        } else {
            LOGIN_STATUS_HTML.innerHTML = `Zalogowano, brak dostępu do nazwy użytkownika!`;
        }

        LOGOUTBUTTON.disabled = false;
        EMAIL_IN.disabled = true;
        EMAIL_IN.value = "";
        PASSWORD_IN.disabled = true;
        PASSWORD_IN.value = "";
        LOGIN_BUTTON.disabled = true;
        
    } else {
        EMAIL_IN.disabled = false;
        PASSWORD_IN.disabled = false;
        LOGIN_BUTTON.disabled = false;
        LOGOUTBUTTON.disabled = true;
        LOGIN_STATUS_HTML.innerHTML = "Brak danych logowania w pamięci.";
        USERIMAGE.src="";
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