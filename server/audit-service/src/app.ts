import express, { Request, Response, NextFunction } from "express";
import { auditSchema } from "./validators";
import { runAccessibilityAudit } from "./audit";

const app = express();
const PORT = 3000;

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
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
  console.log("Exemple : http://localhost:3000/audit?url=https://example.com");
});
