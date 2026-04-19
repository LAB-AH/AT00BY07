# Kronometri – (HTML + JavaScript + CSS)

Tämä projekti on yksinkertainen selainpohjainen **kronometri**, joka on toteutettu käyttäen **HTML:ää ja JavaScriptiä**.  
Sovellus on tehty osana kurssitehtävää ja sen tavoitteena on havainnollistaa **tapahtumapohjaista ohjelmointia** ja **takaisinkutsuja (callback)**.

Tehtävänannosta on suoritettu kaikki kohdat, tavoiteltava arvosana on 5.

## Toiminnallisuus

Sovellus sisältää seuraavat ominaisuudet:

- Nykyinen kellonaika näkyy oikeassa yläkulmassa
- Kronometri keskellä näkymää
- **Start / Stop** ‑painike
  - Start käynnistää ajanoton
  - Stop pysäyttää ajanoton (myös taukotilassa)
- **Pause / Resume** ‑painike
  - Pause tauottaa ajanoton
  - Resume jatkaa tauolta
- **Nollaa**‑painike
  - Nollaa mitatun ajan
  - Käytettävissä vain, kun ajanotto on pysäytetty
- Näytettävä aika muodossa `mm:ss.SS`

## Käytetyt teknologiat

- **HTML5** – käyttöliittymän rakenne
- **CSS** – käyttöliittymän ulkoasu
- **JavaScript (ES6)** – ajanoton logiikka

JavaScript-koodi on sijoitettu omaan tiedostoonsa (`timer.js`) erilleenn HTML:stä.  
Tyyleinä käytetään [Bulma](https://bulma.io) CSS-kirjastoa.

## Tapahtumapohjainen ohjelmointi

Ohjelmassa hyödynnetään tapahtumapohjaista ohjelmointia seuraavissa kohdissa:

- Painikkeiden `click`‑tapahtumat:
  - Start / Stop `startBtn`
  - Pause / Resume `pauseBtn`
  - Reset `resetBtn`

Näissä käytetään `addEventListener`‑metodia, joka reagoi käyttäjän toimintaan.

## Takaisinkutsut (callback-funktiot)

Takaisinkutsuja käytetään mm.:

- `setInterval(updateClock, 1000)`
  - Päivittää nykyisen kellonajan kerran sekunnissa
- `setInterval(tickStopwatch, 50)`
  - Päivittää kronometrin kulun 50 ms välein ajanoton ollessa käynnissä

Kommentit koodissa selittävät, missä kohdissa callbackeja käytetään ja mikä niiden tarkoitus on.

## Tiedostorakenne

```

.
├── index.html      # Käyttöliittymä
├── timer.js        # JavaScript‑logiikka
├── bulma.min.css   # Tyylit
└── README.md       # Projektin kuvaus (tämä tiedosto)

```

## Ohjelman suorittaminen

1. Lataa tai kloonaa repository
2. Avaa `index.html` selaimessa
3. Kronometri on heti käyttövalmis

Erillisiä asennuksia tai kirjastoja ei tarvita.

## Kuvakaappaukset toiminnasta

![Ajanotto valmiustilassa](/assets/kronometri.png)
_Ajanotto valmiustilassa_

![Ajanotto käynnistetty](/assets/kronometri_started.png)
_Ajanotto käynnistetty (Started)_

![Ajanotto tauolla](/assets/kronometri_paused.png)
_Ajanotto tauolla (Paused)_

![Ajanotto pysäytetty](/assets/kronometri_stopped.png)
_Ajanotto pysäytetty (Stopped)_

## Lähdekoodi

### HTML / index.html

```html
<!doctype html>
<html lang="fi" class="theme-light has-background-grey-lighter">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Kronometri</title>
    <!-- Bulma CSS Framework -->
    <link rel="stylesheet" href="bulma.min.css" />
  </head>
  <body>
    <section class="hero is-fullheight">
      <!-- Hero head: will stick at the top -->
      <div class="hero-head">
        <header class="navbar">
          <div class="container">
            <div id="navbarMenuHeroC" class="navbar-menu">
              <div class="navbar-end">
                <!-- Nykyinen kellonaika -->
                <div class="clock" id="clock">Nykyinen aika: --:--:--</div>
              </div>
            </div>
          </div>
        </header>
      </div>

      <div class="hero-body">
        <div class="container has-text-centered">
          <h1 class="title is-uppercase">Ajanotto</h1>
          <!-- Juokseva-aika muodossa mm:ss.SS -->
          <p class="title is-1" id="display">00:00.00</p>
          <!-- Toimintopainikkeet -->
          <button class="button is-primary" id="startBtn">Start</button>
          <button class="button is-info" id="pauseBtn" class="secondary" disabled>Pause</button>
          <button class="button is-danger" id="resetBtn" disabled>Reset</button>
        </div>
      </div>
    </section>

    <!-- JavaScript omassa tiedostossaan -->
    <script src="timer.js"></script>
  </body>
</html>
```

### JavaScript / timer.js

```javascript
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
  // muoto: mm:ss.SS
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

// ---- Painikkeiden päivitys ----
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
  pauseBtn.textContent = running ? "Pause" : elapsedBeforePause > 0 ? "Resume" : "Pause";

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
  // Pysäytä (EI nollaa)
  running = false;

  clearInterval(timerIntervalId);
  timerIntervalId = null;

  // Talletetaan tähän asti kertynyt aika
  const now = Date.now();
  elapsedBeforePause += now - startTimestamp;

  updateDisplay(elapsedBeforePause);
  updateButtons();
}

function pauseRunning() {
  // Tauota
  const now = Date.now();
  elapsedBeforePause += now - startTimestamp;
  running = false;

  clearInterval(timerIntervalId);
  timerIntervalId = null;

  updateDisplay(elapsedBeforePause);
  updateButtons();
}

function resumeRunning() {
  // Jatka tauolta
  running = true;
  startTimestamp = Date.now();

  timerIntervalId = setInterval(tickStopwatch, 50);

  updateButtons();
}

function resetStopwatch() {
  // Nollaus vain pysäytettynä
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
```

Tyylitiedostoa ei esitetä eikä sitä ole kommentoitu, koska se on tehtävänannon kannalta merkityksetön.
