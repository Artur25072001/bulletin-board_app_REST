import prisma from "../../prisma/client.js";
import createHttpError from "http-errors";

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

  res.status(200).json(announcement);
};

export const createAnnouncement = async (req, res) => {
  const { title, description, price, category, contactInfo } = req.body;
  const userId = Number(req.user.sub);

  const announcement = await prisma.announcement.create({
    data: {
      title,
      description,
      price: Number(price),
      category,
      contactInfo,
      userId,
    },
  });

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
    throw createHttpError(404, "Announcement not found");
  }

  if (announcement.userId !== userId) {
    throw createHttpError(
      403,
      "You are not authorized to update this announcement",
    );
  }

  const updatedAnnouncement = await prisma.announcement.update({
    where: { id: Number(id) },
    data: {
      title,
      description,
      price: price !== undefined ? Number(price) : undefined,
      category,
      contactInfo,
    },
  });

  res.status(200).json(updatedAnnouncement);
};

export const deleteAnnouncement = async (req, res) => {
  const { id } = req.params;
  const userId = Number(req.user.sub);

  const announcement = await prisma.announcement.findUnique({
    where: { id: Number(id) },
  });

  if (!announcement) {
    throw createHttpError(404, "Announcement not found");
  }

  if (announcement.userId !== userId) {
    throw createHttpError(
      403,
      "You are not authorized to delete this announcement",
    );
  }

  await prisma.announcement.delete({
    where: { id: Number(id) },
  });

  res.status(204).end();
};
