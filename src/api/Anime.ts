import Episode from "./Episode";

export default class Anime {
    name: string;
    linkToSeries: string;
    imageLink: string;
    animeType: string;
    rating: string;
    episodesCount: string;
    description: string;
    episodes: Array<Episode>;
    constructor(_name: string, _linkToSeries: string, _imageLink: string, _animeType: string, _rating: string, _episodesCount: string, _description: string) {
        this.name = _name;
        this.linkToSeries = _linkToSeries;
        this.imageLink = _imageLink;
        this.animeType = _animeType;
        this.rating = _rating;
        this.episodesCount = _episodesCount;
        this.description = _description;
        this.episodes = [];
    }
}