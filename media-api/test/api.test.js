const assert = require("node:assert/strict");
const bcrypt = require("bcryptjs");
const fs = require("node:fs/promises");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");
const { createApp } = require("../src/app");

async function startApi() {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), "media-api-"));
  const databasePath = path.join(directory, "database.json");
  const passwordHash = await bcrypt.hash("123456", 10);
  await fs.writeFile(databasePath, JSON.stringify({
    users: [{ id: 1, name: "Teacher", email: "teacher@media.dev", passwordHash }],
    media: [
      { id: 1, type: "movie", title: "Iron Man", year: 2008, genres: ["Action"], rating: 7.9, synopsis: "A hero wears an armored suit.", imageUrl: "https://example.com/iron-man.jpg" },
      { id: 2, type: "series", title: "Loki", year: 2021, genres: ["Action", "Fantasy"], rating: 8.2, synopsis: "A god of mischief travels across time.", imageUrl: "https://example.com/loki.jpg" }
    ]
  }));
  const server = createApp({ databasePath, jwtSecret: "test-secret" }).listen(0);
  await new Promise((resolve) => server.once("listening", resolve));
  return {
    baseUrl: `http://127.0.0.1:${server.address().port}`,
    databasePath,
    async close() {
      await new Promise((resolve) => server.close(resolve));
      await fs.rm(directory, { recursive: true, force: true });
    }
  };
}

async function request(baseUrl, route, { token, method = "GET", body } = {}) {
  const response = await fetch(`${baseUrl}${route}`, {
    method,
    headers: { ...(body ? { "Content-Type": "application/json" } : {}), ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: body ? JSON.stringify(body) : undefined
  });
  return { status: response.status, body: response.status === 204 ? null : await response.json() };
}

const newMedia = {
  type: "movie", title: "The Avengers", year: 2012, genres: ["Action", "Science Fiction"], rating: 7.7,
  synopsis: "Heroes join forces to save Earth.", imageUrl: "https://example.com/avengers.jpg"
};

test("JWT authentication, filtering, and media CRUD", async () => {
  const api = await startApi();
  try {
    assert.equal((await request(api.baseUrl, "/openapi.json")).body.openapi, "3.0.3");
    let response = await request(api.baseUrl, "/auth/register", { method: "POST", body: { name: "A", email: "invalid", password: "123" } });
    assert.equal(response.status, 400);
    response = await request(api.baseUrl, "/auth/register", { method: "POST", body: { name: "Maria", email: "maria@example.com", password: "secret123" } });
    assert.equal(response.status, 201);
    response = await request(api.baseUrl, "/auth/register", { method: "POST", body: { name: "Maria", email: "maria@example.com", password: "secret123" } });
    assert.equal(response.status, 409);
    response = await request(api.baseUrl, "/auth/login", { method: "POST", body: { email: "teacher@media.dev", password: "wrong" } });
    assert.equal(response.status, 401);
    response = await request(api.baseUrl, "/auth/login", { method: "POST", body: { email: "teacher@media.dev", password: "123456" } });
    const token = response.body.token;
    assert.equal(response.status, 200);
    assert.equal((await request(api.baseUrl, "/media")).status, 401);
    assert.equal((await request(api.baseUrl, "/media", { token: "invalid" })).status, 401);
    assert.equal((await request(api.baseUrl, "/auth/me", { token })).body.user.name, "Teacher");
    response = await request(api.baseUrl, "/media?type=series&genre=action&yearFrom=2020&minRating=8&sort=rating&order=desc", { token });
    assert.equal(response.body.pagination.total, 1);
    assert.equal(response.body.data[0].title, "Loki");
    assert.deepEqual((await request(api.baseUrl, "/media/genres", { token })).body, ["Action", "Fantasy"]);
    assert.equal((await request(api.baseUrl, "/media", { method: "POST", token, body: { title: "Incomplete" } })).status, 400);
    response = await request(api.baseUrl, "/media", { method: "POST", token, body: newMedia });
    const id = response.body.id;
    assert.equal(response.status, 201);
    assert.equal((await request(api.baseUrl, `/media/${id}`, { token })).body.title, "The Avengers");
    assert.equal((await request(api.baseUrl, `/media/${id}`, { method: "PUT", token, body: { ...newMedia, title: "Avengers" } })).body.title, "Avengers");
    assert.equal((await request(api.baseUrl, `/media/${id}`, { method: "DELETE", token })).status, 204);
    assert.equal((await request(api.baseUrl, `/media/${id}`, { token })).status, 404);
    assert.equal(JSON.parse(await fs.readFile(api.databasePath, "utf-8")).media.length, 2);
  } finally {
    await api.close();
  }
});
