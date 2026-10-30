import { Schema, model } from "mongoose";

export type Role = "user" | "agent" | "admin";

const user = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      minLength: 2,
    },

    lastName: {
      type: String,
      required: true,
      trim: true,
      minLength: 2,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
      trim: true,
      minLength: 2,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      minLength: 11,
    },
    role: { type: String, enum: ["user", "agent", "admin"], default: "user" },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "approved",
    },
    password: { type: String, required: true, minLength: 8 },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

export const User = model("User", user);
