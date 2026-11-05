# TEAM — kto co robi (hackathon, ostatnie ~1h30)

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
- [ ] Description: `ROT BOT — Meme Genome Lab: swarm agentów Groka, który hoduje memy. BRANDROT: Turn any brand into brainrot.`
- [ ] Website: link do GH Pages
- [ ] Topics: `grok`, `ai-agents`, `multi-agent`, `hackathon`, `memes`
- [ ] Social preview (Settings → General) — kadr z ekranu BRANDROT albo Krasnal CEO
- [ ] Przypiąć repo na profilu
- [ ] Na koniec: nagranie ekranu (`?demo` w URL = autodemo) + voiceover

Prompt dla agenta Cursor:
```
Repo opalacze (ROT BOT). git checkout main && git pull --rebase origin main && git checkout -b feat/pitch.
Pracujesz WYŁĄCZNIE w nowym folderze pitch/. Nie dotykaj src/, agents/, generations/, README.md, docs/.
Przeczytaj README.md, agents/AGENTS.md, src/data/agents.ts, src/data/brands.ts i src/demo.ts (kolejność ekranów demo).
Stwórz:
- pitch/script-45s.md — scenariusz 45 s w tabeli: czas | ekran aplikacji (RADAR, GENOME, BREED, STUDIO, PUBLISH, TREE, BRANDROT) | co mówimy.
  Wizja: Meme Genome Lab — memy mają genom, krzyżują się i ewoluują; swarm agentów-maskotek Groka
  (scout, geneticist, mutator, critic, publisher, analyst); Krasnal CEO jako twarz; finał BRANDROT
  "Turn any brand into brainrot". Hook w pierwszych 3 s, finał z wyraźnym CTA.
- pitch/voiceover.md — sam tekst do przeczytania (PL + EN), ~110 słów, krótkie zdania.
- pitch/qa.md — 5 pytań jury + odpowiedzi w 1-2 zdaniach (co realnie robi Grok, co jest live, co nagrane).
Osobny commit na każdy plik. git pull --rebase origin main, push, otwórz PR do main (merge commit, bez squasha).
```

## 2. Teammate 2 — prawdziwe media z Grok Imagine (`feat/media`)

Prompt dla agenta Cursor:
```
Repo opalacze (ROT BOT). git checkout main && git pull --rebase origin main && git checkout -b feat/media.
Cel: 4-6 prawdziwych obrazów (+1-2 krótkie wideo, jeśli starczy czasu) z xAI, model grok-imagine-image-2.0.
Klucz bierz z env (XAI_API_KEY) — NIGDY nie zapisuj go w repo ani w skrypcie.
Zobacz agents/bot/lib/xai.ts i agents/bot/tools/generate_media.ts jako wzór wywołania API (tylko czytaj, nie edytuj).
Tematy: Krasnal CEO (wrocławski krasnal w garniturze, pitch dla VC), Corporate Pigeon,
Sigma Capybara, mem BRANDROT o kebabie. Styl: ostry, meme-owy, czytelny w kwadracie.
Zapisz pliki do public/memes/ (np. krasnal-ceo.png, pigeon.png, capybara.png, kebab-brandrot.png),
max ~500 KB każdy (zmniejsz jeśli trzeba). Dodaj public/memes/media.json: [{file, memeId, prompt, model}].
Jedyna dozwolona zmiana kodu: pole img w src/data/memes.ts, np. img: '/memes/pigeon.png'
dla istniejących id: krasnal, pigeon, capybara (+ ewentualnie krasnalAlt). Nic więcej w src/.
Jeśli vite.config.ts ma base (GH Pages), użyj ścieżki zgodnej z base (sprawdź, nie zmieniaj configu).
Commit na każdy obraz/grupę + osobny commit na media.json i na mapowanie. Sprawdź npm run build.
git pull --rebase origin main, push, PR do main (merge commit).
```

## 3. Teammate 3 — nowy ekran "Evolution Arena" (`feat/arena`)

Prompt dla agenta Cursor:
```
Repo opalacze (ROT BOT). git checkout main && git pull --rebase origin main && git checkout -b feat/arena.
Zbuduj ekran "Evolution Arena" w samodzielnym folderze src/screens/arena/:
- src/screens/arena/Arena.tsx (export function Arena) + src/screens/arena/arenaData.ts (własne dane).
- Dwa memy walczą (użyj MemeCard z src/components/MemeCard.tsx i memów z src/data/memes.ts — tylko import).
- Publiczność głosuje kliknięciami (licznik + pasek procentowy), po N głosach / timerze wygrywa jeden.
- Zwycięzca zostaje rodzicem kolejnej generacji: animacja framer-motion (jak w src/screens/Breeding.tsx),
  pojawia się "GEN +1" i nowy pretendent. Pętla działa bez końca.
- Styl jak reszta: zobacz src/index.css, src/screens/Breeding.tsx, src/components/Mascot.tsx.
Rejestracja (tylko to poza swoim folderem, jeden osobny commit "arena: register screen"):
- src/data/dialogue.ts: dodaj 'arena' do typu ScreenId oraz wpis arena: [...] w DIALOGUE (1-2 linie dialogu).
- src/App.tsx: import { Arena } from './screens/arena/Arena', wpis w TABS { id: 'arena', label: 'ARENA', stage: 2 },
  case 'arena': return <Arena />.
Nie zmieniaj src/demo.ts, innych ekranów, komponentów ani package.json.
Małe commity (szkielet → głosowanie → animacja → rejestracja). npm run build musi przejść.
git pull --rebase origin main, push, PR do main od razu jako draft, merge commit.
```

---

Pytania / konflikty → Wiktor. Konflikt w pliku właściciela = **cofnij swoją zmianę**, nie rozwiązuj za niego.
