import mysql from "mysql2/promise";
import dotenv from 'dotenv';
dotenv.config();

async function connectToDB() {
    try {
      const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
      });
      console.log("Connexion à la base MySQL réussie");
      return connection;
    } catch (error) {
      console.error("Erreur de connexion à la base de données:", error);
      throw error; 
    }
  }
  
  const client = await connectToDB();
  
  export default client;