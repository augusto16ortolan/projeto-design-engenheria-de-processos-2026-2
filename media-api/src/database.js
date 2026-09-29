const fs = require("node:fs/promises");
const path = require("node:path");

function nextId(items) {
  return items.reduce((highestId, item) => Math.max(highestId, item.id), 0) + 1;
}

function createRepository(filePath) {
  async function readDatabase() {
    return JSON.parse(await fs.readFile(filePath, "utf-8"));
  }

  async function writeDatabase(database) {
    await fs.writeFile(filePath, `${JSON.stringify(database, null, 2)}\n`);
  }

  return {
    async listMedia() {
      return (await readDatabase()).media;
    },
    async findMediaById(id) {
      return (await readDatabase()).media.find((item) => item.id === id);
    },
    async createMedia(media) {
      const database = await readDatabase();
      const newMedia = { id: nextId(database.media), ...media };
      database.media.push(newMedia);
      await writeDatabase(database);
      return newMedia;
    },
    async updateMedia(id, updatedMedia) {
      const database = await readDatabase();
      const index = database.media.findIndex((item) => item.id === id);
      if (index === -1) return null;
      const media = { id, ...updatedMedia };
      database.media[index] = media;
      await writeDatabase(database);
      return media;
    },
    async deleteMedia(id) {
      const database = await readDatabase();
      const index = database.media.findIndex((item) => item.id === id);
      if (index === -1) return false;
      database.media.splice(index, 1);
      await writeDatabase(database);
      return true;
    },
    async findUserByEmail(email) {
      return (await readDatabase()).users.find((user) => user.email === email);
    },
    async findUserById(id) {
      return (await readDatabase()).users.find((user) => user.id === id);
    },
    async createUser(user) {
      const database = await readDatabase();
      const newUser = { id: nextId(database.users), ...user };
      database.users.push(newUser);
      await writeDatabase(database);
      return newUser;
    },
  };
}

function defaultDatabasePath() {
  return path.resolve(__dirname, "..", "database.json");
}

module.exports = { createRepository, defaultDatabasePath };
