export default async function handleAutoLogin() {
    if(localStorage.getItem("SHINDEN.PL_COOKIES")) {
        await window.shindenAPI.setCookies(JSON.parse(localStorage.getItem("SHINDEN.PL_COOKIES")));
    }
}