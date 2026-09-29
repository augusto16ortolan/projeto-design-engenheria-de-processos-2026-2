const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const swaggerUi = require("swagger-ui-express");
const { createRepository, defaultDatabasePath } = require("./database");
const openapi = require("./openapi");

const TOKEN_DURATION = "1h";
const MEDIA_TYPES = ["movie", "series"];
const SORTABLE_FIELDS = ["title", "year", "rating"];

function publicUser(user) {
  return { id: user.id, name: user.name, email: user.email };
}

function validateUser({ name, email, password }) {
  const errors = [];
  if (typeof name !== "string" || name.trim().length < 2) errors.push("name must have at least 2 characters");
  if (typeof email !== "string" || !/^\S+@\S+\.\S+$/.test(email)) errors.push("email must be valid");
  if (typeof password !== "string" || password.length < 6) errors.push("password must have at least 6 characters");
  return errors;
}

function validateMedia(media) {
  const errors = [];
  const year = Number(media.year);
  const rating = Number(media.rating);
  if (!MEDIA_TYPES.includes(media.type)) errors.push("type must be movie or series");
  for (const field of ["title", "synopsis", "imageUrl"]) {
    if (typeof media[field] !== "string" || !media[field].trim()) errors.push(`${field} is required`);
  }
  if (!Array.isArray(media.genres) || !media.genres.length || media.genres.some((genre) => typeof genre !== "string" || !genre.trim())) {
    errors.push("genres must be a non-empty array of strings");
  }
  if (!Number.isInteger(year) || year < 1888 || year > new Date().getFullYear() + 5) errors.push("year must be valid");
  if (!Number.isFinite(rating) || rating < 0 || rating > 10) errors.push("rating must be between 0 and 10");
  if (typeof media.imageUrl === "string" && media.imageUrl && !/^https?:\/\//.test(media.imageUrl)) {
    errors.push("imageUrl must start with http:// or https://");
  }
  return errors;
}

function normalizeMedia(media) {
  return {
    type: media.type,
    title: media.title.trim(),
    year: Number(media.year),
    duration: typeof media.duration === "string" ? media.duration.trim() : "",
    seasons: media.type === "series" ? Number(media.seasons || 0) : undefined,
    episodes: media.type === "series" ? Number(media.episodes || 0) : undefined,
    genres: media.genres.map((genre) => genre.trim()),
    ageRating: typeof media.ageRating === "string" ? media.ageRating.trim() : "",
    rating: Number(media.rating),
    director: typeof media.director === "string" ? media.director.trim() : "",
    creator: typeof media.creator === "string" ? media.creator.trim() : "",
    cast: Array.isArray(media.cast) ? media.cast.map((name) => name.trim()) : [],
    studio: typeof media.studio === "string" ? media.studio.trim() : "",
    country: typeof media.country === "string" ? media.country.trim() : "",
    language: typeof media.language === "string" ? media.language.trim() : "",
    imageUrl: media.imageUrl.trim(),
    synopsis: media.synopsis.trim(),
  };
}

function parsePositiveInteger(value, fallback, maximum) {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 1) return fallback;
  return Math.min(parsed, maximum);
}

function applyFilters(media, query) {
  const type = MEDIA_TYPES.includes(query.type) ? query.type : undefined;
  const genre = typeof query.genre === "string" ? query.genre.trim().toLowerCase() : "";
  const search = typeof query.q === "string" ? query.q.trim().toLowerCase() : "";
  const year = Number(query.year);
  const yearFrom = Number(query.yearFrom);
  const yearTo = Number(query.yearTo);
  const minRating = Number(query.minRating);

  return media.filter((item) => {
    if (type && item.type !== type) return false;
    if (genre && !item.genres.some((itemGenre) => itemGenre.toLowerCase() === genre)) return false;
    if (search && !`${item.title} ${item.synopsis}`.toLowerCase().includes(search)) return false;
    if (Number.isInteger(year) && item.year !== year) return false;
    if (Number.isInteger(yearFrom) && item.year < yearFrom) return false;
    if (Number.isInteger(yearTo) && item.year > yearTo) return false;
    if (Number.isFinite(minRating) && item.rating < minRating) return false;
    return true;
  });
}

