import jwt from 'jsonwebtoken';
import { googleClient, GOOGLE_CLIENT_ID } from '../config/google-auth.js'; 
import { userModel } from '../models/user.model.js';

export const googleLogin = async (req, res) => {
  const { credential } = req.body;
  if (!credential) {
    return res.status(400).json({ message: "Token Google manquant" });
  }

  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const email = payload.email;
    const username = payload.name;

    let user = await userModel.getUserByEmail(email);
    if (!user) {
      await userModel.addUser(username, email, "GOOGLE_ACCOUNT");
      user = await userModel.getUserByEmail(email);
    }

    const token = jwt.sign({ data: user.id }, process.env.JWT_SECRET_KEY, { expiresIn: '7d' });
    res.json({ message: "Connexion Google réussie", user, token });
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: "Token Google invalide" });
  }
};
