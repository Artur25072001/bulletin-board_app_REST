import express from "express";
import authenticate from "../middleware/authenticate.js";
import * as announcementController from "../controllers/announcements.controllers.js";
import * as announcementValidator from "../validators/announcements.validators.js";

const router = express.Router();

/**
 * @swagger
 * /api/announcements:
 *   get:
 *     summary: Get all announcements
 *     tags: [Announcements]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search substring in title
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         description: Sort order (newest or oldest)
 *     responses:
 *       200:
 *         description: List of announcements retrieved successfully
 */
router.get(
  "/",
  announcementController.getAllAnnouncements,
  announcementValidator.getAnnouncementValidator,
);

/**
 * @swagger
 * /api/announcements/{id}:
 *   get:
 *     summary: Get announcement by ID
 *     tags: [Announcements]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Announcement ID
 *     responses:
 *       200:
 *         description: Announcement retrieved successfully
 *       404:
 *         description: Announcement not found
 */
router.get(
  "/:id",
  announcementValidator.getAnnouncementValidator,
  announcementController.getAnnouncementById,
);

/**
 * @swagger
 * /api/announcements:
 *   post:
 *     summary: Create new announcement
 *     tags: [Announcements]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - price
 *               - category
 *               - contactInfo
 *             properties:
 *               title:
 *                 type: string
 *                 example: Продам ноутбук ASUS
 *               description:
 *                 type: string
 *                 example: Відмінний стан, 16GB RAM
 *               price:
 *                 type: number
 *                 example: 18000
 *               category:
 *                 type: string
 *                 example: sale
 *               contactInfo:
 *                 type: string
 *                 example: "0991234567"
 *     responses:
 *       201:
 *         description: Announcement created successfully
 *       400:
 *         description: Validation error
 */
router.post(
  "/",
  authenticate,
  announcementValidator.createAnnouncementValidator,
  announcementController.createAnnouncement,
);

/**
 * @swagger
 * /api/announcements/{id}:
 *   patch:
 *     summary: Update announcement
 *     tags: [Announcements]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Announcement ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Новий заголовок
 *               description:
 *                 type: string
 *                 example: Оновлений опис з додатковими деталями
 *               price:
 *                 type: number
 *                 example: 15000
 *               category:
 *                 type: string
 *                 example: service
 *               contactInfo:
 *                 type: string
 *                 example: "0990000000"
 *     responses:
 *       200:
 *         description: Announcement updated successfully
 *       404:
 *         description: Announcement not found
 */
router.patch(
  "/:id",
  authenticate,
  announcementValidator.updateAnnouncementValidator,
  announcementController.updateAnnouncement,
);

/**
 * @swagger
 * /api/announcements/{id}:
 *   delete:
 *     summary: Delete announcement
 *     tags: [Announcements]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Announcement ID
 *     responses:
 *       204:
 *         description: Announcement deleted successfully
 *       404:
 *         description: Announcement not found
 */
router.delete(
  "/:id",
  authenticate,
  announcementValidator.deleteAnnouncementValidator,
  announcementController.deleteAnnouncement,
);

export default router;
