
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/user.model.js';
import db from '../config/db.js';

const userModel = new UserModel(db);

const StrongPassword = /^(?=.*?[0-9])(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[^0-9A-Za-z]).{8,16}$/;

export const getAllUsers = async (req, res) => {
  try {
    const users = await userModel.getAllUser();
    if (!users || users.length === 0) return res.status(404).json("Aucun utilisateur trouvé");
    res.json(users);
  } catch (err) {
    res.status(500).json("Erreur interne lors de la récupération des utilisateurs");
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await userModel.getUserById(req.params.id);
    if (!user) return res.status(404).json("Utilisateur non trouvé");
    res.json(user);
  } catch (err) {
    res.status(500).json("Erreur serveur");
  }
};

export const getUserByEmail = async (req, res) => {
  try {
    const user = await userModel.getUserByEmail(req.params.email);
    if (!user) return res.status(404).json("Utilisateur non trouvé");
    res.json(user);
  } catch (err) {
    res.status(500).json("Erreur serveur");
  }
};

export const signUp = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) return res.status(400).json("Champs manquants");
    if (!StrongPassword.test(password)) return res.status(400).json("Mot de passe non sécurisé");

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await userModel.addUser(username, email, hashedPassword);
    if (!user) return res.status(409).json("Nom d'utilisateur déjà pris");
    res.status(201).json(`Utilisateur ${username} créé avec succès`);
  } catch (err) {
    res.status(500).json("Erreur serveur");
  }
};

export const login = async (req, res) => {
  try {
    const { token, email, password } = req.body;

    if (token && !email && !password) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const user = await userModel.getUserById(decoded.data);
        if (!user) return res.status(401).json({ message: "Utilisateur non trouvé" });
        return res.json({ message: "Connexion réussie avec token", user, token });
      } catch (err) {
        return res.status(401).json({ message: "Token invalide" });
      }
    }

    if (!email || !password) return res.status(400).json("Email et mot de passe requis");

    const user = await userModel.login(email, password);
    if (!user) return res.status(401).json("Email ou mot de passe incorrect");

    const newToken = jwt.sign({ data: user.id }, process.env.JWT_SECRET_KEY, { expiresIn: '7d' });
    res.json({ message: "Connexion réussie", user, token: newToken });
  } catch (err) {
    res.status(500).json("Erreur serveur");
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, password } = req.body;
    if (!id) return res.status(400).json("ID manquant");

    const user = await userModel.getUserById(id);
    if (!user) return res.status(404).json("Utilisateur non trouvé");

    const updatedUser = await userModel.updateUser(id, username, email, password);
    if (!updatedUser) return res.status(409).json("Erreur de mise à jour");
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json("Erreur serveur");
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) return res.status(400).json("ID requis");
    const user = await userModel.suppUser(id);
    if (!user) return res.status(404).json("Utilisateur non trouvé");
    res.json("Utilisateur supprimé");
  } catch (err) {
    res.status(500).json("Erreur serveur");
  }
};

// export const deleteAllUsers = async (req, res) => {
//   try {
//     const result = await userModel.suppAllUsers();
//     if (!result) return res.status(409).json("Erreur suppression table");
//     res.json("Table utilisateurs supprimée");
//   } catch (err) {
//     res.status(500).json("Erreur serveur");
//   }
// };
