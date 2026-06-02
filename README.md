# Bulletin Board REST API

A production-style REST API for a classifieds / bulletin-board application, built with Node.js, Express 5, and Prisma ORM. It supports user registration and JWT-based authentication, full CRUD for announcements with image uploads, pagination, search, and sorting.

## Description

This project is a learning-oriented REST API boilerplate / starter for a bulletin-board application. It demonstrates a clean, layered architecture (Controllers → Routes → Validators) with proper error handling, security middleware, request validation, structured logging, rate limiting, and auto-generated OpenAPI / Swagger documentation.

## Features

- ✅ **Express 5** — modern, fast HTTP server
- ✅ **JWT authentication** — register, login, refresh token rotation, logout
- ✅ **bcrypt password hashing** — secure password storage
- ✅ **Announcements CRUD** — create, read, update, delete with owner-only authorization
- ✅ **Image upload** — Multer + Cloudinary integration (jpeg, png, webp, max 5 MB)
- ✅ **Search, sort, and pagination** — on the announcements list endpoint
- ✅ **Prisma ORM + SQLite** — type-safe database access
- ✅ **Celebrate / Joi** — declarative request validation
- ✅ **Swagger / OpenAPI 3** — auto-generated interactive API docs at `/api-docs`
- ✅ **Security** — Helmet, CORS, httpOnly cookies, rate limiting (global + strict on auth)
- ✅ **Structured logging** — Pino + pino-http with pretty output
- ✅ **Centralized error handling** — for Prisma errors (`P2025`, `P2002`, `P2003`), JSON parse errors, and Celebrate validation errors
- ✅ **ES Modules** — modern `"type": "module"` setup
- ✅ **Hot reload** — `node --watch` for development

## Tech Stack

| Technology         | Version | Purpose                                  |
| ------------------ | ------- | ---------------------------------------- |
| Node.js            | 18+     | JavaScript runtime                       |
| Express            | ^5.2.1  | Web framework                            |
| Prisma             | ^7.2.0  | ORM + migrations                         |
| @prisma/client     | ^7.2.0  | Generated Prisma client                  |
| Celebrate          | ^15.0.3 | Request validation (Joi)                 |
| Swagger UI Express | ^5.0.1  | Interactive API docs UI                  |
| Swagger JSDoc      | ^6.2.8  | OpenAPI spec generator from JSDoc        |
| jsonwebtoken       | ^9.0.3  | JWT access & refresh tokens              |
| bcrypt             | ^6.0.0  | Password hashing                         |
| multer             | ^2.1.1  | `multipart/form-data` parsing            |
| cloudinary         | ^2.10.0 | Cloud image storage                      |
| helmet             | ^8.2.0  | Security HTTP headers                    |
| cors               | ^2.8.6  | Cross-origin resource sharing            |
| cookie-parser      | ^1.4.7  | Parse `Cookie` header into `req.cookies` |
| express-rate-limit | ^8.5.2  | Rate limiting / brute-force protection   |
| pino               | ^10.3.1 | Structured JSON logger                   |
| pino-http          | ^11.0.0 | Per-request HTTP logging                 |
| pino-pretty        | ^13.1.3 | Pretty-printed logs (dev)                |
| http-errors        | ^2.0.1  | Typed HTTP error factory                 |
| dotenv             | ^17.2.3 | Environment variable loader              |
| nodemailer         | ^8.0.10 | Email sending                            |
| node-cron          | ^4.2.1  | Scheduled tasks                          |

## Requirements

