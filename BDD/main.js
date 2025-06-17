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

dotenv.config();

if (!process.env.JWT_SECRET_KEY) {
    console.error("La clé secrète JWT n'est pas définie dans les variables d'environnement");
    process.exit(1);
}

const host = "0.0.0.0";
const PORT = "8090";

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
    const categorieModel = new CategorieModel(client);

    // const cartModel = new Cart(client);

    const server = express();
    
    // Configuration CORS
    // const corsOptions = {
    //     origin: ['*'], 
    //     credentials: false, 
    //     methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    //     allowedHeaders: ['Content-Type', 'Authorization']
    // };
    
    server.use(cors());
    server.use(express.json());

    server.get("/",(req,res)=>{
        res.send("Bienvenue dans l'api")
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

            if (!email || !password) {
                return res.status(400).json("Email et mot de passe requis");
            }

            const user = await userModel.login(email, password);
            if (!user) {
                return res.status(401).json("Email ou mot de passe incorrect");
            }

            if (!token) {
                const token = jwt.sign({
                    data: user.id
                }, process.env.JWT_SECRET_KEY, { expiresIn: '7d' });
                
                res.json({ 
                    message: "Connexion réussie", 
                    user: user, 
                    token 
                });
            } else {
                try {
                    let decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
                    console.log(decoded);
                    res.json({message: "Connexion réussie avec token existant"});
                } catch(err) {
                    res.status(401).json({ message: "Token invalide" });
                }
            }
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
            const { username, email } = req.body;
            if (!id) {
                return res.status(400).json("ID utilisateur manquant");
            }
            if (!username && !email) {
                return res.status(400).json("Aucune donnée à mettre à jour");
            }
            const user = await userModel.getUserById(id);
            if (!user) {
                return res.status(404).json("Utilisateur non trouvé");
            }
            const updatedUser = await userModel.updateUser(id, username, email);
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

    server.get("/get-cart", async(req,res)=>{
        try {
            const result = await cartModel.getCart();
            if (!result) {
                return res.status(404).json("Panier non trouvé");
            }
            console.log(result);
            res.json(result);
        } catch (err) {
            console.error(err);
            res.status(500).json("Erreur interne lors de la récupération du panier");
        }
    });

    // --------  Server listen  --------- //
    server.listen(PORT, ()=>{
        console.log("server listen on "+host+":"+PORT)
    })

}
main();