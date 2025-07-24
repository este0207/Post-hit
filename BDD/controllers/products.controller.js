// controllers/product.controller.js
import { Product } from '../models/product.model.js';
import db from '../config/db.js';

const productModel = new Product(db);

export const getAllProducts = async (req, res) => {
  try {
    const products = await productModel.getAllProduct();
    if (!products || products.length === 0) return res.status(404).json("Aucun produit trouvé");
    res.json(products);
  } catch (err) {
    res.status(500).json("Erreur serveur");
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await productModel.getProductById(req.params.id);
    if (!product) return res.status(404).json("Produit non trouvé");
    res.json(product);
  } catch (err) {
    res.status(500).json("Erreur serveur");
  }
};

export const addProduct = async (req, res) => {
  try {
    const { product_name, product_desc, product_price, product_img, product_stock, product_categorie_id } = req.body;
    if (!product_name || !product_price) return res.status(400).json("Champs obligatoires manquants");

    const result = await productModel.addProduct(product_name, product_desc, product_price, product_img, product_stock, product_categorie_id);
    if (!result) return res.status(409).json("Erreur lors de l'ajout du produit");
    res.status(201).json("Produit ajouté avec succès");
  } catch (err) {
    res.status(500).json("Erreur serveur");
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { product_name, product_desc, product_price, product_img, product_stock, product_categorie_id } = req.body;

    const product = await productModel.getProductById(id);
    if (!product) return res.status(404).json("Produit non trouvé");

    const updated = await productModel.updateProduct(id, product_name, product_desc, product_price, product_img, product_stock, product_categorie_id);
    if (!updated) return res.status(409).json("Erreur lors de la mise à jour");
    res.json("Produit mis à jour avec succès");
  } catch (err) {
    res.status(500).json("Erreur serveur");
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) return res.status(400).json("ID requis");

    const product = await productModel.deleteProduct(id);
    if (!product) return res.status(404).json("Produit non trouvé");
    res.json("Produit supprimé");
  } catch (err) {
    res.status(500).json("Erreur serveur");
  }
};

export const deleteAllProducts = async (req, res) => {
  try {
    const result = await productModel.dropProductTable();
    if (!result) return res.status(409).json("Erreur lors de la suppression de la table");
    res.json("Table produits supprimée");
  } catch (err) {
    res.status(500).json("Erreur serveur");
  }
};
