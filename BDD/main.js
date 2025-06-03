import mysql from "mysql2/promise";
import { User } from "./user.model.js";
import { ProductModel } from "./product.model.js";
import express from "express";
import cors from "cors";

const host = "localhost";
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


    const server = express();
    server.use(cors(), express.json());

    server.get("/",(req,res)=>{
        res.end("Bienvenue dans l'api")
    });


    // --------  Routes Produits Supplémentaires  --------- //
    //voir tous les produit
    server.get("/products",async(req,res)=>{
        const products = await productModel.getAllProducts();
        res.json(products)
        console.log(products)
    })

    //ajouter un produit
    server.post("/add-product", async(req,res)=>{
        const {product_name,product_price,product_theme,product_desc} = req.body;
        const products = await productModel.addProduct(product_name,product_price,product_theme,product_desc);
        res.json(products)
        console.log("New product add name: "+product_name+" price: "+product_price+"€"+" theme : "+product_theme+" product_desc : "+ product_desc)
    })

    // acceder a un produit en fonction de sont id
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

    // changer un produit en fonction de sont id
    server.put("/update-product/:id", async(req, res) => {
        const { id } = req.params;
        const { product_name, product_price, product_theme, product_desc } = req.body;
        try {
            const updatedProduct = await productModel.updateProduct(id, product_name, product_price, product_theme, product_desc);
            res.json(updatedProduct);
        } catch (error) {
            res.status(500).json("Erreur lors de la mise à jour du produit");
        }
    });

    // supprimer un produit en fonction de sont id
    server.delete("/delete-product/:id", async(req, res) => {
        const { id } = req.params;
        try {
            await productModel.deleteProduct(id);
            res.json("Produit supprimé avec succès");
        } catch (error) {
            res.status(500).json("Erreur lors de la suppression du produit");
        }
    });

    // rechercher un produit
    server.get("/search-products", async(req, res) => {
        const { theme, minPrice, maxPrice } = req.query;
        try {
            const products = await productModel.searchProducts(theme, minPrice, maxPrice);
            res.json(products);
        } catch (error) {
            res.status(500).json("Erreur lors de la recherche des produits");
        }
    });

    // --------  Routes Utilisateurs Supplémentaires  --------- //
    // crée un compte
    server.post("/signup",async(req,res)=>{
        const {username,email,password} = req.body;
        const StrongPassword = /^(?=.*?[0-9])(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[^0-9A-Za-z]).{8,16}$/;
        const isStrongPassword = (password) => StrongPassword.test(password);
        if (isStrongPassword(password)) {
         try {
            const user = await userModel.addUser(username,email,password);
            res.json("User "+username+" add !");
         } catch (error) {
            res.json("Ce nom d'utilisateur est déjà pris");
         }
        }else{
         console.log("MDP incorrect");
         res.json("MDP incorrect")  ; 
        }
    });

    // voir tous les users
    server.get("/users", async(req,res)=>{
        const users = await userModel.getAllUser();
        res.json(users)
        console.log(users)
    });

    //supprimer un user avec son id
    server.delete("/supp-user",async(req,res)=>{
        const {id} = req.body;
        const user = await userModel.suppUser(id);
        res.json(user);
        console.log("user id: "+id+" supprimer");
    });

    // se connecter au compte user crée avec signup
    server.post("/login", async(req, res) => {
        const { email, password } = req.body;
        try {
            const user = await userModel.login(email, password);
            if (user) {
                res.json({ message: "Connexion réussie", user });
            } else {
                res.status(401).json("Email ou mot de passe incorrect");
            }
        } catch (error) {
            res.status(500).json("Erreur lors de la connexion");
        }
    });

    // acceder au user en fonction de son id
    server.get("/user/:id", async(req, res) => {
        const { id } = req.params;
        try {
            const user = await userModel.getUserById(id);
            if (user) {
                res.json(user);
            } else {
                res.status(404).json("Utilisateur non trouvé");
            }
        } catch (error) {
            res.status(500).json("Erreur lors de la récupération de l'utilisateur");
        }
    });

    // changer les valeurs d'un user en fonction de son id
    server.put("/update-user/:id", async(req, res) => {
        const { id } = req.params;
        const { username, email } = req.body;
        try {
            const updatedUser = await userModel.updateUser(id, username, email);
            res.json(updatedUser);
        } catch (error) {
            res.status(500).json("Erreur lors de la mise à jour de l'utilisateur");
        }
    });

    // supprimer tous les users
    server.delete("/drop-users-table", async(req,res)=>{
        const result = await userModel.suppAllUsers();
        res.json("La table user a été supprimée");
        console.log("La table user a été supprimée");
    });

    // --------  Server listen  --------- //
    server.listen(PORT, ()=>{
        console.log("server listen on "+host+":"+PORT)
    })

}
main();