class Player {
    name;
    quality;
    audioLang;
    subLang;
    onlineId;
    constructor(name, quality, audioLang, subLang, onlineId) {
        this.name = name;
        this.quality = quality;
        this.audioLang = audioLang;
        if(subLang == "" || subLang == undefined) {
            this.subLang = "Brak";
        } else {
            this.subLang = subLang;
        }
        this.onlineId = onlineId;
    }
}

module.exports = Player;