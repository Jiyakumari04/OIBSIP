/**
 * Bloom — shared authentication logic.
 *
 * IMPORTANT (read this before using this pattern anywhere real):
 * This is a front-end-only demo built for the OIBSIP Login Authentication
 * System task. "Users" live in the browser's localStorage, and passwords
 * are hashed client-side with the Web Crypto API's SHA-256 before storage
 * (never stored in plain text), each with a random per-user salt.
 *
 * This satisfies the task's brief ("use a SHA-256 approach for
 * client-side"), but it is NOT how you'd secure a real application —
 * there's no server, no HTTPS transport, and anyone with dev tools can
 * read localStorage directly. A production system needs a real backend,
 * a battle-tested hashing algorithm meant for passwords (bcrypt/argon2,
 * not raw SHA-256), and hashing done server-side.
 */

const USERS_KEY = "portalUsers";
const SESSION_KEY = "portalSession";

/* ---------------- Hashing helpers ---------------- */

function bufferToHex(buffer) {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function randomSalt(length = 16) {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  return bufferToHex(bytes.buffer);
}

async function sha256Hex(text) {
  const encoded = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest("SHA-256", encoded);
  return bufferToHex(digest);
}

async function hashPassword(password, salt) {
  // Salting by concatenation before hashing — simple, but far better than
  // hashing the raw password alone.
  return sha256Hex(`${salt}::${password}`);
}

/* ---------------- User storage ---------------- */

function getUsers() {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error("Could not read stored users.", err);
    return [];
  }
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function findUserByIdentifier(identifier) {
  const lower = identifier.trim().toLowerCase();
  return getUsers().find(
    (u) =>
      u.username.toLowerCase() === lower || u.email.toLowerCase() === lower,
  );
}

async function registerUser({ username, email, password }) {
  const users = getUsers();

  const duplicate = users.some(
    (u) =>
      u.username.toLowerCase() === username.trim().toLowerCase() ||
      u.email.toLowerCase() === email.trim().toLowerCase(),
  );
  if (duplicate) {
    return {
      ok: false,
      message: "An account with that username or email already exists.",
    };
  }

  const salt = randomSalt();
  const passwordHash = await hashPassword(password, salt);

  users.push({
    username: username.trim(),
    email: email.trim(),
    salt,
    passwordHash,
    createdAt: Date.now(),
  });
  saveUsers(users);

  return { ok: true };
}

async function verifyLogin({ identifier, password }) {
  const user = findUserByIdentifier(identifier);
  if (!user) {
    // Deliberately generic — never reveal whether the username/email exists.
    return { ok: false, message: "Incorrect username/email or password." };
  }

  const attemptHash = await hashPassword(password, user.salt);
  if (attemptHash !== user.passwordHash) {
    return { ok: false, message: "Incorrect username/email or password." };
  }

  return { ok: true, user };
}

/* ---------------- Session ---------------- */

function startSession(username) {
  const session = { username, loginAt: Date.now() };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

function getSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function endSession() {
  localStorage.removeItem(SESSION_KEY);
}

/* ---------------- Validation ---------------- */

function passwordMeetsRules(password) {
  return {
    length: password.length >= 8,
    hasNumber: /\d/.test(password),
  };
}

function isPasswordValid(password) {
  const rules = passwordMeetsRules(password);
  return rules.length && rules.hasNumber;
}
