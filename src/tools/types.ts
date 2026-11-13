import { z } from "zod";
export type ToolDefinition = {
  name: string;
  description: string;
  schema: z.ZodType;
  mutates?: boolean;
  execute: (input: any) => Promise<unknown>;
};
export type AddTool = (
  name: string,
  description: string,
  schema: z.ZodType,
  execute: ToolDefinition["execute"],
  mutates?: boolean,
) => void;
