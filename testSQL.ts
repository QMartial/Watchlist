import { Database } from "bun:sqlite";

// Définir une interface pour les options de configuration de la base de données
interface DatabaseConfig {
  filename: string;
}

// Classe pour gérer les opérations de la base de données SQLite
class SQLiteDatabase {
  private db: Database;

  constructor(private config: DatabaseConfig) {
    this.db = new Database(this.config.filename, { create: true });
  }

  // Méthode pour créer une table
  async createTable(): Promise<void> {
    const sql = `
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT NOT NULL UNIQUE
            )
                
        `;
    this.db.run(sql);
  }

  // Méthode pour insérer un utilisateur
  async insertUser(name: string, email: string): Promise<void> {
    const sql = `INSERT INTO users (name, email) VALUES (?, ?)`;
    await this.db.run(sql, [name, email]);
  }

  // Méthode pour sélectionner tous les utilisateurs
  async getUsers(): Promise<any[]> {
    const query = this.db.query("SELECT * FROM users");
    let results = [];
    for (const row of query.iterate()) {
      results.push(row);
    }
    return results;
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
  };

  const db = new SQLiteDatabase(dbConfig);

  try {
    await db.createTable();
    await db.insertUser("Alice", "alice@example.com");
    await db.insertUser("Bob", "bob@example.com");

    const users = await db.getUsers();
    console.log(users);
  } finally {
    await db.close();
  }
})();
