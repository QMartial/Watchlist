import { Database } from "bun:sqlite";
// Définir une interface pour les options de configuration de la base de données
interface DatabaseConfig {
  filename: string;
  defaulttablename: string;
}

export class SQLiteService<T> {
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
      if (!filter[key as keyof T]) {
        continue;
      }
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
