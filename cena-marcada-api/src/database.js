const { randomUUID } = require("node:crypto");
const fs = require("node:fs/promises");
const path = require("node:path");

function createRepository(filePath) {
  async function readDatabase() {
    return JSON.parse(await fs.readFile(filePath, "utf-8"));
  }

  async function writeDatabase(database) {
    await fs.writeFile(filePath, `${JSON.stringify(database, null, 2)}\n`);
  }

  return {
    async listWorksByUserId(userId) {
      return (await readDatabase()).works.filter((work) => work.userId === userId);
    },
    async findWorkByIdAndUserId(id, userId) {
      return (await readDatabase()).works.find((work) => work.id === id && work.userId === userId);
    },
    async createWork(work) {
      const database = await readDatabase();
      const newWork = { id: randomUUID(), ...work };
      database.works.push(newWork);
      await writeDatabase(database);
      return newWork;
    },
    async updateWork(id, userId, updatedWork) {
      const database = await readDatabase();
      const index = database.works.findIndex((work) => work.id === id && work.userId === userId);
      if (index === -1) return null;
      const work = { id, userId, ...updatedWork };
      database.works[index] = work;
      await writeDatabase(database);
      return work;
    },
    async deleteWork(id, userId) {
      const database = await readDatabase();
      const index = database.works.findIndex((work) => work.id === id && work.userId === userId);
      if (index === -1) return false;
      database.works.splice(index, 1);
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
      const newUser = { id: randomUUID(), ...user };
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
