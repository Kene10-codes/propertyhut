import crypto from "crypto";
import { User } from "../utils/generateToken.js";
import { env } from "../config/env.js";
import {RefreshToken} from "../model/RefreshToken.js";

import {
  generateAccessToken,
  generateRefreshToken,
  hashRefreshToken,
} from "../utils/generateToken.js";

const getRefreshExpiry = (): Date => {
  const date = new Date();

  date.setDate(date.getDate() + env.REFRESH_TOKEN_EXPIRES_DAYS || 7);

  return date;
};

export const createSession = async (user: User) => {
  const accessToken = generateAccessToken(user);

  const refreshToken = generateRefreshToken();

  const tokenHash = hashRefreshToken(refreshToken);

  const family = crypto.randomUUID();


  const savedToken = await RefreshToken.create({
    user: user.id.toString(),
    tokenHash,
    family,
    expiresAt: getRefreshExpiry(),
  });

  return {
    accessToken,
    refreshToken,
    refreshTokenId: savedToken._id,
  };
};

export const rotateRefreshToken = async (token: string) => {
  const tokenHash = hashRefreshToken(token);

  const existingToken = await RefreshToken.findOne({
    tokenHash,
  }).populate<{ user: User }>("user");

  if (!existingToken) {
    throw new Error("INVALID_REFRESH_TOKEN");
  }

  // Detect reuse of an already revoked token.
  if (existingToken.revokedAt) {
    await RefreshToken.updateMany(
      { family: existingToken.family },
      { $set: { revokedAt: new Date() } }
    );

    throw new Error("REFRESH_TOKEN_REUSE");
  }

  if (existingToken.expiresAt <= new Date()) {
    throw new Error("EXPIRED_REFRESH_TOKEN");
  }

  // Atomically consume the old refresh token.
  const consumedToken = await RefreshToken.findOneAndUpdate(
    {
      _id: existingToken._id,
      revokedAt: null,
      expiresAt: { $gt: new Date() },
    },
    {
      $set: { revokedAt: new Date() },
    },
    { new: true }
  );

  if (!consumedToken) {
    // Another request may have consumed this token.
    const latestToken = await RefreshToken.findById(existingToken._id);

    if (latestToken?.revokedAt) {
      await RefreshToken.updateMany(
        { family: existingToken.family },
        { $set: { revokedAt: new Date() } }
      );
    }

    throw new Error("REFRESH_TOKEN_REUSE");
  }

  const newRefreshToken = generateRefreshToken();

  const newToken = await RefreshToken.create({
    user: String(existingToken.user.id),
    tokenHash: hashRefreshToken(newRefreshToken),
    family: existingToken.family,
    expiresAt: getRefreshExpiry(),
  });

  await RefreshToken.findByIdAndUpdate(existingToken._id, {
    replacedBy: newToken._id,
  });

  const accessToken = generateAccessToken(
    existingToken.user
  );

  return {
    accessToken,
    refreshToken: newRefreshToken,
  };
};

export const revokeRefreshToken = async (token: string) => {
  const tokenHash = hashRefreshToken(token);

  await RefreshToken.findOneAndUpdate(
    {
      tokenHash,
      revokedAt: null,
    },
    {
      $set: { revokedAt: new Date() },
    }
  );
};