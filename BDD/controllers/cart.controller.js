import { Cart } from '../models/cart.model.js';
import db from '../config/db.js';

const cartModel = new Cart(db);

export const getCart = async (req, res) => {
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
};

export const addToCart = async (req, res) => {
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
};

export const removeFromCart = async (req, res) => {
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
};

export const updateQuantity = async (req, res) => {
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
};

export const clearCart = async (req, res) => {
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
};
