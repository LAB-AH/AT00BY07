# Kronometri – Web‑ohjelma (HTML + JavaScript + CSS)

Tämä projekti on yksinkertainen selainpohjainen **kronometri**, joka on toteutettu käyttäen **HTML:ää ja JavaScriptiä**.  
Sovellus on tehty osana kurssitehtävää ja sen tavoitteena on havainnollistaa **tapahtumapohjaista ohjelmointia** ja **takaisinkutsuja (callback)**.

Tehtävän annosta on suoritettu kaikki kohdat.

---

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
- Näytettävä aika muodossa `mm:ss.hh`

---

## Käytetyt teknologiat

- **HTML5** – käyttöliittymän rakenne
- **CSS** – yksinkertainen ja selkeä ulkoasu
- **JavaScript (ES6)** – ajanoton logiikka

JavaScript-koodi on sijoitettu omaan tiedostoonsa (`timer.js`) erillään HTML:stä.  
Tyyleinä käytetään [Bulma](https://bulma.io) CSS-kirjastoa.

---

## Tapahtumapohjainen ohjelmointi

Ohjelmassa hyödynnetään tapahtumapohjaista ohjelmointia seuraavissa kohdissa:

- Painikkeiden `click`‑tapahtumat:
  - Start / Stop
  - Pause / Resume
  - Nollaa

Näissä käytetään `addEventListener`‑metodia, joka reagoi käyttäjän toimintaan.

---

## Takaisinkutsut (callback-funktiot)

Takaisinkutsuja käytetään mm.:

- `setInterval(updateClock, 1000)`
  - Päivittää nykyisen kellonajan kerran sekunnissa
- `setInterval(tickStopwatch, 50)`
  - Päivittää kronometrin kulun ajanoton ollessa käynnissä

Commentit koodissa selittävät, missä kohdissa callbackeja käytetään ja mikä niiden tarkoitus on.

---

## Tiedostorakenne

```

.
├── index.html      # Käyttöliittymä
├── timer.js        # JavaScript‑logiikka
├── bulma.min.css   # Tyylit
└── README.md       # Projektin kuvaus

```

---

## Käynnistys

1. Lataa tai kloonaa repository
2. Avaa `index.html` selaimessa
3. Kronometri on heti käyttövalmis

Erillisiä asennuksia tai kirjastoja ei tarvita.
