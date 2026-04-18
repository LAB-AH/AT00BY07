"use strict";

/*
  Tapahtumapohjainen ohjelmointi:
  - Nappien click-tapahtumat (addEventListener)

  Takaisinkutsut (callback):
  - setInterval kutsuu annettua funktiota säännöllisesti
*/

// ---- DOM-viitteet ----
const clockEl = document.getElementById("clock");
const displayEl = document.getElementById("display");

const startBtn = document.getElementById("startBtn"); // Start <-> Stop
const pauseBtn = document.getElementById("pauseBtn");
const resetBtn = document.getElementById("resetBtn"); // Nollaa

// ---- Ajanoton tila ----
let startTimestamp = 0; // milloin käynnistettiin (ms)
let elapsedBeforePause = 0; // kertynyt aika ennen taukoa (ms)
let running = false;

let sessionStopped = false;

let timerIntervalId = null;
let clockIntervalId = null;

// ---- Apufunktiot ----
function pad2(n) {
  return String(n).padStart(2, "0");
}

function formatStopwatch(ms) {
  // muoto: mm:ss.hh
  const totalHundredths = Math.floor(ms / 10);
  const hundredths = totalHundredths % 100;

  const totalSeconds = Math.floor(totalHundredths / 100);
  const seconds = totalSeconds % 60;

  const minutes = Math.floor(totalSeconds / 60);

  return `${pad2(minutes)}:${pad2(seconds)}.${pad2(hundredths)}`;
}

function updateDisplay(ms) {
  displayEl.textContent = formatStopwatch(ms);
}

function updateButtons() {
  startBtn.disabled = false;

  // Session on "aktiivinen" jos käynnissä tai aikaa on kertynyt
  const sessionActive = running || elapsedBeforePause > 0;

  // Start2/Stop -teksti:
  startBtn.textContent = sessionActive ? "Stop" : "Start";

  // Pause/Resume disabloidaan, jos:
  // - ollaan nollatilassa (ei käynnissä eikä kertymää), TAI
  // - Stop on painettu tauolla -> sessionStopped lukitsee napin pois
  pauseBtn.disabled = (!running && elapsedBeforePause === 0) || sessionStopped;

  // Pause-napin teksti (näkyy vain kun ei ole disabloitu, mutta pidetään selkeänä)
  pauseBtn.textContent = running
    ? "Pause"
    : elapsedBeforePause > 0
      ? "Resume"
      : "Pause";

  // Nollaa vain kun EI käynnissä ja aikaa on kertynyt
  resetBtn.disabled = running || elapsedBeforePause === 0;
}

// ---- Nykyinen kellonaika ----
function updateClock() {
  const now = new Date();
  clockEl.textContent = `Nykyinen aika: ${pad2(now.getHours())}:${pad2(now.getMinutes())}:${pad2(now.getSeconds())}`;
}

// Takaisinkutsu (callback): setInterval kutsuu updateClock-funktiota 1s välein
clockIntervalId = setInterval(updateClock, 1000);
updateClock();

// ---- Kronometrin päivitys ----
function tickStopwatch() {
  // Takaisinkutsu: setInterval kutsuu tätä funktiota tiheästi
  const now = Date.now();
  const elapsed = elapsedBeforePause + (now - startTimestamp);
  updateDisplay(elapsed);
}

// ---- Ajanoton ohjausfunktiot ----
function startRunning() {
  sessionStopped = false;

  running = true;
  startTimestamp = Date.now();

  // Takaisinkutsu: tickStopwatch ajetaan 50ms välein
  timerIntervalId = setInterval(tickStopwatch, 50);

  updateButtons();
}

function stopRunning() {
  // pysäytä (EI nollaa)
  running = false;

  clearInterval(timerIntervalId);
  timerIntervalId = null;

  // talletetaan tähän asti kertynyt aika
  const now = Date.now();
  elapsedBeforePause += now - startTimestamp;

  updateDisplay(elapsedBeforePause);
  updateButtons();
}

function pauseRunning() {
  // tauota
  const now = Date.now();
  elapsedBeforePause += now - startTimestamp;
  running = false;

  clearInterval(timerIntervalId);
  timerIntervalId = null;

  updateDisplay(elapsedBeforePause);
  updateButtons();
}

function resumeRunning() {
  // jatka tauolta
  running = true;
  startTimestamp = Date.now();

  timerIntervalId = setInterval(tickStopwatch, 50);

  updateButtons();
}

function resetStopwatch() {
  // nollaa vain pysäytettynä (varmistetaan vielä tässäkin)
  if (running) return;

  sessionStopped = false;

  startTimestamp = 0;
  elapsedBeforePause = 0;

  updateDisplay(0);
  updateButtons();
}

// ---- Tapahtumapohjainen ohjelmointi: click-eventit ----

// Start <-> Stop (sama nappi)

startBtn.addEventListener("click", () => {
  // Event callback: suoritetaan, kun käyttäjä klikkaa Start/Stop-nappia

  if (running) {
    // Käynnissä -> Stop pysäyttää (ei nollaa)
    stopRunning();
    return;
  }

  if (elapsedBeforePause > 0) {
    // Tauolla -> Stop "pysäyttää session": ei jatketa eikä lisätä aikaa,
    // vain varmistetaan tila/napit (ja näyttö on jo oikein).
    sessionStopped = true;
    updateDisplay(elapsedBeforePause);
    updateButtons();
    return;
  }

  // Nollatilassa -> Start käynnistää
  startRunning();
});

// Pause / Resume
pauseBtn.addEventListener("click", () => {
  // Event callback
  if (running) {
    pauseRunning();
  } else if (elapsedBeforePause > 0) {
    resumeRunning();
  }
});

// Nollaa (vain kun pysäytetty)
resetBtn.addEventListener("click", () => {
  // Event callback
  resetStopwatch();
});

// Alkunäkymä
updateDisplay(0);
updateButtons();
