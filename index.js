
import express from "express";
import cors from "cors";
import { OAuth2Client } from "google-auth-library";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID; // Mettre dans Render
const client = new OAuth2Client(CLIENT_ID);

// Endpoint pour vérifier le token côté serveur
app.post("/verify-token", async (req, res) => {
  const { token } = req.body;

  if (!token) return res.status(400).json({ error: "Token requis" });

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID
    });

    const payload = ticket.getPayload();
    res.json({ success: true, user: payload });
  } catch (err) {
    console.error("❌ Erreur OAuth :", err);
    res.status(401).json({ success: false, error: "Token invalide" });
  }
});

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log(`🔑 Serveur Google OAuth en marche sur le port ${PORT}`);
});
