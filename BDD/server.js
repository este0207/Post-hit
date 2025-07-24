
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
    server.get("/images/:filename", (req, res) => {
        const filename = req.params.filename;
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        res.setHeader('Cache-Control', 'public, max-age=31536000');
        res.sendFile(`./public/${filename}`, { root: '.' });
    });

    // --------  Routes bestselling   --------- //


    // --------  Routes Categorie   --------- //

    server.get("/categories", async(req,res)=>{
        try{
            const categorie = await categorieModel.getAllCategorie();
            if (!categorie || categorie.length === 0) {
                return res.status(404).json("Aucune categorie trouvé");
            }
            res.json(categorie);
            console.log(`GET de ${categorie.length} categorie de Type :`,categorie);
        }
        catch(err){
            console.error(err);
            res.status(500).json("Erreur interne lors de la récupération des produits");
        }
    });

    server.post("/add-categorie", async(req,res)=>{
        try {
            const { categorie_name } = req.body;
            if (!categorie_name) {
                return res.status(400).json("Données de la categorie incomplètes");
            }
            const categorie = await categorieModel.addCategorie(categorie_name);
            if (!categorie) {
                return res.status(409).json("Erreur lors de l'ajout de la categorie");
            }
            res.status(201).json(categorie);
            console.log(`Nouvelle categorie ajouté : nom= ${categorie_name}`);
        } catch (err) {
            console.error(err);
            res.status(500).json("Erreur interne lors de l'ajout de la categorie");
        }
    });

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
    server.get("/cart/:userId", async(req,res)=>{
        try {
            const { userId } = req.params;
            const result = await cartModel.getCart(userId);
            if (!result) {
                return res.status(404).json("Panier non trouvé");
            }
            console.log(`Panier récupéré pour l'utilisateur ${userId}:`, result);
            res.json(result);
        } catch (err) {
            console.error(err);
            res.status(500).json("Erreur interne lors de la récupération du panier");
        }
    });

    // POST - Ajouter un produit au panier
    server.post("/cart/add", async(req,res)=>{
        try {
            const { userId, productId, quantity = 1 } = req.body;
            
            if (!userId || !productId) {
                return res.status(400).json("userId et productId sont requis");
            }

            const result = await cartModel.addToCart(userId, productId, quantity);
            console.log(`Produit ${productId} ajouté au panier de l'utilisateur ${userId}`);
            res.status(201).json(result);
        } catch (err) {
            console.error(err);
            res.status(500).json("Erreur interne lors de l'ajout au panier");
        }
    });

    // DELETE - Supprimer un produit du panier
    server.delete("/cart/remove", async(req,res)=>{
        try {
            const { userId, productId } = req.body;
            
            if (!userId || !productId) {
                return res.status(400).json("userId et productId sont requis");
            }

            const result = await cartModel.removeFromCart(userId, productId);
            console.log(`Produit ${productId} supprimé du panier de l'utilisateur ${userId}`);
            res.json(result);
        } catch (err) {
            console.error(err);
            res.status(500).json("Erreur interne lors de la suppression du panier");
        }
    });

    // PUT - Mettre à jour la quantité d'un produit
    server.put("/cart/update-quantity", async(req,res)=>{
        try {
            const { userId, productId, quantity } = req.body;
            
            if (!userId || !productId || quantity === undefined) {
                return res.status(400).json("userId, productId et quantity sont requis");
            }

            const result = await cartModel.updateQuantity(userId, productId, quantity);
            console.log(`Quantité du produit ${productId} mise à jour pour l'utilisateur ${userId}: ${quantity}`);
            res.json(result);
        } catch (err) {
            console.error(err);
            res.status(500).json("Erreur interne lors de la mise à jour de la quantité");
        }
    });

    // DELETE - Vider le panier d'un utilisateur
    server.delete("/cart/clear/:userId", async(req,res)=>{
        try {
            const { userId } = req.params;
            
            if (!userId) {
                return res.status(400).json("userId est requis");
            }

            const result = await cartModel.clearCart(userId);
            console.log(`Panier vidé pour l'utilisateur ${userId}`);
            res.json(result);
        } catch (err) {
            console.error(err);
            res.status(500).json("Erreur interne lors du vidage du panier");
        }
    });

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
    server.post("/google-login", async (req, res) => {
        const { credential } = req.body;
        if (!credential) {
            return res.status(400).json({ message: "Token Google manquant" });
        }
        try {
            const ticket = await googleClient.verifyIdToken({
                idToken: credential,
                audience: GOOGLE_CLIENT_ID
            });
            const payload = ticket.getPayload();
            // payload contient : email, name, picture, sub (id Google)
            const email = payload.email;
            const username = payload.name;
            // Vérifier si l'utilisateur existe déjà
            let user = await userModel.getUserByEmail(email);
            if (!user) {
                // Créer un nouvel utilisateur (mot de passe vide ou spécial)
                await userModel.addUser(username, email, "GOOGLE_ACCOUNT");
                user = await userModel.getUserByEmail(email);
            }
            // Générer un JWT local pour la session
            const token = jwt.sign({ data: user.id }, process.env.JWT_SECRET_KEY, { expiresIn: '7d' });
            res.json({ message: "Connexion Google réussie", user, token });
        } catch (err) {
            console.error(err);
            res.status(401).json({ message: "Token Google invalide" });
        }
    });

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