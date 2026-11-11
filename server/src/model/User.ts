import { Schema, model, Document } from "mongoose";

export type Role = "user" | "agent" | "admin";
export type Status = "pending" | "approved" | "rejected";

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: Role;
  status: Status;
  isEmailVerified: Boolean;
  emailVerificationToken: string;
  emailVerificationExpires: Date;
  resetPasswordToken: string;
  resetPasswordExpires: Date;
  password: string;
  createdAt: Date;
}

const user = new Schema<IUser>(
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
    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    emailVerificationToken: {
      type: String,
      default: null,
    },

    emailVerificationExpires: {
      type: Date,
      default: null,
    },
    resetPasswordToken: {
      type: String,
      default: null,
    },
    resetPasswordExpires: {
      type: Date,
      default: null,
    },
    password: { type: String, required: true, minLength: 8 },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

export const User = model<IUser>("User", user);
