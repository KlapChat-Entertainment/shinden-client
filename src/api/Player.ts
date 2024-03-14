export default class Player {
    name: string;
    quality: string;
    audioLang: string;
    subLang: string | undefined;
    onlineId: string;
    constructor(_name: string, _quality: string, _audioLang: string, _subLang: string, _onlineId: string) {
        this.name = _name;
        this.quality = _quality;
        this.audioLang = _audioLang;
        if(_subLang == "" || _subLang == undefined) {
            this.subLang = "Brak";
        } else {
            this.subLang = _subLang;
        }
        this.onlineId = _onlineId;
    }
}