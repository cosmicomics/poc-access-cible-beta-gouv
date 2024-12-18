import { z } from "zod";

// Schéma de validation Zod pour une URL
export const auditSchema = z.object({
  url: z.string().url({ message: "L'URL fournie n'est pas valide." }),
});

// Type dérivé du schéma (automatiquement inféré)
export type AuditInput = z.infer<typeof auditSchema>;
