const assert = require("node:assert/strict");
const bcrypt = require("bcryptjs");
const fs = require("node:fs/promises");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");
const { createApp } = require("../src/app");

const teacherId = "a4fbfb49-2d4e-4a01-8ee3-12976d0d48ed";
const otherUserId = "b7b07f01-fbd4-40c2-a3f5-e741b67144d5";

async function startApi() {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), "cena-marcada-api-"));
  const databasePath = path.join(directory, "database.json");
  const passwordHash = await bcrypt.hash("123456", 10);
  await fs.writeFile(databasePath, JSON.stringify({
    users: [
      { id: teacherId, name: "Teacher", email: "teacher@cena.dev", passwordHash },
      { id: otherUserId, name: "Other", email: "other@cena.dev", passwordHash },
    ],
    works: [
      { id: "18b4c5cb-bc22-4c01-ae44-5a9ab5643bac", userId: teacherId, type: "movie", title: "Duna", imageUrl: "", synopsis: "Arrakis", status: "watched" },
      { id: "f4ea8960-9ef0-485b-8302-28b12169c3aa", userId: teacherId, type: "series", title: "The Last of Us", imageUrl: "", synopsis: "", status: "want_to_watch" },
      { id: "f91d9e23-4496-47bd-845d-03ee3d4d70ed", userId: otherUserId, type: "movie", title: "Private Work", imageUrl: "", synopsis: "", status: "watching" },
    ],
  }));
  const server = createApp({ databasePath, jwtSecret: "test-secret" }).listen(0, "127.0.0.1");
  await new Promise((resolve) => server.once("listening", resolve));
  return {
    baseUrl: `http://127.0.0.1:${server.address().port}`,
    databasePath,
    async close() {
      await new Promise((resolve) => server.close(resolve));
      await fs.rm(directory, { recursive: true, force: true });
    },
  };
}

async function request(baseUrl, route, { token, method = "GET", body } = {}) {
  const response = await fetch(`${baseUrl}${route}`, {
    method,
    headers: { ...(body ? { "Content-Type": "application/json" } : {}), ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  });
  return { status: response.status, headers: response.headers, body: response.status === 204 ? null : await response.json() };
}

test("authentication, private works, filters, and CRUD", async () => {
  const api = await startApi();
  try {
    assert.equal((await request(api.baseUrl, "/openapi.json")).body.info.title, "Cena Marcada API");
    assert.equal((await request(api.baseUrl, "/works")).status, 401);
    assert.equal((await request(api.baseUrl, "/works", { token: "invalid" })).status, 401);

    let response = await request(api.baseUrl, "/auth/register", { method: "POST", body: { name: "A", email: "invalid", password: "123" } });
    assert.equal(response.status, 400);
    response = await request(api.baseUrl, "/auth/register", { method: "POST", body: { name: "Maria", email: "maria@example.com", password: "secret123" } });
    assert.equal(response.status, 201);
    assert.match(response.body.user.id, /^[0-9a-f-]{36}$/);
    assert.equal(response.body.token.length > 0, true);
    assert.equal((await request(api.baseUrl, "/auth/register", { method: "POST", body: { name: "Maria", email: "maria@example.com", password: "secret123" } })).status, 409);

    response = await request(api.baseUrl, "/auth/login", { method: "POST", body: { email: "teacher@cena.dev", password: "wrong" } });
    assert.equal(response.status, 401);
    response = await request(api.baseUrl, "/auth/login", { method: "POST", body: { email: "teacher@cena.dev", password: "123456" } });
    assert.equal(response.status, 200);
    const token = response.body.token;
    assert.equal((await request(api.baseUrl, "/auth/me", { token })).body.user.id, teacherId);

    response = await request(api.baseUrl, "/works?type=series&status=want_to_watch", { token });
    assert.deepEqual(response.body.data.map((work) => work.title), ["The Last of Us"]);
    assert.equal(response.body.data[0].userId, teacherId);
    const privateWorkRoute = "/works/f91d9e23-4496-47bd-845d-03ee3d4d70ed";
    assert.equal((await request(api.baseUrl, privateWorkRoute, { token })).status, 404);
    assert.equal((await request(api.baseUrl, privateWorkRoute, {
      method: "PUT",
      token,
      body: { type: "movie", title: "Attempt", imageUrl: "", synopsis: "", status: "watched" },
    })).status, 404);
    assert.equal((await request(api.baseUrl, privateWorkRoute, { method: "DELETE", token })).status, 404);

    const newWork = { type: "movie", title: "A Chegada", imageUrl: "", synopsis: "Contato com alienígenas.", status: "watching", userId: otherUserId };
    assert.equal((await request(api.baseUrl, "/works", { method: "POST", token, body: { title: "Incomplete" } })).status, 400);
    response = await request(api.baseUrl, "/works", { method: "POST", token, body: newWork });
    assert.equal(response.status, 201);
    assert.match(response.body.id, /^[0-9a-f-]{36}$/);
    assert.equal(response.body.userId, teacherId);
    assert.equal(response.body.imageUrl, "");
    const id = response.body.id;
    assert.equal((await request(api.baseUrl, `/works/${id}`, { method: "PUT", token, body: { ...newWork, title: "A Chegada (editado)" } })).body.title, "A Chegada (editado)");
    assert.equal((await request(api.baseUrl, `/works/${id}`, { method: "DELETE", token })).status, 204);
    assert.equal((await request(api.baseUrl, `/works/${id}`, { token })).status, 404);
    assert.equal((await request(api.baseUrl, "/works", { method: "OPTIONS" })).headers.get("access-control-allow-origin"), "*");
  } finally {
    await api.close();
  }
});
