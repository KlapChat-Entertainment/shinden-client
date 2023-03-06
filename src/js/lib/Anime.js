export default class Anime {
    name;
    linkToSeries;
    imageLink;
    animeType;
    rating;
    episodes;
    description;
    constructor(name, linkToSeries, imageLink, animeType, rating, episodes, description) {
        this.name = name;
        this.linkToSeries = linkToSeries;
        this.imageLink = imageLink;
        this.animeType = animeType;
        this.rating = rating;
        this.episodes = episodes;
        this.description = description;
    }
}