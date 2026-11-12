# aspace-openduet-adapter

Adapter A'Space pour `Amdkn/OpenDuet` — gel `f52288f` (`f52288fff5ccdbd3de428d573d9f026fce5ff480`),
version amont 0.1.0, statut amont early development, 2365 fichiers au gel.

- Bind Cordis Fiber : `be7ec832379fd1f76aa27704ae80cdf9fc9cb7c1` (blob `002690a`), re-appliqué
  verbatim sur `main` (§D8) ; l'adapter est le commit qui suit le bind.
- Skin : **OpenDuet** (skin) — proactif humain-dans-la-boucle : morning brief, Tasks, check-ins, approbations avec reprise.
- Triage : 12 portés / 1 surfaces / 4 abandonnés
  (total 17), vérifié mécaniquement par la suite.
- Gateway modèle : `http://127.0.0.1:31415/v1/chat/completions` seul, chaîne modelPool, retest 15 min.
- Computer-service : `:4100`, en-tête `x-openbot-bot-id` verbatim.
- Télémétrie : 0 émetteur ; les 5 déclencheurs §D4 sont tranchés dans
  `src/telemetry.ts`.
- Dépendance pas 6 NOMMÉE (§D9) : `/refine` conditionnel au merge de `9050a1f`.

Suite : `bun test` / `node --test` selon le `package.json` (stdlib seule).
