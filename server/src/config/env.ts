import "dotenv/config";
import { z } from "zod";

const schema = z.object({
  NODE_ENV: z.string().default("development"),
  JWT_SECRET: z.string().min(32),
  JWT_EXPIRES_IN: z.string().default("7d"),
  PORT: z.coerce.number().default(3100),
  CLIENT_URL: z.string().default("http://localhost:5173"),
  MONGODB_URI: z.string(),
});

export const env = schema.parse(process.env);
