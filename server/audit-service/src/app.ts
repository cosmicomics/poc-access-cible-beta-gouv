import express, { Request, Response, NextFunction } from "express";
import { auditSchema } from "./validators";
import { runAccessibilityAudit } from "./audit";

const app = express();
const port = process.env.PORT || 3000;

// Middleware to validate the URL with Zod
function validateAuditRequest(req: Request, res: Response, next: NextFunction) {
  try {
    // Validate request with Zod
    auditSchema.parse(req.query);
    next();
  } catch (error) {
    // Handle validation errors
    if (error instanceof Error) {
      return res.status(400).json({ error: error.message });
    }
    next(error);
  }
}

// Main route
app.get(
  "/audit",
  validateAuditRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { url } = req.query as { url: string };

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

// Run the server
app.listen(port, () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${port}`);
  console.log(
    `Exemple : http://localhost:${port}/audit?url=https://example.com`
  );
});
