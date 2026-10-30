// @ts-ignore
import jwt from "jsonwebtoken";
import { User } from "../model/User.js";
import { env } from "../config/env.js";


type Role = "user" | "admin" | "agent";
type Status = "approved" | "pending" | "rejected";

interface User {
  id: number | string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
 readonly password: string;
  role: Role;
  status: Status;
  createdAt: NativeDate
}

export function token(user: User): string {
  return jwt.sign(
    {
      id: user.id.toString(),
      role: user.role,
    },
    env.JWT_SECRET,
    { expiresIn: env.JWT_EXPIRES_IN },
  );
}
