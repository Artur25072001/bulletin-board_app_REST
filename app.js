import express from "express";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import { errors as celebrateErrors } from "celebrate";
import authRouter from "./src/routes/auth.js";
import cors from "cors";
import "dotenv/config";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import announcementsRouter from "./src/routes/announcements.routes.js";
import { limiter, strictLimiter } from "./src/services/limiter.js";
import logger from "./src/services/logger.js";
import pinoHttp from "pino-http";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS?.split(",") || "http://localhost:3000",
    credentials: true,
  }),
);
app.use(
  helmet({
    contentSecurityPolicy: false,
  }),
);

app.use(cookieParser());
app.use(limiter);
app.use(pinoHttp({ logger }));

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Bulletin Board REST API",
      version: "1.0.0",
      description: "REST API documentation for the Bulletin Board application",
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Enter your JWT access token",
        },
      },
    },
  },
  apis: [path.join(__dirname, "src/routes/*.js")],
};
const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Our routes would go here, for example:
app.use("/api/announcements", announcementsRouter);
app.use("/api/auth", strictLimiter, authRouter);

app.use(celebrateErrors());

// 404 Not Found handler - must be after all routes
app.use((req, res) => {
  logger.error(`Route not found: ${req.originalUrl}`);
  res.status(404).json({ error: "Not found" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error(err);

  if (err.status && err.status >= 400 && err.status < 500) {
    logger.error(`Client error: ${err.message}`);
    return res.status(err.status).json({ error: err.message });
  }

  // JSON parsing errors (invalid JSON format)
  if (err.type === "entity.parse.failed" && err.status === 400) {
    return res.status(400).json({
      statusCode: 400,
      error: "Bad Request",
      message: "Invalid JSON",
      validation: {
        body: {
          source: "body",
          keys: [],
          message: "Invalid JSON format in request body",
        },
      },
    });
  }

  if (err.code === "P2025") {
    logger.error(`Resource not found: ${err.meta?.cause || "Unknown cause"}`);
    return res.status(404).json({ error: "Resource not found" });
  }

  if (err.code === "P2002") {
    logger.error(
      `Unique constraint violation: ${err.meta?.cause || "Unknown cause"}`,
    );
    return res.status(409).json({ error: "Unique constraint violation" });
  }

  if (err.code === "P2003") {
    logger.error(
      `Foreign key constraint failed: ${err.meta?.cause || "Unknown cause"}`,
    );
    return res.status(400).json({ error: "Foreign key constraint failed" });
  }
  logger.error(`Unhandled error: ${err.message || "No message"}`, {
    stack: err.stack,
  });

  res.status(500).json({ error: "Internal server error" });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  logger.info(`Server is running on http://localhost:${PORT}`);
  logger.info(`API docs: http://localhost:${PORT}/api-docs`);
});
