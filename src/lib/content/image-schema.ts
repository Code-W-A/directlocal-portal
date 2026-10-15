import { z } from "zod";
export const imageSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/), basename: z.string().regex(/^[a-z0-9-]+$/),
  photoId: z.number().int().positive(), author: z.string().trim().min(1),
  sourceUrl: z.url({ protocol: /^https$/ }), licenseUrl: z.url({ protocol: /^https$/ }),
  checkedAt: z.iso.date(), alt: z.string().trim().min(1), illustrative: z.literal(true),
  widths: z.array(z.number().int().positive()).min(1), width: z.number().int().positive(), height: z.number().int().positive(),
}).strict();
