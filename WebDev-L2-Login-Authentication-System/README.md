# Bloom — Login Authentication System

**OIBSIP Track:** Web Development & Designing — Level 2, Task 4 (Login Authentication System)

## About
A three-page authentication flow — Register, Log In, and a protected
Dashboard — built entirely client-side, with a soft flower-garden theme: a
CSS-drawn blooming flower, drifting petal decorations, and a pastel pink /
lavender / butter-yellow palette. Passwords are never stored in plain text:
each one is salted and hashed with SHA-256 via the browser's native Web
Crypto API before it touches `localStorage`.

## Tech Stack (Approach A — front-end only)
- HTML5 (three pages: `index.html` = login, `register.html`, `dashboard.html`)
- CSS3 (single shared `style.css`)
- JavaScript (Vanilla) — required here, since authentication is inherently
  logic-driven: hashing, validation, session state, and route protection
  can't be done with HTML/CSS alone
- `localStorage` as the data store
- Web Crypto API (`crypto.subtle.digest`) for real SHA-256 hashing

## ⚠️ Security note (please read)
This satisfies the task's brief of using "a SHA-256 approach for
client-side," but it is a **learning exercise, not production security**:
- There's no real server — anyone with browser dev tools can read
  `localStorage` directly.
- Real systems should hash passwords **server-side** using an algorithm
  built for passwords (bcrypt, scrypt, or argon2) rather than a general
  hash like SHA-256, and should never trust the client with authentication
  decisions.
- This project still improves on a naive demo by adding a random salt per
  user before hashing, rather than hashing the raw password alone.

## Features
- **Registration page:** username, email, password, confirm password
  - Live checklist: turns green as the password satisfies "8+ characters"
    and "at least 1 number"
  - Duplicate check against both username and email
  - Show/hide password toggle
- **Login page:** username-or-email + password
  - Generic error message on failure (never reveals which field was wrong)
  - Redirects straight to the dashboard if a session already exists
- **Protected dashboard:**
  - Guarded at the top of `<head>`, before the page paints, so it can't
    flash protected content before redirecting an unauthenticated visitor
  - Shows the logged-in user's username, email, account creation time, and
    current session start time
  - Logout button clears the session and returns to the login page
- Basic validation throughout — no empty submissions, inline field errors

## How to view
Open `index.html` in a browser (it's the login page). Register an account
first, then log in. Keep `style.css`, `auth.js`, and all three HTML files in
the same folder — they're linked with relative paths.

## Folder placement in OIBSIP repo
```
OIBSIP/WebDev-L2-LoginAuth/
├── index.html        (login page)
├── register.html
├── dashboard.html
├── style.css
├── auth.js
├── README.md
