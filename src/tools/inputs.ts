import { z } from "zod";
export const filePath = z.string().min(1).max(4096);
export const projectInput = z.object({ project: filePath });
export const pageInput = z.object({
  url: z.url().max(4096),
  width: z.number().int().min(320).max(3840).default(1440),
  height: z.number().int().min(320).max(2160).default(900),
  waitMs: z.number().int().min(0).max(5000).default(0),
});
export const action = z.object({
  type: z.enum([
    "click",
    "fill",
    "press",
    "scroll",
    "wait",
    "expect-visible",
    "expect-text",
    "expect-count",
  ]),
  selector: z.string().max(500).optional(),
  value: z.string().max(1000).optional(),
  x: z.number().min(-2000).max(2000).optional(),
  y: z.number().min(-10000).max(10000).optional(),
  milliseconds: z.number().int().min(0).max(2000).optional(),
});
