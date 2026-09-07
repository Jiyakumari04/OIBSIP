# To-Do Diary 🍓

**OIBSIP Track:** Web Development & Designing — Level 2, Task 3 (To-Do Web App)

## About

A bright, diary-styled to-do list with a fruit theme: tasks start life as a
🌱 seed and "grow" into a random ripe fruit emoji once marked complete, with
a little confetti burst to celebrate. Built as a notebook page with spiral
binding, washi tape, and floating fruit decorations.

## Tech Stack

- HTML5
- CSS3 (all animation — floating fruit, wiggle, pop-in, confetti — done in
  pure `@keyframes`, no animation library)
- JavaScript (Vanilla) — used for the actual CRUD logic and persistence,
  since a to-do app needs real state management that CSS alone can't provide

## Features

- Add Task input with a "Plant it 🍒" button
- New tasks appear immediately in **Pending Tasks**
- "Mark Complete" fruit-toggle button — completed tasks move to **Completed
  Tasks** and are assigned a random ripe fruit (🍓🍊🍋🍇🍉🥝🍒🍑🍍)
- Edit button (✏️) turns a task into an inline editable field; save with 💾
  or Enter
- Delete button (🗑️) removes a task with a smooth slide-out animation
- Task count indicators: "X pending" and "Y completed" above each list
- Bonus: timestamp on every task ("Planted at…" / "Harvested at…")
- Bonus: tasks persist across page refreshes via `localStorage`
- Friendly empty-state messages for both lists
- Confetti burst animation when a task is completed
- Fully responsive (lists stack on mobile)
- Respects `prefers-reduced-motion`

## How to view

Open `index.html` in a browser. Keep `style.css` and `script.js` in the same
folder — both are linked with relative paths.

## Folder placement in OIBSIP repo

```
OIBSIP/WebDev-L2-ToDoApp/
├── index.html
├── style.css
├── script.js
├── README.md
└── screenshots/   (add your own before pushing)
```

## Notes for submission

- Screenshot the app with a mix of pending and completed tasks.
- Record the demo video per the SIP Task List workflow (2-second title card,
  then a walkthrough: add a task, edit it, complete it — watch it grow into
  a fruit — then delete one, and refresh the page to show persistence).
