# Riptide — brief do prezentacji

Dla osoby, która robi slajdy / pitch. Stan na 5 listopada 2026, ok. 20:40 czasu polskiego.
Repo: https://github.com/WiktorZoga/opalacze · Demo: https://wiktorzoga.github.io/opalacze/

## Jedno zdanie
**Riptide to agencja reklamowa AI: rój agentów Grok Bot bierze brief marki, znajduje rosnący trend na TikToku lub X, rozkłada go na „wirusowe DNA” i w minuty produkuje reklamy UGC w formacie tego trendu.**

## Zdanie, które sprzedaje
Agencja potrzebuje tygodnia, żeby podpiąć markę pod trend. Trend żyje trzy dni. My robimy to w minuty i uczymy się z wyników.

## Co to jest (i czym nie jest)
- Produkt: **Riptide**, „the AI ad agency that rides virals”.
- Silnik: rój **Grok Botów** (oficjalne SDK `@grok/agent-sdk`, model grok-4.7). „ROT BOT” to kryptonim z fazy R&D, widać go w historii commitów i autorach commitów. Nie używaj tej nazwy na slajdach.
- Brainrot to **jeden z tonów** do wyboru (UGC / Polished ad / Brainrot), nie cały produkt. Pokazujemy go jako dowód zasięgu: od eleganckiej reklamy perfum po absurd.
- To NIE jest generator memów. To system, który podpina markę pod prawdziwe virale.

## Jak działa (6 agentów, w tej kolejności)
1. **Scout** — znajduje rosnące trendy na TikToku i X i liczy dopasowanie do marki (np. „87% fit”).
2. **Geneticist** — rozkłada trend na wirusowe DNA: hook, format, tempo, styl napisów, i wskazuje, gdzie wpleść produkt.
3. **Creator** — wybiera AI-twórcę (personę), pisze scenariusz i renderuje warianty A/B w formacie 9:16.
4. **Critic** — sprawdza wierność trendowi, bezpieczeństwo marki i to, czy jest oznaczenie „#ad · AI-generated”. Potrafi odrzucić i odesłać do poprawki.
5. **Publisher** — planuje publikację na TikToku / X / Reels.
6. **Analyst** — czyta wyniki (hook rate, czas oglądania, CTR) i zasila następną wersję.

Każdy agent **commituje swoją pracę pod własnym nazwiskiem**. Historia gita jest drzewem genealogicznym kampanii. To jeden z punktów oceny.

## Co pokazać na żywo (kolejność)
1. Demo: https://wiktorzoga.github.io/opalacze/ (jasny, pełnoekranowy styl agencji).
2. **„Watch the swarm”**: graf agentów i oś przekazań z prawdziwego przebiegu (cytaty agentów, hashe commitów).
3. **„The ads”**: ściana grających reklam UGC. Główna bohaterka to **Maja** z perfumami **NOIR/05** (marka wymyślona): unboxing, „get ready with me”, kolejne scenki. Do tego **Ren Hale** z prawdziwego przebiegu na żywo.
4. Ton **Brainrot** jako kontrast: kapibara w szlafroku psikająca perfumy (i nowy klip, jeśli zdąży wejść).
5. Drugi brief: kawiarnia z Wrocławia podpięta pod prawdziwy viral „Your First Time in a Fancy Cafe” (10,8 mln wyświetleń).

## Dwa prawdziwe przebiegi (najmocniejszy dowód, linkuj)
- **gen-live-002, perfumy NOIR/05** (19:52–20:00, grok-4.7, 4167 zdarzeń, 5 przekazań):
  trend „Why Would I Deceive You?” z dopasowaniem 84%, persona AI „Ren Hale”,
  krytyk zatwierdził od razu (9/9/10/10), prawdziwy klip Grok Imagine.
  https://github.com/WiktorZoga/opalacze/tree/main/generations/gen-live-002
- **gen-live-001, przebieg R&D** (19:07–19:13, 2552 zdarzenia): krytyk najpierw odrzucił („absolutely not”), potem zatwierdził. Dobry moment narracyjny: system sam się poprawia.
  https://github.com/WiktorZoga/opalacze/tree/main/generations/gen-live-001

Cytat zamykający (Overlord, z prawdziwego przebiegu):
„Eight arms, one bottle, zero polish. We don't follow trends. We mutate them.”

## Co jest prawdziwe, a co symulowane (mów wprost, jury czyta repo)
- Prawdziwe: oba przebiegi na żywo, wyszukiwanie trendów, klipy i obrazki z Grok Imagine, definicje agentów w `agents/` (przechodzą walidację SDK), commity podpisane przez agentów, virale z TikToka (oficjalne embedy, 2–17 mln wyświetleń, ostatnie tygodnie).
- Symulowane i tak oznaczone: metryki (hook rate, CTR), publikacja na platformach, część kampanii (kawiarnia, kebab) jako powtórki.
- Uczciwa gwiazdka: w przebiegu perfum live search na X nic nie zwrócił, więc Scout wziął trend z zapisanej listy prawdziwych trendów. Jest to napisane w repo.
- Wszystkie twarze to persony AI, każda reklama ma „#ad · AI-generated”. Żadnych prawdziwych ludzi.

## Scenariusz 45 sekund
| Czas | Ekran | Tekst |
|---|---|---|
| 0–8 s | Ściana reklam | „Agencje potrzebują tygodnia. Trend żyje trzy dni.” |
| 8–20 s | Watch the swarm | „Brief marki wchodzi do roju Grok Botów: trend, DNA, scenariusz, krytyk.” |
| 20–35 s | The ads, Maja + Ren Hale | „Wychodzi reklama UGC w formacie wirala. Krytyk odrzuca słabe, puszcza dobre.” |
| 35–45 s | Brainrot + kawiarnia | „Od perfum po brainrot. Riptide: ride the viral before it's gone.” |

Pełny skrypt lektora: https://github.com/WiktorZoga/opalacze/blob/main/docs/pitch.md

## Za co nas oceniają (i gdzie to widać)
1. **Prawdziwe użycie Grok Bota** — `agents/`, dwa przebiegi na żywo, screeny z wnętrza Grok Bota w README („Inside Grok Bot”).
2. **Rój agentów** — 6 ról, przekazywanie pracy, widoczne w aplikacji i w pliku trace (tysiące zdarzeń).
3. **Widoczna historia commitów** — dziesiątki commitów podpisanych przez agentów (Scout, Geneticist, Creator, Critic…); `git log --graph` czyta się jak rodowód kampanii.

## Integracje (mów o nich, nie obiecuj, że działają)
Działają: Grok Bot, Grok Imagine (obraz i wideo), wyszukiwanie X.
W roadmapie: Higgsfield, TikTok Creative Center, Meta/TikTok Ads, ElevenLabs.

## Czego unikać na slajdach
- Nazwy „ROT BOT” i krasnali (to historia R&D, jest w repo, nie w pitchu).
- Obietnic, że publikujemy sami na TikToku (nie publikujemy).
- Pokazywania metryk bez słowa „symulacja”.
- Cudzych filmików jako naszych (embedujemy je jako źródła trendów, nasze reklamy są generowane).
