import mockDatabase from "../data/mockDatabase.json";

let users = mockDatabase.users.map((user) => ({ ...user }));
let works = mockDatabase.works.map((work) => ({ ...work }));

function cloneWork(work) {
  return { ...work };
}

export function findUserByEmail(email) {
  return users.find((user) => user.email === email.toLowerCase());
}

export function addUser({ name, email, password }) {
  const user = {
    id: `user-${Date.now()}`,
    name,
    email: email.toLowerCase(),
    password,
  };
  users = [...users, user];
  const { password: _password, ...publicUser } = user;
  return publicUser;
}

export function listWorksByUser(userId, { type, status } = {}) {
  return works
    .filter((work) => work.userId === userId)
    .filter((work) => !type || work.type === type)
    .filter((work) => !status || work.status === status)
    .sort((first, second) => first.title.localeCompare(second.title, "pt-BR"))
    .map(cloneWork);
}

export function findWorkById(id, userId) {
  const work = works.find((item) => item.id === id && item.userId === userId);
  return work ? cloneWork(work) : null;
}

export function addWork(work) {
  const newWork = { ...work, id: `work-${Date.now()}` };
  works = [...works, newWork];
  return cloneWork(newWork);
}

export function replaceWork(id, userId, updates) {
  const index = works.findIndex(
    (work) => work.id === id && work.userId === userId,
  );
  if (index === -1) return null;
  const updatedWork = { ...updates, id, userId };
  works = works.map((work, currentIndex) =>
    currentIndex === index ? updatedWork : work,
  );
  return cloneWork(updatedWork);
}

export function removeWork(id, userId) {
  const exists = works.some((work) => work.id === id && work.userId === userId);
  if (!exists) return false;
  works = works.filter((work) => work.id !== id || work.userId !== userId);
  return true;
}
