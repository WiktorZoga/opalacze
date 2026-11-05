# TEAM — kto co robi (PIVOT 19:50: ROT Studio, AI UGC ad agency · merge freeze 20:30 CET)

> Ocenia się **najpierw sam GitHub**: README, historia commitów, PR-y, porządek. Pracujemy czysto i małymi krokami.

## Właściciele (NIE ruszać ich plików)

| Właściciel | Pliki |
|---|---|
| Agent **APP** | `src/`, `public/` (poza `public/memes/`), `docs/media/`, `vite.config.ts`, `index.html`, `package.json` |
| Agent **SWARM** | `README.md`, `agents/`, `generations/` (poza `gen-live*`), `docs/` (poza `docs/media/`) |
| Agent **LIVE RUN** | `generations/gen-live*/` (trwa live run Grok Bota) |

Wyjątki = tylko "sloty" opisane niżej przy każdej osobie. Wszystko inne → napisz do Wiktora.

## Zasady gałęzi

1. Gałąź ze świeżego `main`: `git checkout main && git pull --rebase origin main && git checkout -b feat/<nazwa>`
2. Małe commity z jasnym opisem (`pitch: add 45s script`). **Historia jest oceniana — bez squasha.**
3. Przed każdym pushem: `git pull --rebase origin main`.
4. PR do `main` otwórz **od razu** (może być draft). Merge **merge commitem** (nie squash, nie rebase) w ciągu ~30 min.
5. Dotykasz tylko **swojego folderu** + minimalna rejestracja (opisana niżej).
6. Bez zmian w `package-lock.json` / `package.json`, chyba że naprawdę trzeba (najpierw zapytaj).
7. **Nigdy** `git push --force` na `main`. Żadnych kluczy API w repo.

## Kolejność merge i czas

- **T-30 min: wszystko zmergowane.** Kolejność: `feat/media` → `feat/arena` → `feat/pitch`.
- Wiktor robi review/approve i merguje (merge commit). Po merge: `npm run build` na `main` musi przejść.
- **Ostatnie 20 min: tylko próby pitchu.** Zero nowych commitów poza literówkami w `pitch/`.

---

## 1. Wiktor — pitch & polish GitHuba (`feat/pitch`)

Ręcznie (tylko właściciel repo może):
- [ ] Description: `ROT Studio — the AI ad agency that rides virals. A Grok Bot swarm turns a brand brief into trend-native UGC ads in minutes.`
- [ ] Website: https://wiktorzoga.github.io/opalacze/
- [ ] Topics: `grok`, `ai-agents`, `multi-agent`, `ugc`, `adtech`, `hackathon`
- [ ] Social preview (Settings → General) — kadr z konsoli (brief → warianty UGC)
- [ ] Na koniec: nagranie ekranu (`?demo` w URL = autodemo) + voiceover

Prompt dla agenta Cursor:
```
Repo opalacze (ROT Studio). git checkout main && git pull --rebase origin main && git checkout -b feat/pitch.
Pracujesz WYŁĄCZNIE w folderze pitch/. Nie dotykaj src/, agents/, generations/, README.md, docs/.
Przeczytaj README.md i docs/pitch.md (tam jest nowy scenariusz 45 s — to jest źródło prawdy).
Stwórz:
- pitch/script-45s.md — scenariusz 45 s w tabeli: czas | ekran konsoli | co mówimy.
  Historia agencji: brief marki → Scout (trend + 87% brand fit) → Geneticist (DNA trendu) →
  Creator (AI-twórca UGC, hero: perfumy NOIR/05, "okay, this smells expensive") → Critic (#ad · AI-generated) →
  Publisher → Analyst. Potem zasięg: kawiarnia na trendzie "Your First Time in a Fancy Cafe" (10.8M) i ton Brainrot.
  Hook w 3 s: "Agencies need a week to jump on a trend. Trends live three days." Finał z CTA.
- pitch/voiceover.md — sam tekst do przeczytania (PL + EN), ~110 słów, krótkie zdania.
- pitch/qa.md — 5 pytań jury + odpowiedzi w 1-2 zdaniach (co realnie robi Grok, co jest live, co symulowane,
  ujawnianie AI/#ad, prawa do wizerunku: tylko AI-persony).
Osobny commit na każdy plik. git pull --rebase origin main, push, otwórz PR do main (merge commit, bez squasha).
```