- **Node.js** 18.x or higher
- **npm** (or yarn / pnpm)
- A **Cloudinary** account (free tier is fine) for image uploads
- A **Gmail** account with an [App Password](https://support.google.com/accounts/answer/185833) if you plan to use the email features

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/Artur25072001/bulletin-board_app_REST.git
   cd bulletin-board_app_REST
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Create the environment file:**

   ```bash
   cp .env.example .env
   ```

   Then fill in the values (see [Configuration](#configuration) below).

4. **Run database migrations and generate the Prisma client:**

   ```bash
   npm run prisma:migrate
   npm run prisma:generate
   ```

5. **Start the server in development mode (auto-reload):**

   ```bash
   npm run dev
   ```

   The server will be available at `http://localhost:3000` and the API docs at `http://localhost:3000/api-docs`.

## Configuration

All configuration is done through environment variables in `.env`:

```env
# --- Database ---
# Prisma SQLite connection string
DATABASE_URL="file:./dev.db"

# --- JWT ---
# A secret of at least 256 bits used to sign JWT access & refresh tokens
JWT_SECRET=your-secret-key-at-least-256-bits-long

# --- CORS ---
# Comma-separated list of allowed origins
ALLOWED_ORIGINS=http://localhost:5173,https://my-app.example.com

# --- Cloudinary (image uploads) ---
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=your_api_secret

# --- Email (optional, for password reset / notifications) ---
EMAIL_USER=example@gmail.com
EMAIL_PASS=your_gmail_app_password

# --- Server (optional) ---
# PORT=3000
# NODE_ENV=development
```

> ⚠️ Never commit a real `.env` file. The provided `.env.example` is a safe template.

## Working with the Database

The project uses **Prisma ORM** with **SQLite** for zero-setup local development. The schema lives in `prisma/schema.prisma` and defines three models:

| Model          | Purpose                                                                   |
| -------------- | ------------------------------------------------------------------------- |
| `User`         | Application users. Owns announcements and refresh tokens.                 |
| `Announcement` | A classifieds entry: title, description, price, category, contact, image. |
| `RefreshToken` | Persistent refresh-token records (supports rotation and revocation).      |

### Create / apply a migration

After editing `prisma/schema.prisma`:

```bash
npm run prisma:migrate
```

This reads the schema, creates a new migration, and applies it to the database.

### Regenerate the Prisma Client

After schema or migration changes:

```bash
npm run prisma:generate
```

### Using the Prisma Client

```javascript
import prisma from "../prisma/client.js";

const announcements = await prisma.announcement.findMany({
  take: 10,
  orderBy: { createdAt: "desc" },
});
```

## Available Scripts

| Command                   | Description                                          |
| ------------------------- | ---------------------------------------------------- |
| `npm start`               | Run the server in production mode (`node app.js`)    |
| `npm run dev`             | Run with `node --watch` (auto-reload on file change) |
| `npm run prisma:migrate`  | Create and apply a Prisma migration                  |
| `npm run prisma:generate` | Generate the Prisma Client                           |

## Project Structure

```
bulletin-board_app_REST/
├── prisma/                            # Prisma configuration & schema
│   ├── schema.prisma                  # Database schema (User, Announcement, RefreshToken)
│   ├── client.js                      # Prisma Client singleton
│   └── migrations/                    # Generated migration history
├── generated/                         # Generated Prisma Client (gitignored)
├── uploads/                           # Local temp uploads (gitignored)
├── src/
│   ├── constants/                     # Shared constants (e.g. time helpers)
│   ├── controllers/                   # Request handlers (business logic)
│   │   ├── auth.js                    # register, login, refresh, logout, profile
│   │   └── announcements.controllers.js# CRUD for announcements
│   ├── middleware/                    # Express middleware
│   │   ├── authenticate.js            # JWT verification
│   │   └── upload.middleware.js       # Multer + Cloudinary upload helper
│   ├── routes/                        # Route definitions + Swagger JSDoc
│   │   ├── auth.js                    # /api/auth/*
│   │   └── announcements.routes.js    # /api/announcements/*
│   ├── services/                      # Cross-cutting services
│   │   ├── auth.js                    # Token creation, cookie helpers
│   │   ├── limiter.js                 # Rate limiters (general + strict)
│   │   └── logger.js                  # Pino logger instance
│   └── validators/                    # Celebrate / Joi request schemas
│       ├── auth.js
│       └── announcements.validators.js
├── app.js                             # Application entry point
├── .env.example                       # Environment variable template
├── .gitignore
├── package.json
├── tsconfig.json                      # TypeScript config (for editor typing)
└── README.md
```

### Folder responsibilities

- **`src/controllers/`** — Implement the actual logic for each request: talk to the database, call services, return JSON responses or throw typed HTTP errors.
- **`src/routes/`** — Define URL paths, attach middleware (auth, upload, validation), and host the Swagger JSDoc comments that produce the OpenAPI spec.
- **`src/validators/`** — Joi schemas wrapped with `celebrate` for `body`, `params`, and `query` validation.
- **`src/middleware/`** — Reusable Express middleware: JWT authentication and the Multer/Cloudinary upload pipeline.
- **`src/services/`** — Stateless helpers shared across the app: token utilities, rate limiters, and the logger.

## API Endpoints

All endpoints return JSON. Protected endpoints require a `Authorization: Bearer <accessToken>` header.

### Auth (`/api/auth`)

| Method | Path                 | Auth | Description                                    |
| ------ | -------------------- | ---- | ---------------------------------------------- |
| POST   | `/api/auth/register` | No   | Create a new user, return access + refresh     |
| POST   | `/api/auth/login`    | No   | Authenticate, return access + refresh          |
| POST   | `/api/auth/refresh`  | No   | Exchange a refresh token for a new pair        |
| POST   | `/api/auth/logout`   | No   | Invalidate the refresh token, clear cookie     |
| GET    | `/api/auth/me`       | Yes  | Get the currently authenticated user's profile |

### Announcements (`/api/announcements`)

| Method | Path                     | Auth | Description                                             |
| ------ | ------------------------ | ---- | ------------------------------------------------------- |
| GET    | `/api/announcements`     | No   | List announcements (paginated, searchable, sortable)    |
| GET    | `/api/announcements/:id` | No   | Get a single announcement by ID                         |
| POST   | `/api/announcements`     | Yes  | Create an announcement (supports image upload)          |
| PATCH  | `/api/announcements/:id` | Yes  | Update an announcement (owner only, supports new image) |
| DELETE | `/api/announcements/:id` | Yes  | Delete an announcement (owner only)                     |

## Authentication

The API uses a **two-token** strategy:

- **Access token** (JWT, short-lived) — sent as `Authorization: Bearer <token>` on every protected request.
- **Refresh token** (JWT, long-lived) — stored in the database and either:
  - sent in the request body (`{ "refreshToken": "..." }`), or
  - automatically read from the `refreshToken` httpOnly cookie set on register / login.

### Example flow

```bash
# 1. Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"john_doe","email":"john@example.com","password":"mypassword123","name":"John Doe"}'

# 2. Use the returned accessToken on a protected route
curl http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer <accessToken>"

# 3. Refresh when the access token expires
curl -X POST http://localhost:3000/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{"refreshToken":"<refreshToken>"}'
```

> Refresh tokens are **rotated**: each successful refresh invalidates the old token and issues a new pair.

## Image Upload

Image uploads use **Multer** (in-memory) and are streamed to **Cloudinary**.

- Endpoint: `POST /api/announcements` or `PATCH /api/announcements/:id`
- Content-Type: `multipart/form-data`
- Field name: `image`
- Accepted types: `image/jpeg`, `image/png`, `image/webp`
- Max size: 5 MB
- The returned `imageUrl` is the secure Cloudinary URL

### Example

```bash
curl -X POST http://localhost:3000/api/announcements \
  -H "Authorization: Bearer <accessToken>" \
  -F "title=Selling ASUS laptop" \
  -F "description=Excellent condition, 16GB RAM" \
  -F "price=18000" \
  -F "category=sale" \
  -F "contactInfo=0991234567" \
  -F "image=@./laptop.jpg"
```

## Request Validation

All incoming requests are validated with **Celebrate / Joi** schemas defined in `src/validators/`. A failed validation produces a structured `400 Bad Request` response listing the offending field(s).

## Error Handling

A single error-handling middleware at the bottom of `app.js` normalizes every error into a consistent JSON shape.

| Error type                  | HTTP status | Description                               |
| --------------------------- | ----------- | ----------------------------------------- |
| `entity.parse.failed`       | 400         | Malformed JSON in the request body        |
| Celebrate validation error  | 400         | Body / params / query failed validation   |
| Prisma `P2003`              | 400         | Foreign-key constraint violation          |
| Prisma `P2025`              | 404         | Record not found                          |
| Prisma `P2002`              | 409         | Unique constraint violation               |
| Any other `4xx` `HttpError` | as thrown   | Explicit error from controller/middleware |
| Unhandled error             | 500         | Internal server error                     |

### Sample validation error response

```json
{
  "statusCode": 400,
  "error": "Bad Request",
  "message": "Validation failed",
  "validation": {
    "body": {
      "source": "body",
      "keys": ["title"],
      "message": "\"title\" must be a string"
    }
  }
}
```

## API Documentation

Interactive Swagger UI is auto-generated from JSDoc comments in the route files.

- **URL:** <http://localhost:3000/api-docs>
- **Format:** OpenAPI 3.0.0
- **Auth:** Click the **Authorize** button and paste a JWT access token to try protected endpoints.

You can extend the docs by adding JSDoc blocks above your routes, e.g.:

```javascript
/**
 * @swagger
 * /api/announcements:
 *   get:
 *     summary: List announcements
 *     tags: [Announcements]
 *     responses:
 *       200:
 *         description: List of announcements
 */
router.get("/", getAllAnnouncements);
```

## Rate Limiting

Two limiters are configured in `src/services/limiter.js`:

| Limiter         | Window     | Limit | Applied to                         |
| --------------- | ---------- | ----- | ---------------------------------- |
| `limiter`       | 15 minutes | 100   | All routes                         |
| `strictLimiter` | 15 minutes | 10    | `/api/auth/*` (login, register, …) |

When a limit is exceeded the API responds with `429 Too Many Requests`.

## Usage Examples

### Create an announcement

```bash
curl -X POST http://localhost:3000/api/announcements \
  -H "Authorization: Bearer <accessToken>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Selling ASUS laptop",
    "description": "Excellent condition, 16GB RAM, original charger",
    "price": 18000,
    "category": "sale",
    "contactInfo": "0991234567"
  }'
```

### List announcements (paginated, searchable, sortable)

```bash
# Page 1, 10 per page, search "laptop", newest first
curl "http://localhost:3000/api/announcements?page=1&search=laptop&sort=newest"
```

Sample response:

```json
{
  "data": [
    {
      "id": 1,
      "title": "Selling ASUS laptop",
      "description": "Excellent condition, 16GB RAM",
      "price": 18000,
      "category": "sale",
      "contactInfo": "0991234567",
      "imageUrl": "https://res.cloudinary.com/.../laptop.jpg",
      "createdAt": "2026-02-10T12:00:00.000Z",
      "updatedAt": "2026-02-10T12:00:00.000Z",
      "userId": 1,
      "user": {
        "id": 1,
        "username": "john_doe",
        "email": "john@example.com",
        "name": "John Doe"
      }
    }
  ],
  "pagination": {
    "total": 1,
    "page": 1,
    "totalPages": 1,
    "perPage": 10
  }
}
```

### Update an announcement (owner only)

```bash
curl -X PATCH http://localhost:3000/api/announcements/1 \
  -H "Authorization: Bearer <accessToken>" \
  -H "Content-Type: application/json" \
  -d '{"price": 17000}'
```

### Delete an announcement (owner only)

```bash
curl -X DELETE http://localhost:3000/api/announcements/1 \
  -H "Authorization: Bearer <accessToken>"
```

## Useful Tips

1. **Use `npm run dev`** during development for automatic server reload on file changes.
2. **Explore the API visually** at `/api-docs` — you can authenticate once and try every endpoint from the browser.
3. **Always create validators** for new endpoints; never trust user input.
4. **Stick to the folder structure** (`controllers` / `routes` / `validators` / `middleware` / `services`) to keep the code maintainable.
5. **Rotate the JWT secret** between environments and never commit it to version control.
6. **Use Cloudinary signed uploads** in production to avoid exposing API secrets to the client.

## Learning Resources

- [Express.js documentation](https://expressjs.com/)
- [Prisma documentation](https://www.prisma.io/docs)
- [Joi validation](https://joi.dev/api/)
- [OpenAPI / Swagger specification](https://swagger.io/specification/)
- [JWT introduction (jwt.io)](https://jwt.io/introduction)
- [bcrypt usage guide](https://github.com/kelektiv/node.bcrypt.js#readme)
- [Helmet documentation](https://helmetjs.github.io/)
- [Cloudinary Node.js SDK](https://cloudinary.com/documentation/node_integration)
- [Pino logger](https://getpino.io/)

## License

ISC

## Contact

For questions and support, reach out to the course instructor or mentor.
