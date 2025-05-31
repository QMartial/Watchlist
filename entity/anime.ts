export class Anime {
  name: string;
  genre: string;
  finished: boolean;
  constructor(
    name: string = "jojo!",
    genre: string = "JOJO!!!",
    finished: boolean = false
  ) {
    this.name = name;
    this.genre = genre;
    this.finished = finished;
  }
}
