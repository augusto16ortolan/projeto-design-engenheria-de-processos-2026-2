const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const swaggerUi = require("swagger-ui-express");
const { createRepository, defaultDatabasePath } = require("./database");
const openapi = require("./openapi");

const TOKEN_DURATION = "1h";
const WORK_TYPES = ["movie", "series"];
const WORK_STATUSES = ["want_to_watch", "watching", "watched"];

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

function validateWork(work) {
  const errors = [];
  if (!WORK_TYPES.includes(work.type)) errors.push("type must be movie or series");
  if (typeof work.title !== "string" || !work.title.trim()) errors.push("title is required");
  if (!WORK_STATUSES.includes(work.status)) errors.push("status must be want_to_watch, watching, or watched");
  if (work.imageUrl !== undefined && typeof work.imageUrl !== "string") errors.push("imageUrl must be a string");
  if (typeof work.imageUrl === "string" && work.imageUrl.trim() && !/^https?:\/\/.+/.test(work.imageUrl.trim())) {
    errors.push("imageUrl must start with http:// or https://");
  }
  if (work.synopsis !== undefined && typeof work.synopsis !== "string") errors.push("synopsis must be a string");
  return errors;
}

function normalizeWork(work) {
  return {
    type: work.type,
    title: work.title.trim(),
    imageUrl: work.imageUrl?.trim() || "",
    synopsis: work.synopsis?.trim() || "",
    status: work.status,
  };
}

function createApp({ databasePath = defaultDatabasePath(), jwtSecret = process.env.JWT_SECRET } = {}) {
  if (!jwtSecret) throw new Error("JWT_SECRET is not configured.");
  const repository = createRepository(databasePath);
  const app = express();

  app.use((req, res, next) => {
    res.set({
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type,Authorization",
    });
    if (req.method === "OPTIONS") return res.sendStatus(204);
    return next();
  });
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

  app.get("/works", authenticate, async (req, res, next) => {
    try {
      let works = await repository.listWorksByUserId(req.user.id);
      if (WORK_TYPES.includes(req.query.type)) works = works.filter((work) => work.type === req.query.type);
      if (WORK_STATUSES.includes(req.query.status)) works = works.filter((work) => work.status === req.query.status);
      works.sort((first, second) => first.title.localeCompare(second.title));
      return res.json({ data: works });
    } catch (error) {
      return next(error);
    }
  });

  app.get("/works/:id", authenticate, async (req, res, next) => {
    try {
      const work = await repository.findWorkByIdAndUserId(req.params.id, req.user.id);
      if (!work) return res.status(404).json({ error: "Work was not found." });
      return res.json(work);
    } catch (error) {
      return next(error);
    }
  });

  app.post("/works", authenticate, async (req, res, next) => {
    try {
      const errors = validateWork(req.body);
      if (errors.length) return res.status(400).json({ error: "Invalid data.", fields: errors });
      return res.status(201).json(await repository.createWork({ userId: req.user.id, ...normalizeWork(req.body) }));
    } catch (error) {
      return next(error);
    }
  });

  app.put("/works/:id", authenticate, async (req, res, next) => {
    try {
      const errors = validateWork(req.body);
      if (errors.length) return res.status(400).json({ error: "Invalid data.", fields: errors });
      const work = await repository.updateWork(req.params.id, req.user.id, normalizeWork(req.body));
      if (!work) return res.status(404).json({ error: "Work was not found." });
      return res.json(work);
    } catch (error) {
      return next(error);
    }
  });

  app.delete("/works/:id", authenticate, async (req, res, next) => {
    try {
      if (!(await repository.deleteWork(req.params.id, req.user.id))) return res.status(404).json({ error: "Work was not found." });
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
