import { z } from "zod";

// Zod validation scheme for an URL
export const auditSchema = z.object({
  url: z.string().url({ message: "L'URL fournie n'est pas valide." }),
});

// Type derived from scheme (automatically inferred)
export type AuditInput = z.infer<typeof auditSchema>;
