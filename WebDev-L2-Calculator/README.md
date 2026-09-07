

**OIBSIP Track:** Web Development & Designing — Level 2, Task 1 (Calculator)

## About
A browser-based calculator styled as a vintage mechanical adding machine,
complete with a scrolling "paper tape" that logs every completed calculation.

## Tech Stack
- HTML5
- CSS3 (CSS Grid for the keypad)
- JavaScript (Vanilla — no `eval()`, no inline `onclick`)

## Features
- Display screen showing current input and, above it, the pending operation
- Number buttons 0–9 and a decimal point
- Operator buttons: + − × ÷
- Equals button evaluates the expression
- Clear (C) resets the machine
- Backspace (⌫) removes the last entered character
- Division-by-zero shows a friendly "Cannot divide by zero" message instead of crashing
- Operator chaining — e.g. `5 + 3 × 2` resolves sequentially without a full reset
- CSS Grid button layout
- All interactions wired with `addEventListener` (event delegation on the keypad container)
- Bonus: full keyboard support, a `%` key, and a scrolling calculation history ("tape")

## How to view
Open `index.html` in any browser. No build step or server required.

## Folder placement in OIBSIP repo
```
OIBSIP/WebDev-L2-Calculator/
├── index.html
├── style.css
├── script.js
├── README.md
└── screenshots/   (add your own before pushing)
```

