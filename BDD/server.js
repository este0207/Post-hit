// Polyfill pour Headers (nécessaire pour google-auth-library avec ES modules)
import { Headers } from 'node-fetch';
global.Headers = Headers;

import mysql from "mysql2/promise";
import { User } from "./user.model.js";
import { ProductModel } from "./product.model.js";
import { CategorieModel } from "./categorie.model.js";
import { Cart } from "./cart.model.js";
import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcrypt"
import fileUpload from "express-fileupload";
import { BestsellingModel } from "./bestselling.model.js";
import {OAuth2Client} from 'google-auth-library';
import Stripe from 'stripe';
import nodemailer from 'nodemailer'

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2022-11-15' });

if (!process.env.JWT_SECRET_KEY) {
    console.error("La clé secrète JWT n'est pas définie dans les variables d'environnement");
    process.exit(1);
}

const host = "localhost";
const PORT = 8090;
const FRONTPORT = 4200;
const YOUR_DOMAIN = `http://${host}:${FRONTPORT}`;

const GOOGLE_CLIENT_ID = "220247244335-eu66pg82ffgefo7o235tg2dateq4g4bi.apps.googleusercontent.com";
const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

async function main(){
    console.log("server listen"+host+"on port:"+PORT);
    const client = await mysql.createConnection({
        host : host,
        user : "root",
        password : "root",
        database : "posthit"
    }).catch(console.error);

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
    server.post('/create-checkout-session', async (req, res) => {
        try {
            const items = req.body.items;
            if (!items || !Array.isArray(items) || items.length === 0) {
                return res.status(400).json({ error: 'Aucun produit dans le panier.' });
            }
            const line_items = items.map(item => ({
                price_data: {
                    currency: 'eur',
                    product_data: {
                        name: item.product_name,
                        description: item.product_desc || '',
                    },
                    unit_amount: Math.round(item.product_price * 100),
                },
                quantity: item.quantity,
            }));
            const session = await stripe.checkout.sessions.create({
                line_items,
                mode: 'payment',
                success_url: `${YOUR_DOMAIN}/success`,
                cancel_url: `${YOUR_DOMAIN}/cancel`,
            });
            res.json({ url: session.url });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Erreur lors de la création de la session Stripe" });
        }
    });

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

    server.get("/bestselling",async(req,res)=>{
        try {
            const bestselling = await bestsellingModel.getAllBestselling();
            if (!bestselling || bestselling.length === 0) {
                return res.status(404).json("Aucun bestselling trouvé");
            }
            res.json(bestselling);
            console.log(`GET de ${bestselling.length} Produits de Type :`,bestselling);
        } catch (err) {
            console.error(err);
            res.status(500).json("Erreur interne lors de la récupération des bestselling");
        }
    });

    server.get("/bestselling/:id", async(req, res) => {
        const { id } = req.params;
        try {
            const bestselling = await bestsellingModel.getBestsellingById(id);
            if (bestselling) {
                res.json(bestselling);
            } else {
                res.status(404).json("bestselling non trouvé");
            }
        } catch (error) {
            res.status(500).json("Erreur lors de la récupération du bestselling");
        }
    });

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
    server.get("/products",async(req,res)=>{
        try {
            const products = await productModel.getAllProducts();
            if (!products || products.length === 0) {
                return res.status(404).json("Aucun produit trouvé");
            }
            res.json(products);
            console.log(`GET de ${products.length} Produits de Type :`,products);
        } catch (err) {
            console.error(err);
            res.status(500).json("Erreur interne lors de la récupération des produits");
        }
    });


    // GET * Produit Taille
    server.get("/get-all-product-size/",async(req,res)=>{
        try {
            const productSize = await productModel.getProductSize();
            if (!productSize) {
                return res.status(404).json("Aucune taille de produit trouvée");
            }
            res.json(productSize);
        } catch (err) {
            console.error(err);
            res.status(500).json("Erreur interne lors de la récupération des tailles");
        }
    });

    // POST Add Produit

    server.post("/add-product", async(req,res)=>{
        try {
            const { product_name, product_price, product_theme, product_desc } = req.body;
            if (!product_name || !product_price || !product_theme) {
                return res.status(400).json("Données de produit incomplètes");
            }
            const products = await productModel.addProduct(product_name, product_price, product_theme, product_desc);
            if (!products) {
                return res.status(409).json("Erreur lors de l'ajout du produit");
            }
            res.status(201).json(products);
            console.log(`Nouveau produit ajouté : nom=${product_name}, prix=${product_price}€, thème=${product_theme}, description=${product_desc}`);
        } catch (err) {
            console.error(err);
            res.status(500).json("Erreur interne lors de l'ajout du produit");
        }
    });


    // GET {id} Produit
    server.get("/product/:id", async(req, res) => {
        const { id } = req.params;
        try {
            const product = await productModel.getProductById(id);
            if (product) {
                res.json(product);
            } else {
                res.status(404).json("Produit non trouvé");
            }
        } catch (error) {
            res.status(500).json("Erreur lors de la récupération du produit");
        }
    });



    // UPDATE {id} Produit
    server.put("/update-product/:id", async(req, res) => {
        const { id } = req.params;
        const { product_name, product_price, product_theme, product_desc } = req.body;
        try {
            const product = await productModel.getProductById(id);
            if(product){
                const updatedProduct = await productModel.updateProduct(id, product_name, product_price, product_theme, product_desc);
                if(updatedProduct){
                    res.json(updatedProduct);
                }
                else{
                    res.status(409).json("Erreur lors de l'update du produit")

                }


            }else{
                res.status(404).json("Produit non trouvé")
            }
            
        } catch (error) {
            res.status(500).json("Erreur interne lors de la mise à jour du produit");
        }
    });



    // DELETE {id} Produit
    server.delete("/delete-product/:id", async(req, res) => {
        const { id } = req.params;
        try {
            const product = await productModel.getProductById(id);
            if(product){
                const deletedProduct = await productModel.deleteProduct(id);
                
                if(deletedProduct){
                    res.json("Produit supprimé avec succès");
                }else{
                    res.status(409).json("Erreur lors de la suppression du produit")
                }
            }else{
                res.status(404).json("Produit non trouvé");
                
            }
        } catch (err) {
            res.status(500).json("Erreur interne lors de la suppression du produit");
            console.error(err)
        }
    });



    // GET Produit par Recherche
    server.get("/search-products", async(req, res) => {
        const { theme, minPrice, maxPrice } = req.query;
        try {
            const products = await productModel.searchProducts(theme, minPrice, maxPrice);
            if(products){
                res.json(products);
            }
            else{
                res.status(404).json("Produit non trouvé")
            }
        } catch (error) {
            res.status(500).json("Erreur lors de la recherche des produits");
        }
    });

    // --------  Routes Utilisateurs Supplémentaires  --------- //
    // POST New User
    server.post("/signup",async(req,res)=>{
        try {
            const {username, email, password} = req.body;
            if (!username || !email || !password) {
                return res.status(400).json("Données utilisateur incomplètes");
            }
            const saltRounds = 10
            const StrongPassword = /^(?=.*?[0-9])(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[^0-9A-Za-z]).{8,16}$/; // Regex Pour password sécu
            const isStrongPassword = (password) => StrongPassword.test(password);
            if (!isStrongPassword(password)) {
                return res.status(400).json("Le mot de passe ne respecte pas les critères de sécurité");
            }
            
            const securemdp = await bcrypt.hash(password, saltRounds);
            console.log(securemdp)
            const user = await userModel.addUser(username, email, securemdp);
            if (!user) {
                return res.status(409).json("Ce nom d'utilisateur est déjà pris");
            }
            else{

                res.status(201).json("Utilisateur " + username + " créé avec succès");
            }
            
        } catch (err) {
            console.error(err);
            res.status(500).json("Erreur interne lors de la création du compte");
        }
    });

    // GET All Users
    server.get("/users", async(req,res)=>{
        try {
            const users = await userModel.getAllUser();
            if (!users || users.length === 0) {
                return res.status(404).json("Aucun utilisateur trouvé");
            }
            res.json(users);
            console.log(users);
        } catch (err) {
            console.error(err);
            res.status(500).json("Erreur interne lors de la récupération des utilisateurs");
        }
    });

    // DELETE User
    server.delete("/supp-user",async(req,res)=>{
        try {
            const {id} = req.body;
            if (!id) {
                return res.status(400).json("ID utilisateur manquant");
            }
            const user = await userModel.suppUser(id);
            if (!user) {
                return res.status(404).json("Utilisateur non trouvé");
            }
            res.json("Utilisateur supprimé avec succès");
            console.log("user id: " + id + " supprimé");
        } catch (err) {
            console.error(err);
            res.status(500).json("Erreur interne lors de la suppression de l'utilisateur");
        }
    });

    // POST Login
    server.post("/login", async(req, res) => {
        try {
            const { token, email, password } = req.body;

            // Si un token est fourni, vérifier sa validité et renvoyer l'utilisateur
            if (token && !email && !password) {
                try {
                    let decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
                    const user = await userModel.getUserById(decoded.data);
                    if (user) {
                        res.json({ 
                            message: "Connexion réussie avec token existant", 
                            user: user, 
                            token 
                        });
                    } else {
                        res.status(401).json({ message: "Utilisateur non trouvé" });
                    }
                } catch(err) {
                    res.status(401).json({ message: "Token invalide" });
                }
                return;
            }

            // Connexion normale avec email et mot de passe
            if (!email || !password) {
                return res.status(400).json("Email et mot de passe requis");
            }

            const user = await userModel.login(email, password);
            if (!user) {
                return res.status(401).json("Email ou mot de passe incorrect");
            }

            const newToken = jwt.sign({
                data: user.id
            }, process.env.JWT_SECRET_KEY, { expiresIn: '7d' });
            
            res.json({ 
                message: "Connexion réussie", 
                user: user, 
                token: newToken 
            });
        } catch (err) {
            console.error(err);
            res.status(500).json("Erreur interne lors de la connexion");
        }
    });

    // GET User by ID
    server.get("/user/:id", async(req, res) => {
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(400).json("ID utilisateur manquant");
            }
            const user = await userModel.getUserById(id);
            if (!user) {
                return res.status(404).json("Utilisateur non trouvé");
            }
            res.json(user);
        } catch (err) {
            console.error(err);
            res.status(500).json("Erreur interne lors de la récupération de l'utilisateur");
        }
    });

    // GET User by Email
    server.get("/user/email/:email", async(req, res) => {
        try {
            const { email } = req.params;
            if (!email) {
                return res.status(400).json("Email utilisateur manquant");
            }
            const user = await userModel.getUserByEmail(email);
            if (!user) {
                return res.status(404).json("Utilisateur non trouvé");
            }
            res.json(user);
        } catch (err) {
            console.error(err);
            res.status(500).json("Erreur interne lors de la récupération de l'utilisateur");
        }
    });

    // UPDATE User
    server.put("/update-user/:id", async(req, res) => {
        try {
            const { id } = req.params;
            const { username, email, password } = req.body;
            if (!id) {
                return res.status(400).json("ID utilisateur manquant");
            }
            if (!username && !email && !password) {
                return res.status(400).json("Aucune donnée à mettre à jour");
            }
            const user = await userModel.getUserById(id);
            if (!user) {
                return res.status(404).json("Utilisateur non trouvé");
            }
            const updatedUser = await userModel.updateUser(id, username, email, password);
            if (!updatedUser) {
                return res.status(409).json("Erreur lors de la mise à jour de l'utilisateur");
            }
            res.json(updatedUser);
        } catch (err) {
            console.error(err);
            res.status(500).json("Erreur interne lors de la mise à jour de l'utilisateur");
        }
    });

    // DELETE All Users
    server.delete("/drop-users-table", async(req,res)=>{
        try {
            const result = await userModel.suppAllUsers();
            if (!result) {
                return res.status(409).json("Erreur lors de la suppression de la table");
            }
            res.json("La table utilisateurs a été supprimée avec succès");
            console.log("La table utilisateurs a été supprimée");
        } catch (err) {
            console.error(err);
            res.status(500).json("Erreur interne lors de la suppression de la table");
        }
    });

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
        // Le fichier s'appelle "image" à cause du name de la balise <input>
        // <input type="file" name="image" id="image">
        const image = req.files.image;  
        
        if(image == undefined){
            res.status(400).json({msg : "No image sent by the client"})
            return;
        }
        // Je forme un nom unique pour le fichier, cette étape n'est pas obligatoire.
        const extensionFile = image.name.split(".")[1];
        const fileName = image.name.split(".")[0];
        const completeFileName = `${fileName}_${Date.now()}.${extensionFile}`;

        // J'utilise la fonction mv() pour uploader le fichier
        // dans le dossier /public du répertoire courant
        image.mv(`${__dirname}/public/${completeFileName}`);

        // Je renvoi l'url final au client
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
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.GMAIL_USER, // adresse email
                    pass: process.env.GMAIL_PASS // mot de passe d'application Gmail
                }
            });

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