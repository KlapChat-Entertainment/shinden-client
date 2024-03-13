export default class Episode {
    name: string;
    link: string;
    constructor(_name: string, _link: string) {
        if(_name.replace(" ", "") =="") {
            this.name = "Brak nazwy odcinka";
        } else {
            this.name = _name;
        }
        
        this.link = _link;
    }
}