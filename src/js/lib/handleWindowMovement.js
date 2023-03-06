export default function handleWindowMovement() {
    document.onreadystatechange = async () => {
        if(document.readyState == "complete") {
            document.querySelector("#min").addEventListener("click", async () => {
                await window.shindenAPI.min();
            });
            
            document.querySelector("#close").addEventListener("click", async () => {
                await window.shindenAPI.close();
            });
        }
    }
}
