import { Schema, model } from "mongoose";
import { lowercase, minLength } from "zod";

export type Role = "user" | "agent" | "admin";

const signupSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      minLength: 1,
    },

    lastName: {
      type: String,
      required: true,
      trim: true,
      minLength: 1,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
      trim: true,
      minLength: 1,
    },
    phoneNumber: {
      type: String,
      required: true,
      trim: true,
      minLength: 11,
    },
    roles: { type: String, enum: ["user", "agent", "admin"], default: "user" },
    password: { type: String, required: true, minLength: 8 },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

export const User = model("User", signupSchema);
