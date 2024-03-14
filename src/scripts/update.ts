import { IpcRendererEvent } from 'electron';
import '../index.scss';
import finishLoading from './lib/finishLoading';
import handleWindowMovement from './lib/handleWindowMovement';
import startLoading from './lib/startLoading';

handleWindowMovement();

let status = false;


async function checkUpdates() {
    if(!status) {
        status = true;
        startLoading();
        await window.electronAPI.checkUpdates();
    }  
}

async function handle() {
    const APP_VERSION = await window.electronAPI.getVersion();
    const RELEASE_LINK_TAG = document.querySelector("#release");
    const STATUS_TAG = document.querySelector("#status");
    const CHECK_UPDATES_LINK = document.querySelector("#checkUpdates");
    document.querySelector("#version").innerHTML = APP_VERSION;

    RELEASE_LINK_TAG.innerHTML = `https://github.com/Tsugumik/shinden-client/releases/tag/v${APP_VERSION}`;
    RELEASE_LINK_TAG.addEventListener("click", async event => {
        event.preventDefault();
        await window.electronAPI.openReleasePage();
    });

    CHECK_UPDATES_LINK.addEventListener('click', checkUpdates);

    window.electronAPI.onUpdateStatusChange(async (_event: IpcRendererEvent, message: string)=>{
        STATUS_TAG.innerHTML = message;
    });

    window.electronAPI.onFinishLoading(async (_event: IpcRendererEvent, state: string) =>{
        if(state) {
            status = false;
        }
        finishLoading();
    });

    finishLoading();
}

handle();

checkUpdates();