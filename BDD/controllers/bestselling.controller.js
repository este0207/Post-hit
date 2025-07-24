
import { BestsellingModel } from '../models/bestselling.model.js';
import db from '../config/db.js';

const bestsellingModel = new BestsellingModel(db);

export const getAllBestselling = async (req, res) => {
  try {
    const bestselling = await bestsellingModel.getAllBestselling();
    if (!bestselling || bestselling.length === 0) {
      return res.status(404).json("Aucun bestselling trouvé");
    }
    console.log(`GET de ${bestselling.length} Produits de Type :`, bestselling);
    res.json(bestselling);
  } catch (err) {
    console.error(err);
    res.status(500).json("Erreur interne lors de la récupération des bestselling");
  }
};

export const getBestsellingById = async (req, res) => {
  const { id } = req.params;
  try {
    const bestselling = await bestsellingModel.getBestsellingById(id);
    if (bestselling) {
      res.json(bestselling);
    } else {
      res.status(404).json("Bestselling non trouvé");
    }
  } catch (err) {
    console.error(err);
    res.status(500).json("Erreur lors de la récupération du bestselling");
  }
};
