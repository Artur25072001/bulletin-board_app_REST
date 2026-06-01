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
 *     description: Retrieve a paginated list of announcements with optional search and sorting
 *     tags: [Announcements]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: take
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *           minLength: 1
 *           maxLength: 100
 *         description: Search substring in title
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [newest, oldest]
 *           default: newest
 *         description: Sort order by creation date
 *     responses:
 *       200:
 *         description: List of announcements retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       title:
 *                         type: string
 *                         example: Продам ноутбук ASUS
 *                       description:
 *                         type: string
 *                         example: Відмінний стан, 16GB RAM
 *                       price:
 *                         type: number
 *                         example: 18000
 *                       category:
 *                         type: string
 *                         example: sale
 *                       contactInfo:
 *                         type: string
 *                         example: "0991234567"
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                       userId:
 *                         type: integer
 *                         example: 1
 *                       user:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           username:
 *                             type: string
 *                           email:
 *                             type: string
 *                           name:
 *                             type: string
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                       example: 50
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     totalPages:
 *                       type: integer
 *                       example: 5
 *                     perPage:
 *                       type: integer
 *                       example: 10
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
 *     description: Retrieve a single announcement by its ID
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 title:
 *                   type: string
 *                   example: Продам ноутбук ASUS
 *                 description:
 *                   type: string
 *                   example: Відмінний стан, 16GB RAM
 *                 price:
 *                   type: number
 *                   example: 18000
 *                 category:
 *                   type: string
 *                   example: sale
 *                 contactInfo:
 *                   type: string
 *                   example: "0991234567"
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                 userId:
 *                   type: integer
 *                   example: 1
 *       404:
 *         description: Announcement not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Resource not found
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
 *     description: Create a new announcement (requires authentication)
 *     tags: [Announcements]
 *     security:
 *       - BearerAuth: []
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
 *                 minLength: 5
 *                 maxLength: 100
 *                 example: Продам ноутбук ASUS
 *               description:
 *                 type: string
 *                 minLength: 10
 *                 maxLength: 200
 *                 example: Відмінний стан, 16GB RAM
 *               price:
 *                 type: number
 *                 example: 18000
 *               category:
 *                 type: string
 *                 enum: [sale, service, job, other]
 *                 example: sale
 *               contactInfo:
 *                 type: string
 *                 minLength: 5
 *                 maxLength: 200
 *                 example: "0991234567"
 *     responses:
 *       201:
 *         description: Announcement created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 title:
 *                   type: string
 *                   example: Продам ноутбук ASUS
 *                 description:
 *                   type: string
 *                   example: Відмінний стан, 16GB RAM
 *                 price:
 *                   type: number
 *                   example: 18000
 *                 category:
 *                   type: string
 *                   example: sale
 *                 contactInfo:
 *                   type: string
 *                   example: "0991234567"
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                 userId:
 *                   type: integer
 *                   example: 1
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 400
 *                 error:
 *                   type: string
 *                   example: Bad Request
 *                 message:
 *                   type: string
 *       401:
 *         description: Unauthorized — missing or invalid JWT token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Unauthorized
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
 *     description: Update an existing announcement (requires authentication, only owner can update)
 *     tags: [Announcements]
 *     security:
 *       - BearerAuth: []
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
 *             minProperties: 1
 *             properties:
 *               title:
 *                 type: string
 *                 minLength: 5
 *                 maxLength: 100
 *                 example: Новий заголовок
 *               description:
 *                 type: string
 *                 minLength: 10
 *                 maxLength: 200
 *                 example: Оновлений опис з додатковими деталями
 *               price:
 *                 type: number
 *                 example: 15000
 *               category:
 *                 type: string
 *                 enum: [sale, service, job, other]
 *                 example: service
 *               contactInfo:
 *                 type: string
 *                 minLength: 5
 *                 maxLength: 200
 *                 example: "0990000000"
 *     responses:
 *       200:
 *         description: Announcement updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 title:
 *                   type: string
 *                   example: Новий заголовок
 *                 description:
 *                   type: string
 *                   example: Оновлений опис з додатковими деталями
 *                 price:
 *                   type: number
 *                   example: 15000
 *                 category:
 *                   type: string
 *                   example: service
 *                 contactInfo:
 *                   type: string
 *                   example: "0990000000"
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                 userId:
 *                   type: integer
 *                   example: 1
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 400
 *                 error:
 *                   type: string
 *                   example: Bad Request
 *                 message:
 *                   type: string
 *       401:
 *         description: Unauthorized — missing or invalid JWT token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Unauthorized
 *       403:
 *         description: Forbidden — you are not the owner of this announcement
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: You are not authorized to update this announcement
 *       404:
 *         description: Announcement not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Announcement not found
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
 *     description: Delete an existing announcement (requires authentication, only owner can delete)
 *     tags: [Announcements]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Announcement ID
 *     responses:
 *       204:
 *         description: Announcement deleted successfully (no content returned)
 *       401:
 *         description: Unauthorized — missing or invalid JWT token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Unauthorized
 *       403:
 *         description: Forbidden — you are not the owner of this announcement
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: You are not authorized to delete this announcement
 *       404:
 *         description: Announcement not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Announcement not found
 */
router.delete(
  "/:id",
  authenticate,
  announcementValidator.deleteAnnouncementValidator,
  announcementController.deleteAnnouncement,
);

export default router;
