import express, { type Request, type Response } from "express";
import bodyParser from "body-parser";
import { Anime } from "./entity/anime";
import { SQLiteService } from "./service/database/SQLite_service";
const db = new SQLiteService({
  filename: "MyAnime.sqlite",
  defaulttablename: "AnimeList",
});
// configures dotenv to work in your application
const serv = express();
serv.use(bodyParser.json());
serv.use(bodyParser.urlencoded({ extended: true }));
const PORT = process.env.PORT || 3000;

serv.get("/", (request: Request, response: Response) => {
  response.status(200).send("muda");
});

serv.get("/anime", async (req: Request, res: Response) => {
  try {
    await db.createTable(new Anime());
    const watchlist = await db.getAll();
    res.status(200).send(watchlist);
  } catch (err) {
    console.error(err);
    res.send(err);
  }
});

serv.post("/anime", async (req: Request, res: Response) => {
  try {
    await db.createTable(new Anime());
    const { name, genre, finished } = req.body;
    db.insert({ name, genre, finished });
    res.send("success");
  } catch (err) {
    console.error(err);
    res.send(err);
  }
});

serv.post("/deleteAnime", async (req: Request, res: Response) => {
  try {
    await db.createTable(new Anime());
    const { name, genre, finished } = req.body;
    db.deleteMany({ name, genre, finished });
    res.send("success");
  } catch (err) {
    console.error(err);
    res.send(err);
  }
});
serv
  .listen(PORT, () => {
    console.log("Server running at PORT: ", PORT);
  })
  .on("error", (error) => {
    // gracefully handle error
    throw new Error(error.message);
  })
  .on("close", () => {
    db.close();
  });
