import mysql from "mysql2/promise";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const data = `id,Product_name,Product_price,Product_theme,product_desc
75,Monkey D. Luffy Ukiyo-e,44€,Anime,"This beautiful image presents Monkey D. Luffy, the protagonist of One Piece manga and anime, rendered in a classic Japanese Ukiyo-e style."
76,Stitch Angel Cosmic Beach,44€,Disney,"Officially licensed Disney Stitch metal poster features Lilo & Stitch characters, Stitch and Angel, sitting on a beach at night, gazing up at a vibrant, star-filled sky."
77,Lil' Fella,44€,Meme,"Have you seen this lil guy? Art by Ore"
78,Arise - Eyes of The Abyss,44€,Anime,"The iconic design of Solo Leveling Eyes and ARISE line on a black minimalistic background."
79,Argentina World Cup 2022,44€,Sport,"Argentina World Cup 2022"
80,More Espresso, Less Depresso,44€,Meme,"A black cat with bright yellow eyes holds a steaming mug of coffee in its paws."
81,Porsche 911 Front,44€,Voiture,"Metal poster featuring officially licensed Porsche artwork. Celebrate the storied legacy of Porsche automotive excellence and motorsports with this Porsche 911 poster."
82,Mimic Note,44€,Fantastic,"This digital artwork titled Mimic Note captures the essence of fantasy and adventure."
83,Master Chief's Helmet,44€,Gaming,"Immerse yourself in the universe of Master Chief's Helmet, a stunning digital artwork that captures the iconic headgear from the beloved 'Halo' series."`;

async function importData() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
    });

    console.log("✓ Connecté à la base de données");

    const lines = data.trim().split("\n");
    let inserted = 0;

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      const match = line.match(/(\d+),([^,]+),([\d€]+),([^,]+),"([^"]*)"/);
      
      if (match) {
        const [, id, name, price, theme, desc] = match;
        const cleanPrice = price.replace("€", "");

        await connection.execute(
          "INSERT INTO bestselling (id, product_name, product_price, product_theme, product_desc) VALUES (?, ?, ?, ?, ?)",
          [parseInt(id), name, parseFloat(cleanPrice), theme, desc]
        );
        inserted++;
        console.log(`✓ Produit ${id} importé: ${name}`);
      }
    }

    console.log(`\n✓ ${inserted} produits importés avec succès!`);
    await connection.end();
  } catch (error) {
    console.error("✗ Erreur lors de l'import:", error.message);
    process.exit(1);
  }
}

importData();
