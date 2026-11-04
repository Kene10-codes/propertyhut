import "dotenv/config";
import { z } from "zod";

const schema = z.object({
  NODE_ENV: z.string().default("development"),
  ACCESS_TOKEN_SECRET: z.string().min(64),
  REFRESH_TOKEN_SECRET: z.string().min(64),
  ACCESS_TOKEN_EXPIRES: z.string().default("15"),
  BCRYPT_SALT_ROUNDS: z.coerce.number().default(12),
  REFRESH_TOKEN_EXPIRES_DAYS: z.coerce.number().default(7),
  PORT: z.coerce.number().default(3100),
  CLIENT_URL: z.string().default("http://localhost:5173"),
  MONGODB_URI: z.string(),
});

export const env = schema.parse(process.env);
