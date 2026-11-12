// Triage OpenDuet — porté / surface / abandonné (§D14, §D2).
// Vérifié mécaniquement par la suite (comptes = table, écart 0).
export type TriageVerdict = "ported" | "surface" | "abandoned";
export interface TriageItem { id: string; item: string; verdict: TriageVerdict }
export const TRIAGE: TriageItem[] = [
  { id: "yaml-agents", item: "Identité OpenDuet — openbot/examples/openduet/agents.yaml porté sur le gel openbot 0.3.3 (skin, pas application)", verdict: "ported" },
  { id: "yaml-brand", item: "Identité OpenDuet — openbot/examples/openduet/brand.yaml porté sur le gel openbot 0.3.3 (skin, pas application)", verdict: "ported" },
  { id: "yaml-channels", item: "Identité OpenDuet — openbot/examples/openduet/channels.yaml porté sur le gel openbot 0.3.3 (skin, pas application)", verdict: "ported" },
  { id: "yaml-knowledge", item: "Identité OpenDuet — openbot/examples/openduet/knowledge.yaml porté sur le gel openbot 0.3.3 (skin, pas application)", verdict: "ported" },
  { id: "yaml-model", item: "Identité OpenDuet — openbot/examples/openduet/model.yaml porté sur le gel openbot 0.3.3 (skin, pas application)", verdict: "ported" },
  { id: "yaml-skills", item: "Identité OpenDuet — openbot/examples/openduet/skills.yaml porté sur le gel openbot 0.3.3 (skin, pas application)", verdict: "ported" },
  { id: "eval-triage", item: "Éval triage (evals/triage) gardée comme fixture d'évaluation de la surface native (mesure le trait proactif), pas comme code", verdict: "ported" },
  { id: "eval-reply-chips", item: "Éval reply-chips (evals/reply-chips) gardée comme fixture d'évaluation de la surface native (mesure le trait proactif), pas comme code", verdict: "ported" },
  { id: "eval-voice", item: "Éval voice (evals/voice) gardée comme fixture d'évaluation de la surface native (mesure le trait proactif), pas comme code", verdict: "ported" },
  { id: "script-start", item: "Script scripts/start.sh re-pointé comme wrapper sur la plateforme 0.3.3 (pas sur le vendu 0.2.0)", verdict: "ported" },
  { id: "script-stop", item: "Script scripts/stop.sh re-pointé comme wrapper sur la plateforme 0.3.3 (pas sur le vendu 0.2.0)", verdict: "ported" },
  { id: "script-env", item: "Script scripts/env.sh re-pointé comme wrapper sur la plateforme 0.3.3 (pas sur le vendu 0.2.0)", verdict: "ported" },
  { id: "channels-platform", item: "Canaux web / mobile / Slack / Teams : surfaces de la plateforme, pas des applications", verdict: "surface" },
  { id: "vendu-0.2.0", item: "Vendu openbot 0.2.0 (openbot/, 2 336 fichiers) : ABANDONNÉ avec preuve — aucun fichier 0.2.0 ne survit dans le natif (H-P7-8) ; rebaser = adapter openbot deux fois à deux versions différentes", verdict: "abandoned" },
  { id: "vendu-telemetry", item: "Télémétrie du vendu 0.2.0 (openbot/server/src/telemetry.ts, desktop-telemetry.ts, desktop/TELEMETRY.md) : deux générations de télémétrie dans un seul repo — tranchées ensemble, non portées", verdict: "abandoned" },
  { id: "vendu-desktop-telemetry", item: "Desktop telemetry du vendu (ON par défaut, oss.desktop.*) : non portée", verdict: "abandoned" },
  { id: "cpk-keys", item: "Clés CPK (CPK_INTELLIGENCE_API_KEY, CPK_TELEMETRY_ID — sans elles le serveur OpenDuet refuse de démarrer, docs/telemetry.md) : absentes du natif, qui démarre sans elles", verdict: "abandoned" }
];
export function triageCounts(): { ported: number; surfaces: number; abandoned: number; total: number } {
  const ported = TRIAGE.filter((t) => t.verdict === "ported").length;
  const surfaces = TRIAGE.filter((t) => t.verdict === "surface").length;
  const abandoned = TRIAGE.filter((t) => t.verdict === "abandoned").length;
  return { ported, surfaces, abandoned, total: TRIAGE.length };
}
