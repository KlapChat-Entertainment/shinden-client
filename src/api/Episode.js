class Episode {
    name;
    link;
    constructor(name, link) {
        if(name.replace(" ", "") =="") {
            this.name = "Brak nazwy odcinka";
        } else {
            this.name = name;
        }
        
        this.link = link;
    }
}

module.exports = Episode;