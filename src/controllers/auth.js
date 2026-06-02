import bcrypt from "bcrypt";
import createHttpError from "http-errors";
import prisma from "../../prisma/client.js";
import { createTokens, setRefreshTokenCookie } from "../services/auth.js";
import logger from "../services/logger.js";

export const register = async (req, res) => {
  const { username, email, password, name } = req.body;
  logger.info(`Attempting to register user: ${username}`);

  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ username }, { email }],
    },
  });

  if (existingUser) {
    logger.error(`User already exists: ${username}`);
    throw createHttpError(409, "Username or email already taken");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      username,
      email,
      password: hashedPassword,
      name,
    },
  });

  const tokens = await createTokens(user.id);
  logger.info(`User registered successfully: ${user.username}`);
  setRefreshTokenCookie(res, tokens.refreshToken);

  res.status(201).json({
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      name: user.name,
    },
  });
};
export const login = async (req, res) => {
  const { username, password } = req.body;
  logger.info(`Attempting to login user: ${username}`);
  const user = await prisma.user.findUnique({
    where: { username },
  });

  if (!user) {
    logger.error(`Login failed for user: ${username}`);
    throw createHttpError(401, "Invalid credentials");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    logger.error(`Login failed for user: ${username}`);
    throw createHttpError(401, "Invalid credentials");
  }

  const tokens = await createTokens(user.id);
  setRefreshTokenCookie(res, tokens.refreshToken);

  logger.info(`User logged in successfully: ${user.username}`);

  res.status(200).json({
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      name: user.name,
    },
  });
};
export const refresh = async (req, res) => {
  const refreshToken = req.cookies.refreshToken || req.body.refreshToken;

  logger.info(`Attempting to refresh token`);

  if (!refreshToken) {
    logger.error(`Refresh token not provided`);
    throw createHttpError(401, "Refresh token not provided");
  }

  const storedToken = await prisma.refreshToken.findFirst({
    where: { token: refreshToken },
  });

  if (!storedToken) {
    logger.error(`Invalid refresh token provided`);
    throw createHttpError(401, "Invalid refresh token");
  }

  if (new Date() > storedToken.expiresAt) {
    await prisma.refreshToken.delete({ where: { id: storedToken.id } });
    logger.error(`Refresh token expired for user: ${storedToken.userId}`);
    throw createHttpError(401, "Refresh token expired");
  }

  await prisma.refreshToken.delete({ where: { id: storedToken.id } });

  const tokens = await createTokens(storedToken.userId);
  logger.info(`Token refreshed for user: ${storedToken.userId}`);
  setRefreshTokenCookie(res, tokens.refreshToken);

  res.status(200).json({
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
  });
};

export const getProfile = async (req, res) => {
  const userId = Number(req.user.sub);
  logger.info(`Fetching profile for user: ${userId}`);

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      username: true,
      email: true,
      name: true,
      createdAt: true,
    },
  });

  if (!user) {
    logger.error(`User not found: ${userId}`);
    throw createHttpError(404, "User not found");
  }

  logger.info(`Fetched profile for user: ${userId}`);

  res.status(200).json(user);
};

export const logout = async (req, res) => {
  const refreshToken = req.cookies.refreshToken || req.body.refreshToken;

  logger.info(`Logging out user: ${req.user.sub}`);

  if (refreshToken) {
    logger.info(`Deleting refresh token for user: ${req.user.sub}`);
    await prisma.refreshToken.deleteMany({
      where: { token: refreshToken },
    });
  }

  logger.info(`Deleted refresh token for user: ${req.user.sub}`);

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  res.status(204).end();
};
