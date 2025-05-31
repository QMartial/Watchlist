import { Database } from "bun:sqlite";

// Définir une interface pour les options de configuration de la base de données
interface DatabaseConfig {
  filename: string;
  defaulttablename: string;
}

class Anime {
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
// Classe pour gérer les opérations de la base de données SQLite
class SQLiteDatabase<T> {
  private db: Database;
  private tablename: string;

  constructor(private config: DatabaseConfig) {
    this.db = new Database(config.filename, { create: true });
    this.tablename = config.defaulttablename;
  }

  // Méthode pour créer une table
  async createTable(p: T): Promise<void> {
    let parametreString: string[] = [];
    for (const key in p) {
      let colonne: string = key;
      colonne += " TEXT NOT NULL";
      parametreString.push(colonne);
    }
    const sql = `
            CREATE TABLE IF NOT EXISTS ${this.tablename}(
                ${parametreString.join(",\n")}
            )
                
        `;

    this.db.run(sql);
  }
  async insert(p: T): Promise<void> {
    let keysString: string[] = [];
    let valuesString: string[] = [];
    let values: any[] = [];

    for (const key in p) {
      keysString.push(key);
      valuesString.push("?");
      values.push(p[key as keyof T]);
    }

    const sql = `INSERT INTO ${this.tablename} (${keysString.join(
      ","
    )}) VALUES (${valuesString.join(",")})`;
    console.log(sql);

    await this.db.run(sql, values);
  }

  // Méthode pour sélectionner tous les utilisateurs
  async getAll(): Promise<any[]> {
    const query = this.db.query(`SELECT * FROM ${this.tablename}`);
    let results = [];
    for (const row of query.iterate()) {
      results.push(row);
    }
    return results;
  }
  async deleteMany(filter: Partial<T>) {
    let keysString: string[] = [];
    let valuesString: string[] = [];
    let conditions: any[] = [];

    for (const key in filter) {
      keysString.push(key);
      valuesString.push("?");
      conditions.push(`${key} = "${filter[key as keyof T]}"`);
    }
    const sql = `DELETE FROM ${this.tablename} WHERE ${conditions.join(
      " AND "
    )}`;
    console.log(sql);
    await this.db.run(sql);
  }
  // Méthode pour fermer la connexion à la base de données
  async close(): Promise<void> {
    await this.db.close();
  }
}

// Exemple d'utilisation de la classe
(async () => {
  const dbConfig: DatabaseConfig = {
    filename: "./mydatabase.sqlite",
    defaulttablename: "animeList",
  };

  const db = new SQLiteDatabase<Anime>(dbConfig);

  try {
    await db.createTable(new Anime());
    await db.insert(new Anime("Hajime no ippo", "sport", false));
    await db.insert(new Anime("One piece", "shonen", false));
    let animes = await db.getAll();
    console.log(animes);
    await db.deleteMany({
      name: "One piece",
    });

    animes = await db.getAll();
    console.log(animes);
  } finally {
    await db.close();
  }
})();
