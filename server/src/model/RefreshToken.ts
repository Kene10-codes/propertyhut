import { Schema, model } from "mongoose";

const refreshTokenSchema = new Schema(
  {
    tokenId: {
      type: String,
      required: true,
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    tokenHash: {
      type: String,
      required: true,
    },
    familyId: {
      type: String,
      required: true,
    },
    jti: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);
export const RefreshToken = model("RefreshToken", refreshTokenSchema);
