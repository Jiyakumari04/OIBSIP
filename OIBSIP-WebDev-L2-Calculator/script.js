(function () {
  "use strict";

  const displayMain = document.getElementById("displayMain");
  const displaySecondary = document.getElementById("displaySecondary");
  const tape = document.getElementById("tape");
  const tapeEmpty = document.getElementById("tapeEmpty");
  const keypad = document.getElementById("keypad");

  const MAX_DIGITS = 14;

  // Calculator state
  let current = "0"; // string shown on the main display
  let previous = null; // number carried over from the last operation
  let operator = null; // pending operator symbol
  let overwrite = true; // next digit press should replace current display
  let hasError = false;

  function formatNumber(num) {
    if (!isFinite(num)) return "Error";
    // Avoid floating point artifacts like 0.1 + 0.2 = 0.30000000000000004
    const rounded = Math.round((num + Number.EPSILON) * 1e10) / 1e10;
    return rounded.toString();
  }

  function updateDisplay() {
    displayMain.textContent = current;
    displayMain.classList.toggle("is-error", hasError);
    displaySecondary.textContent =
      previous !== null && operator
        ? `${formatNumber(previous)} ${operator}`
        : "";
  }

  function addTapeLine(expression, result) {
    tapeEmpty.remove();
    const line = document.createElement("p");
    line.className = "tape-line";
    line.innerHTML = `<span>${expression}</span><span class="tape-result">${result}</span>`;
    tape.appendChild(line);
    tape.scrollTop = tape.scrollHeight;
  }

  function compute(a, op, b) {
    switch (op) {
      case "+":
        return a + b;
      case "-":
        return a - b;
      case "*":
        return a * b;
      case "÷":
        if (b === 0) return NaN;
        return a / b;
      default:
        return b;
    }
  }

  function inputDigit(digit) {
    if (hasError) resetAfterError();

    if (overwrite) {
      current = digit;
      overwrite = false;
    } else {
      if (current.replace("-", "").replace(".", "").length >= MAX_DIGITS)
        return;
      current = current === "0" ? digit : current + digit;
    }
    updateDisplay();
  }

  function inputDecimal() {
    if (hasError) resetAfterError();

    if (overwrite) {
      current = "0.";
      overwrite = false;
    } else if (!current.includes(".")) {
      current += ".";
    }
    updateDisplay();
  }

  function chooseOperator(op) {
    if (hasError) resetAfterError();

    const value = parseFloat(current);

    if (previous !== null && operator && !overwrite) {
      // Chain: resolve the pending operation before starting the next one
      const result = compute(previous, operator, value);
      if (operator === "÷" && value === 0) {
        showDivisionByZero();
        return;
      }
      addTapeLine(
        `${formatNumber(previous)} ${operator} ${formatNumber(value)}`,
        formatNumber(result),
      );
      previous = result;
    } else {
      previous = value;
    }

    operator = op;
    overwrite = true;
    updateDisplay();
  }

  function showDivisionByZero() {
    hasError = true;
    current = "Cannot divide by zero";
    operator = null;
    previous = null;
    overwrite = true;
    updateDisplay();
  }

  function resetAfterError() {
    hasError = false;
    current = "0";
  }

  function equals() {
    if (hasError) {
      resetAfterError();
      updateDisplay();
      return;
    }
    if (operator === null || previous === null) return;

    const value = parseFloat(current);

    if (operator === "÷" && value === 0) {
      showDivisionByZero();
      return;
    }

    const result = compute(previous, operator, value);
    addTapeLine(
      `${formatNumber(previous)} ${operator} ${formatNumber(value)}`,
      formatNumber(result),
    );

    current = formatNumber(result);
    previous = null;
    operator = null;
    overwrite = true;
    updateDisplay();
  }

  function clearAll() {
    hasError = false;
    current = "0";
    previous = null;
    operator = null;
    overwrite = true;
    updateDisplay();
  }

  function backspace() {
    if (hasError) {
      resetAfterError();
      updateDisplay();
      return;
    }
    if (overwrite) return; // nothing to erase from a fresh operand
    current = current.length > 1 ? current.slice(0, -1) : "0";
    if (current === "-") current = "0";
    updateDisplay();
  }

  function percent() {
    if (hasError) resetAfterError();
    const value = parseFloat(current) / 100;
    current = formatNumber(value);
    updateDisplay();
  }

  keypad.addEventListener("click", (event) => {
    const btn = event.target.closest(".key");
    if (!btn) return;

    const action = btn.dataset.action;

    switch (action) {
      case "num":
        inputDigit(btn.dataset.num);
        break;
      case "decimal":
        inputDecimal();
        break;
      case "op":
        chooseOperator(btn.dataset.op);
        break;
      case "equals":
        equals();
        break;
      case "clear":
        clearAll();
        break;
      case "backspace":
        backspace();
        break;
      case "percent":
        percent();
        break;
    }
  });

  // Keyboard support (bonus usability, does not replace click handling)
  window.addEventListener("keydown", (event) => {
    if (event.key >= "0" && event.key <= "9") inputDigit(event.key);
    else if (event.key === ".") inputDecimal();
    else if (event.key === "+") chooseOperator("+");
    else if (event.key === "-") chooseOperator("−");
    else if (event.key === "*") chooseOperator("×");
    else if (event.key === "/") {
      event.preventDefault();
      chooseOperator("÷");
    } else if (event.key === "Enter" || event.key === "=") equals();
    else if (event.key === "Backspace") backspace();
    else if (event.key === "Escape") clearAll();
  });

  updateDisplay();
})();
