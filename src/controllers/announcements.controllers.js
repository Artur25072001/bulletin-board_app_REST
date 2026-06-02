import prisma from "../../prisma/client.js";
import createHttpError from "http-errors";
import logger from "../services/logger.js";
import { unlink } from "fs/promises";
import {
  upload,
  cloudinary,
  uploadImage,
} from "../middleware/upload.middleware.js";

export const getAllAnnouncements = async (req, res) => {
  const page = Number(req.query.page) || 1;
  const search = req.query.search || "";
  const currentSort = req.query.sort || "newest";
  const prismaSort = currentSort === "oldest" ? "asc" : "desc";
  const perPage = 10;

  const where = {};

  if (search) {
    where.title = {
      contains: search,
      // mode: "insensitive",
    };
  }

  const queryOptions = {
    skip: (page - 1) * perPage,
    take: perPage,
    orderBy: { createdAt: prismaSort },
    where,
    include: {
      user: {
        select: {
          id: true,
          username: true,
          email: true,
          name: true,
        },
      },
    },
  };
  logger.info(
    `Retrieved announcement with options: ${JSON.stringify(queryOptions)}`,
  );

  const [announcements, total] = await Promise.all([
    prisma.announcement.findMany(queryOptions),
    prisma.announcement.count({ where }),
  ]);

  res.status(200).json({
    data: announcements,
    pagination: {
      total,
      page,
      totalPages: Math.ceil(total / perPage),
      perPage,
    },
  });
};

export const getAnnouncementById = async (req, res) => {
  const { id } = req.params;

  const announcement = await prisma.announcement.findUniqueOrThrow({
    where: { id: Number(id) },
  });
  logger.info(
    `Retrieved announcement with id ${id}: ${JSON.stringify(announcement)}`,
  );

  res.status(200).json(announcement);
};

export const createAnnouncement = async (req, res) => {
  const { title, description, price, category, contactInfo } = req.body;
  const userId = Number(req.user.sub);
  const imageUrl = req.file ? await uploadImage(req.file) : undefined;

  const announcement = await prisma.announcement.create({
    data: {
      title,
      description,
      price: Number(price),
      category,
      contactInfo,
      userId,
      ...(imageUrl !== undefined && { imageUrl }),
    },
  });
  logger.info(
    `Created announcement with id ${announcement.id} for user ${userId}: ${JSON.stringify(
      announcement,
    )}`,
  );

  res.status(201).json(announcement);
};

export const updateAnnouncement = async (req, res) => {
  const { id } = req.params;
  const { title, description, price, category, contactInfo } = req.body;
  const userId = Number(req.user.sub);

  const announcement = await prisma.announcement.findUnique({
    where: { id: Number(id) },
  });

  if (!announcement) {
    logger.error(
      `Attempted to update non-existent announcement with id ${id} by user ${userId}`,
    );
    throw createHttpError(404, "Announcement not found");
  }

  if (announcement.userId !== userId) {
    logger.error(
      `Unauthorized update attempt for announcement with id ${id} by user ${userId}`,
    );
    throw createHttpError(
      403,
      "You are not authorized to update this announcement",
    );
  }
  const imageUrl = req.file ? await uploadImage(req.file) : undefined;

  const updatedAnnouncement = await prisma.announcement.update({
    where: { id: Number(id) },
    data: {
      title,
      description,
      price: price !== undefined ? Number(price) : undefined,
      category,
      contactInfo,
      ...(imageUrl !== undefined && { imageUrl }),
    },
  });
  logger.info(
    `Updated announcement with id ${id} for user ${userId}: ${JSON.stringify(
      updatedAnnouncement,
    )}`,
  );
  res.status(200).json(updatedAnnouncement);
};

export const deleteAnnouncement = async (req, res) => {
  const { id } = req.params;
  const userId = Number(req.user.sub);

  const announcement = await prisma.announcement.findUnique({
    where: { id: Number(id) },
  });

  if (!announcement) {
    logger.error(
      `Attempted to delete non-existent announcement with id ${id} by user ${userId}`,
    );
    throw createHttpError(404, "Announcement not found");
  }

  if (announcement.userId !== userId) {
    logger.error(
      `Unauthorized delete attempt for announcement with id ${id} by user ${userId}`,
    );
    throw createHttpError(
      403,
      "You are not authorized to delete this announcement",
    );
  }

  logger.info(
    `Deleted announcement with id ${id} for user ${userId}: ${JSON.stringify(
      announcement,
    )}`,
  );

  await prisma.announcement.delete({
    where: { id: Number(id) },
  });

  res.status(204).end();
};
