import express, { Request, Response, NextFunction } from "express";
import { auditSchema } from "./validators";
import { runAccessibilityAudit } from "./audit";

const app = express();
const port = process.env.PORT || 3000; // Port fourni par Heroku, ou 3000 en local

// Middleware pour valider l'URL avec Zod
function validateAuditRequest(req: Request, res: Response, next: NextFunction) {
  try {
    // Valide la requête avec le schéma Zod
    auditSchema.parse(req.query);
    next();
  } catch (error) {
    // Gestion des erreurs de validation
    if (error instanceof Error) {
      return res.status(400).json({ error: error.message });
    }
    next(error);
  }
}

// Route principale
app.get(
  "/audit",
  validateAuditRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { url } = req.query as { url: string }; // Type sécurisé après validation

      const results = await runAccessibilityAudit(url);

      if (results) {
        res.status(200).json(results);
      } else {
        res.status(500).json({ error: "L'audit a échoué. Vérifiez l'URL." });
      }
    } catch (error) {
      next(error);
    }
  }
);

// Lancer le serveur
app.listen(port, () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${port}`);
  console.log(
    `Exemple : http://localhost:${port}/audit?url=https://example.com`
  );
});