function createApp({ databasePath = defaultDatabasePath(), jwtSecret = process.env.JWT_SECRET } = {}) {
  if (!jwtSecret) throw new Error("JWT_SECRET is not configured.");
  const repository = createRepository(databasePath);
  const app = express();
  app.use(express.json());
  app.get("/openapi.json", (_req, res) => res.json(openapi));
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openapi));

  function createToken(user) {
    return jwt.sign({ sub: user.id, email: user.email }, jwtSecret, { expiresIn: TOKEN_DURATION });
  }

  async function authenticate(req, res, next) {
    const [scheme, token] = (req.headers.authorization || "").split(" ");
    if (scheme !== "Bearer" || !token) return res.status(401).json({ error: "Send a Bearer token." });
    try {
      const payload = jwt.verify(token, jwtSecret);
      const user = await repository.findUserById(payload.sub);
      if (!user) return res.status(401).json({ error: "The token user was not found." });
      req.user = user;
      return next();
    } catch {
      return res.status(401).json({ error: "Token is invalid or expired." });
    }
  }

  app.get("/health", (_req, res) => res.json({ status: "ok" }));

  app.post("/auth/register", async (req, res, next) => {
    try {
      const errors = validateUser(req.body);
      if (errors.length) return res.status(400).json({ error: "Invalid data.", fields: errors });
      const name = req.body.name.trim();
      const email = req.body.email.trim().toLowerCase();
      if (await repository.findUserByEmail(email)) return res.status(409).json({ error: "Email is already registered." });
      const user = await repository.createUser({ name, email, passwordHash: await bcrypt.hash(req.body.password, 10) });
      return res.status(201).json({ message: "User registered successfully.", user: publicUser(user), token: createToken(user) });
    } catch (error) {
      return next(error);
    }
  });

  app.post("/auth/login", async (req, res, next) => {
    try {
      const email = typeof req.body.email === "string" ? req.body.email.trim().toLowerCase() : "";
      if (!email || typeof req.body.password !== "string") return res.status(400).json({ error: "Email and password are required." });
      const user = await repository.findUserByEmail(email);
      if (!user || !(await bcrypt.compare(req.body.password, user.passwordHash))) {
        return res.status(401).json({ error: "Email or password is incorrect." });
      }
      return res.json({ message: "Login successful.", user: publicUser(user), token: createToken(user) });
    } catch (error) {
      return next(error);
    }
  });

  app.get("/auth/me", authenticate, (req, res) => res.json({ user: publicUser(req.user) }));

  app.get("/media/genres", authenticate, async (_req, res, next) => {
    try {
      return res.json([...new Set((await repository.listMedia()).flatMap((item) => item.genres))].sort());
    } catch (error) {
      return next(error);
    }
  });

  app.get("/media", authenticate, async (req, res, next) => {
    try {
      const filteredMedia = applyFilters(await repository.listMedia(), req.query);
      const sort = SORTABLE_FIELDS.includes(req.query.sort) ? req.query.sort : "title";
      const order = req.query.order === "desc" ? -1 : 1;
      filteredMedia.sort((first, second) => (typeof first[sort] === "string" ? first[sort].localeCompare(second[sort]) : first[sort] - second[sort]) * order);
      const page = parsePositiveInteger(req.query.page, 1, Number.MAX_SAFE_INTEGER);
      const limit = parsePositiveInteger(req.query.limit, 10, 50);
      const total = filteredMedia.length;
      return res.json({
        data: filteredMedia.slice((page - 1) * limit, page * limit),
        pagination: { page, limit, total, totalPages: Math.max(1, Math.ceil(total / limit)) },
      });
    } catch (error) {
      return next(error);
    }
  });

  app.get("/media/:id", authenticate, async (req, res, next) => {
    try {
      const media = await repository.findMediaById(Number(req.params.id));
      if (!media) return res.status(404).json({ error: "Media was not found." });
      return res.json(media);
    } catch (error) {
      return next(error);
    }
  });

  app.post("/media", authenticate, async (req, res, next) => {
    try {
      const errors = validateMedia(req.body);
      if (errors.length) return res.status(400).json({ error: "Invalid data.", fields: errors });
      return res.status(201).json(await repository.createMedia(normalizeMedia(req.body)));
    } catch (error) {
      return next(error);
    }
  });

  app.put("/media/:id", authenticate, async (req, res, next) => {
    try {
      const errors = validateMedia(req.body);
      if (errors.length) return res.status(400).json({ error: "Invalid data.", fields: errors });
      const media = await repository.updateMedia(Number(req.params.id), normalizeMedia(req.body));
      if (!media) return res.status(404).json({ error: "Media was not found." });
      return res.json(media);
    } catch (error) {
      return next(error);
    }
  });

  app.delete("/media/:id", authenticate, async (req, res, next) => {
    try {
      if (!(await repository.deleteMedia(Number(req.params.id)))) return res.status(404).json({ error: "Media was not found." });
      return res.status(204).send();
    } catch (error) {
      return next(error);
    }
  });

  app.use((error, _req, res, _next) => {
    console.error(error);
    res.status(500).json({ error: "Internal server error." });
  });

  return app;
}

module.exports = { createApp };