## 2. Teammate 2 — AI twórcy UGC z Grok Imagine (`feat/media`)

Prompt dla agenta Cursor:
```
Repo opalacze (ROT Studio). git checkout main && git pull --rebase origin main && git checkout -b feat/media.
Cel: 4-6 kadrów UGC (+1-2 krótkie klipy 9:16, jeśli starczy czasu) z xAI: grok-imagine-image-2.0 / grok-imagine-video.
Klucz z env (XAI_API_KEY) — NIGDY nie zapisuj go w repo ani w skrypcie.
Wzór wywołania API: agents/bot/lib/xai.ts i agents/bot/tools/generate_media.ts (tylko czytaj, nie edytuj).
Tematy (fikcyjne marki, wyłącznie AI-persony, żadnych prawdziwych osób):
- NOIR/05 eau de parfum: młoda AI-twórczyni nagrywa TikToka telefonem, otwiera pudełko, psika, mina "okay, this smells expensive".
- Wrocławska kawiarnia w formacie "Your First Time in a Fancy Cafe": POV, za duża filiżanka, zakłopotany gość.
- 1 kadr w tonie Brainrot (ta sama marka, absurdalnie).
Styl: autentyczne UGC (telefon, światło z okna, lekki ruch), 9:16, bez logo prawdziwych marek.
Zapisz do public/memes/ugc/ (np. noir05-unboxing.jpg, noir05-spray.jpg, cafe-first-time.jpg, noir05-brainrot.jpg),
max ~500 KB każdy. Dodaj public/memes/ugc/index.json w formacie jak public/memes/grok/index.json
(id, file, kind, caption, aspectRatio, prompt, model) + pole "disclosure": "#ad · AI-generated".
Nie zmieniaj src/ — agent APP podepnie pliki. Commit na każdy kadr/grupę + osobny commit na index.json.
git pull --rebase origin main, push, PR do main (merge commit).
```

## 3. Teammate 3 — "A/B Arena" (`feat/arena`)

Prompt dla agenta Cursor:
```
Repo opalacze (ROT Studio). git checkout main && git pull --rebase origin main && git checkout -b feat/arena.
Zbuduj ekran "A/B Arena" w samodzielnym folderze src/screens/arena/:
- src/screens/arena/Arena.tsx (export function Arena) + src/screens/arena/arenaData.ts (własne dane:
  2+ pary wariantów reklamy, np. NOIR/05 wariant A "unboxing" vs B "spray reaction", każdy z hookiem, tonem,
  personą AI-twórcy i etykietą "#ad · AI-generated"; obrazy z public/memes/grok/ lub public/memes/ugc/ jeśli już są).
- Dwa warianty walczą obok siebie (karty 9:16). Widzowie głosują kliknięciami (licznik + pasek procentowy);
  po N głosach / timerze wygrywa jeden.
- Zwycięzca "idzie do Publishera": animacja framer-motion (przesunięcie do slotu "Publisher → scheduled"),
  potem nowa para. Pętla działa bez końca.
- Styl jak reszta konsoli: zobacz src/index.css, src/components/ui.tsx, src/screens/Output.tsx. Bez emoji-maskotek.
Rejestracja (tylko to poza swoim folderem, jeden osobny commit "arena: register screen"):
- src/data/dialogue.ts: dodaj 'arena' do typu ScreenId oraz wpis arena w DIALOGUE (1-2 linie, np. Critic/Analyst).
- src/App.tsx: import { Arena } from './screens/arena/Arena', wpis w TABS { id: 'arena', label: 'A/B Arena', stage: 4 },
  case 'arena': return <Arena />.
Nie zmieniaj src/demo.ts, innych ekranów, komponentów ani package.json.
Małe commity (szkielet → głosowanie → animacja → rejestracja). npm run build musi przejść.
git pull --rebase origin main, push, PR do main od razu jako draft, merge commit.
```

---

Pytania / konflikty → Wiktor. Konflikt w pliku właściciela = **cofnij swoją zmianę**, nie rozwiązuj za niego.
