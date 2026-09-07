(function () {
  "use strict";

  const STORAGE_KEY = "fruityTodoTasks";
  const RIPE_FRUITS = ["🍓", "🍊", "🍋", "🍇", "🍉", "🥝", "🍒", "🍑", "🍍"];

  const addForm = document.getElementById("addForm");
  const taskInput = document.getElementById("taskInput");
  const formHint = document.getElementById("formHint");
  const pendingList = document.getElementById("pendingList");
  const completedList = document.getElementById("completedList");
  const pendingEmpty = document.getElementById("pendingEmpty");
  const completedEmpty = document.getElementById("completedEmpty");
  const pendingCount = document.getElementById("pendingCount");
  const completedCount = document.getElementById("completedCount");
  const template = document.getElementById("taskTemplate");

  /** @type {{id:string, text:string, done:boolean, fruit:string, createdAt:number, completedAt:number|null}[]} */
  let tasks = [];

  function loadTasks() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      tasks = raw ? JSON.parse(raw) : [];
    } catch (err) {
      console.error("Could not read saved tasks, starting fresh.", err);
      tasks = [];
    }
  }

  function saveTasks() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (err) {
      console.error("Could not save tasks.", err);
    }
  }

  function randomFruit() {
    return RIPE_FRUITS[Math.floor(Math.random() * RIPE_FRUITS.length)];
  }

  function formatTime(ts) {
    if (!ts) return "";
    const d = new Date(ts);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  function showHint(message) {
    formHint.textContent = message;
    if (message) {
      setTimeout(() => {
        if (formHint.textContent === message) formHint.textContent = "";
      }, 2200);
    }
  }

  function addTask(text) {
    const trimmed = text.trim();
    if (!trimmed) {
      showHint("Type something to plant a task first! 🌱");
      return;
    }
    tasks.unshift({
      id: crypto.randomUUID
        ? crypto.randomUUID()
        : String(Date.now() + Math.random()),
      text: trimmed,
      done: false,
      fruit: randomFruit(),
      createdAt: Date.now(),
      completedAt: null,
    });
    saveTasks();
    render(true);
  }

  function toggleTask(id) {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;
    task.done = !task.done;
    task.completedAt = task.done ? Date.now() : null;
    saveTasks();
    render(false, task.done ? id : null);
  }

  function deleteTask(id) {
    const li = document.querySelector(`[data-id="${id}"]`);
    if (li) {
      li.classList.add("is-leaving");
      setTimeout(() => {
        tasks = tasks.filter((t) => t.id !== id);
        saveTasks();
        render();
      }, 220);
    } else {
      tasks = tasks.filter((t) => t.id !== id);
      saveTasks();
      render();
    }
  }

  function startEdit(id) {
    const li = document.querySelector(`[data-id="${id}"]`);
    if (!li) return;
    const textEl = li.querySelector(".task-text");
    const input = li.querySelector(".task-edit-input");
    const editBtn = li.querySelector(".edit-btn");
    const saveBtn = li.querySelector(".save-btn");

    input.value = textEl.textContent;
    textEl.hidden = true;
    input.hidden = false;
    editBtn.hidden = true;
    saveBtn.hidden = false;
    input.focus();
    input.select();
  }

  function commitEdit(id) {
    const li = document.querySelector(`[data-id="${id}"]`);
    if (!li) return;
    const input = li.querySelector(".task-edit-input");
    const newText = input.value.trim();
    const task = tasks.find((t) => t.id === id);
    if (task && newText) {
      task.text = newText;
      saveTasks();
    }
    render();
  }

  function spawnConfetti(originEl) {
    const rect = originEl.getBoundingClientRect();
    const emojis = ["✨", "🎉", "🍬", "💖", "⭐"];
    for (let i = 0; i < 8; i++) {
      const piece = document.createElement("span");
      piece.className = "confetti-piece";
      piece.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      piece.style.left = `${rect.left + rect.width / 2}px`;
      piece.style.top = `${rect.top + rect.height / 2}px`;
      const angle = Math.random() * Math.PI * 2;
      const distance = 40 + Math.random() * 50;
      const x = Math.cos(angle) * distance;
      const y = Math.sin(angle) * distance - 20;
      piece.style.setProperty("--confetti-end", `translate(${x}px, ${y}px)`);
      document.body.appendChild(piece);
      setTimeout(() => piece.remove(), 950);
    }
  }

  function buildTaskItem(task) {
    const node = template.content.firstElementChild.cloneNode(true);
    node.dataset.id = task.id;
    if (task.done) node.classList.add("is-done");

    const fruitIcon = node.querySelector(".fruit-icon");
    fruitIcon.textContent = task.done ? task.fruit : "🌱";

    const textEl = node.querySelector(".task-text");
    textEl.textContent = task.text;

    const timeEl = node.querySelector(".task-timestamp");
    timeEl.textContent = task.done
      ? `Harvested at ${formatTime(task.completedAt)}`
      : `Planted at ${formatTime(task.createdAt)}`;

    const toggleBtn = node.querySelector(".fruit-toggle");
    toggleBtn.addEventListener("click", () => {
      const willBeDone = !task.done;
      toggleTask(task.id);
      if (willBeDone) {
        // Confetti fires after re-render, so grab the fresh element
        requestAnimationFrame(() => {
          const freshBtn = document.querySelector(
            `[data-id="${task.id}"] .fruit-toggle`,
          );
          if (freshBtn) {
            freshBtn.classList.add("just-grew");
            spawnConfetti(freshBtn);
          }
        });
      }
    });

    node
      .querySelector(".edit-btn")
      .addEventListener("click", () => startEdit(task.id));
    node
      .querySelector(".save-btn")
      .addEventListener("click", () => commitEdit(task.id));
    node.querySelector(".task-edit-input").addEventListener("keydown", (e) => {
      if (e.key === "Enter") commitEdit(task.id);
      if (e.key === "Escape") render();
    });
    node
      .querySelector(".delete-btn")
      .addEventListener("click", () => deleteTask(task.id));

    return node;
  }

  function render(justAdded, justCompletedId) {
    const pending = tasks.filter((t) => !t.done);
    const completed = tasks.filter((t) => t.done);

    pendingList.innerHTML = "";
    completedList.innerHTML = "";

    pending.forEach((t) => pendingList.appendChild(buildTaskItem(t)));
    completed.forEach((t) => completedList.appendChild(buildTaskItem(t)));

    pendingEmpty.style.display = pending.length ? "none" : "block";
    completedEmpty.style.display = completed.length ? "none" : "block";

    pendingCount.textContent = `${pending.length} pending`;
    completedCount.textContent = `${completed.length} completed`;

    if (justCompletedId) {
      const btn = document.querySelector(
        `[data-id="${justCompletedId}"] .fruit-toggle`,
      );
      if (btn) btn.classList.add("just-grew");
    }
  }

  addForm.addEventListener("submit", (e) => {
    e.preventDefault();
    addTask(taskInput.value);
    taskInput.value = "";
    taskInput.focus();
  });

  loadTasks();
  render();
})();
