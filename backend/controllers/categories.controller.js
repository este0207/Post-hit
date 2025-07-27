
import { CategorieModel } from '../models/categorie.model.js';
import db from '../config/db.js';

const categoriesModel = new CategorieModel(db);

export const getAllCategories = async (req, res) => {
  try {
    const categories = await categoriesModel.getAllCategorie();
    if (!categories || categories.length === 0) {
      return res.status(404).json("Aucune catégorie trouvée");
    }
    console.log(`GET de ${categories.length} catégories :`, categories);
    res.json(categories);
  } catch (err) {
    console.error(err);
    res.status(500).json("Erreur interne lors de la récupération des catégories");
  }
};

export const addCategorie = async (req, res) => {
  const { categorie_name } = req.body;
  if (!categorie_name) {
    return res.status(400).json("Données de la catégorie incomplètes");
  }

  try {
    const categorie = await categoriesModel.addCategorie(categorie_name);
    if (!categorie) {
      return res.status(409).json("Erreur lors de l'ajout de la catégorie");
    }
    console.log(`Nouvelle catégorie ajoutée : nom = ${categorie_name}`);
    res.status(201).json(categorie);
  } catch (err) {
    console.error(err);
    res.status(500).json("Erreur interne lors de l'ajout de la catégorie");
  }
};
