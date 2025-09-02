import express from "express";
import cors from "cors";
import session from "express-session";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

const app = express();
const PORT = process.env.PORT || 3000;

// 👉 Mets tes vraies infos Google dans Render Variables d'environnement
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

// Middleware
app.use(cors({
  origin: [
    "http://localhost:3000",
    "http://127.0.0.1:5173",
    "exp://127.0.0.1:19000",
    "gamerhubxgoat://redirect"
  ],
  credentials: true
}));

app.use(session({ 
  secret: "super_secret_key", 
  resave: false, 
  saveUninitialized: true 
}));
app.use(passport.initialize());
app.use(passport.session());

// Config Passport
passport.use(new GoogleStrategy({
  clientID: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  callbackURL: "/auth/google/callback"
}, (accessToken, refreshToken, profile, done) => {
  // Ici tu gères ton utilisateur (sauvegarde DB si nécessaire)
  return done(null, { profile, accessToken });
}));

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

// Route pour démarrer OAuth Google
app.get("/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Callback après Google
app.get("/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    res.json({
      message: "Authentification réussie ✅",
      user: req.user
    });
  }
);

// Route test login
app.get("/", (req, res) => res.send("Serveur OAuth Google GamerHubX GOAT en marche 🚀"));

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
