import finishLoading from "./lib/finishLoading.js";
import startLoading from "./lib/startLoading.js";
import handleWindowMovement from "./lib/handleWindowMovement.js";

handleWindowMovement();

let status = false;

const APP_VERSION = await window.electronAPI.getVersion();
const RELEASE_LINK_TAG = document.querySelector("#release");
const STATUS_TAG = document.querySelector("#status");
const CHECK_UPDATES_LINK = document.querySelector("#checkUpdates");

document.querySelector("#version").innerHTML = APP_VERSION;

async function checkUpdates() {
    if(!status) {
        status = true;
        startLoading();
        await window.electronAPI.checkUpdates();
    }  
}

RELEASE_LINK_TAG.innerHTML = `https://github.com/Tsugumik/shinden-client-electron/releases/tag/v${APP_VERSION}`;
RELEASE_LINK_TAG.addEventListener("click", async event => {
    event.preventDefault();
    await window.electronAPI.openReleasePage();
});

CHECK_UPDATES_LINK.addEventListener('click', checkUpdates);

window.electronAPI.onUpdateStatusChange(async (_event, message)=>{
    STATUS_TAG.innerHTML = message;
});

window.electronAPI.onFinishLoading(async (_event, state) =>{
    if(state) {
        status = false;
    }
    finishLoading();
});

finishLoading();

await checkUpdates();