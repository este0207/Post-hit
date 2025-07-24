
import { Headers } from 'node-fetch';
global.Headers = Headers;

import { User } from "./models/user.model.js";
import { ProductModel } from "./product.model.js";
import { CategorieModel } from "./models/categorie.model.js";
import { Cart } from "./models/cart.model.js";
import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcrypt"
import fileUpload from "express-fileupload";
import { BestsellingModel } from "./models/bestselling.model.js";

dotenv.config();


if (!process.env.JWT_SECRET_KEY) {
    console.error("La clé secrète JWT n'est pas définie dans les variables d'environnement");
    process.exit(1);
}

const host = "localhost";
const PORT = 8090;
const FRONTPORT = 4200;
const YOUR_DOMAIN = `http://${host}:${FRONTPORT}`;


async function main(){
    console.log("server listen"+host+"on port:"+PORT);

    const userModel = new User(client);
    const productModel = new ProductModel(client);
    const bestsellingModel = new BestsellingModel(client);
    const categorieModel = new CategorieModel(client);

    const cartModel = new Cart(client);

    const server = express();
    
    server.use(cors({
        origin: true, 
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
    }));
    
    server.use(express.json())
    server.use(express.static("public"));
    server.use(fileUpload());

    server.get("/",(req,res)=>{
        res.send("Bienvenue dans l'api")
    });

    // route stripe //

    // Route spécifique pour les images

    // --------  Routes bestselling   --------- //


    // --------  Routes Categorie   --------- //


    // --------  Routes Produits Supplémentaires  --------- //


    // GET * Produits
   


    // GET * Produit Taille
   
    // POST Add Produit

   

    // GET {id} Produit

    // UPDATE {id} Produit
   
    // DELETE {id} Produit
   
    // GET Produit par Recherche
   
    // --------  Routes Utilisateurs Supplémentaires  --------- //
    // POST New User
   
    // GET All Users
   
    // DELETE User
   
    // POST Login
    
    // GET User by ID
   
    // GET User by Email
   
    // UPDATE User
   
    // DELETE All Users
    
    // --------  Cart commande  --------- //

    // GET - Récupérer le panier d'un utilisateur
    
    // POST - Ajouter un produit au panier
   
    // DELETE - Supprimer un produit du panier
   
    // PUT - Mettre à jour la quantité d'un produit
   
    // DELETE - Vider le panier d'un utilisateur
   
    // --------  Upload de fichiers  --------- //
    
    server.post("/upload", async (req,res)=>{
        console.log(req.files)
        const image = req.files.image;  
        
        if(image == undefined){
            res.status(400).json({msg : "No image sent by the client"})
            return;
        }

        const extensionFile = image.name.split(".")[1];
        const fileName = image.name.split(".")[0];
        const completeFileName = `${fileName}_${Date.now()}.${extensionFile}`;

        image.mv(`${__dirname}/public/${completeFileName}`);


        res.json({url : `http://${host}:${PORT}/${completeFileName}`});
    });

    // --------  Authentification Google --------- //
    
    // --------- envoie de mail pour confiramtion de rejister ---------- //

    server.post("/send-mail", async (req,res) => {
        try {
            const { email } = req.body;
            if (!email) {
                return res.status(400).json({ message: "Email utilisateur manquant" });
            }

            const info = await transporter.sendMail({
                from: 'pyxis0207@gmail.com',
                to: email,
                subject: "Post'hit Register",
                text: "Thank for register to Post'hit, for start to shopping click here"+"http://localhost:4200/",
                html: `<p><strong>Thank you for registering with Post'hit!</strong></p>
                <p>We're excited to have you on board. To start exploring and shopping, simply click the link below:</p>
                <p><a href="${host}:${FRONTPORT}" target="_blank" style="font-weight:bold; color:#007BFF;">Start Shopping on Post'hit</a></p>
                <hr>
                <p style="color:gray;"><em>This is an automated message. Please do not reply to this email.</em></p>
                `
            });

            console.log("Message sent:", info.messageId);
            res.json({ message: "Email envoyé avec succès" });
        } catch(error) {
            console.error(error);
            res.status(500).json({ message: "Erreur lors de l'envoi de l'email" });
        }
    });

    // --------- envoie de mail depuis le formulaire de contact ---------- //
    server.post("/send-mail-contact", async (req, res) => {
        try {
            const { email, message } = req.body;
            if (!email || !message) {
                return res.status(400).json({ message: "Email et message requis" });
            }
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.GMAIL_USER,
                    pass: process.env.GMAIL_PASS
                }
            });
            const info = await transporter.sendMail({
                from: email,
                to: process.env.GMAIL_USER, // L'adresse de contact de l'entreprise
                subject: "Nouveau message de contact Post'hit",
                text: message,
                html: `<p><strong>Message de :</strong> ${email}</p><p>${message.replace(/\n/g, '<br>')}</p>`
            });
            console.log("Contact message sent:", info.messageId);
            res.json({ message: "Message de contact envoyé avec succès" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Erreur lors de l'envoi du message de contact" });
        }
    });

    // --------  Server listen  --------- //
    server.listen(PORT, ()=>{
        console.log("server listen on "+host+":"+PORT)
    })

}
main();