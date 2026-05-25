import prisma from "../../prisma/client.js";

export const getAllAnnouncements = async (req, res) => {
  // 1. Конвертируем страницу через Number(), как требует подсказка
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
  };
  const [announcements, total] = await Promise.all([
    prisma.announcement.findMany(queryOptions),
    prisma.announcement.count({ where }), // Тот же самый объект where
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

  const announcement = await prisma.announcement.create({
    data: { title, description, price, category, contactInfo },
  });

  res.status(201).json(announcement);
};

export const updateAnnouncement = async (req, res) => {
  const { id } = req.params;

  const announcement = await prisma.announcement.update({
    where: { id: Number(id) },
    data: req.body,
  });

  res.status(200).json(announcement);
};

export const deleteAnnouncement = async (req, res) => {
  const { id } = req.params;

  await prisma.announcement.delete({
    where: { id: Number(id) },
  });

  res.status(204).end();
};
