
import nodemailer from 'nodemailer';

const host = process.env.HOST || 'http://localhost';
const FRONTPORT = process.env.FRONT_PORT || 4200;

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

export const sendWelcomeMail = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email utilisateur manquant" });
    }

    const info = await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: email,
      subject: "Post'hit Register",
      text: "Thank for register to Post'hit, for start to shopping click here http://localhost:4200/",
      html: `
        <p><strong>Thank you for registering with Post'hit!</strong></p>
        <p>We're excited to have you on board. To start exploring and shopping, simply click the link below:</p>
        <p><a href="${host}:${FRONTPORT}" target="_blank" style="font-weight:bold; color:#007BFF;">Start Shopping on Post'hit</a></p>
        <hr>
        <p style="color:gray;"><em>This is an automated message. Please do not reply to this email.</em></p>
      `
    });

    console.log("Message sent:", info.messageId);
    res.json({ message: "Email envoyé avec succès" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de l'envoi de l'email" });
  }
};

export const sendContactMail = async (req, res) => {
  try {
    const { email, message } = req.body;
    if (!email || !message) {
      return res.status(400).json({ message: "Email et message requis" });
    }

    const info = await transporter.sendMail({
      from: email,
      to: process.env.GMAIL_USER,
      subject: "Nouveau message de contact Post'hit",
      text: message,
      html: `<p><strong>Message de :</strong> ${email}</p><p>${message.replace(/\n/g, '<br>')}</p>`,
    });

    console.log("Contact message sent:", info.messageId);
    res.json({ message: "Message de contact envoyé avec succès" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de l'envoi du message de contact" });
  }
};
