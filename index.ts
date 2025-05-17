import express, { type Request, type Response } from "express";
import bodyParser from "body-parser";
interface Liste {
  name: string;
  genre: string;
  finished: boolean;
}

// configures dotenv to work in your application
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const PORT = process.env.PORT || 3000;
let watchlist: Liste[] = [];

app.get("/", (request: Request, response: Response) => {
  response.status(200).send("muda");
});

app.get("/liste", (req: Request, res: Response) => {
  res.status(200).send(watchlist);
});

app.post("/liste", (req: Request, res: Response) => {
  try {
    const { name, genre, finished } = req.body;
    watchlist.push({ name, genre, finished });
    res.send("success");
  } catch (err) {
    res.send(err);
  }
});

app
  .listen(PORT, () => {
    console.log("Server running at PORT: ", PORT);
  })
  .on("error", (error) => {
    // gracefully handle error
    throw new Error(error.message);
  });
