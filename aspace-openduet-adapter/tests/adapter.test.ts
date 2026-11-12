// Suite de l'adapter OpenDuet — H-M1..M7 (stdlib seule, node:test).
import { test } from "node:test";
import assert from "node:assert";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  PINNED_GEL, PINNED_GEL_FULL, PINNED_BIND, isGelCommit, verifyGelLineage,
} from "../src/lineage.ts";
import { SKIN, PLATFORM_SKIN, registerSkin, platformConfigured } from "../src/skin.ts";
import { COMPUTER_PORT, COMPUTER_HEADER, computerServiceUrl, computerHeaders, holderOf, takeover } from "../src/computer.ts";
import { TRIGGERS, telemetryEmitters, assertZeroEmitters } from "../src/telemetry.ts";
import { MINIMUM_INTERVAL_MS, routineToJob, eventJob } from "../src/routines.ts";
import { GATEWAY_ENDPOINT, MODEL_CHAIN, getApiKey, gatewayOnly } from "../src/gateway.ts";
import { TRIAGE, triageCounts } from "../src/triage.ts";
import contract from "../contract.json" with { type: "json" };

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");

test("H-M1 gel nommé", () => {
  assert.equal(PINNED_GEL, "f52288f");
  assert.equal(PINNED_GEL_FULL, "f52288fff5ccdbd3de428d573d9f026fce5ff480");
  assert.ok(isGelCommit("f52288f"));
  assert.ok(isGelCommit("f52288fff5ccdbd3de428d573d9f026fce5ff480"));
  assert.ok(!isGelCommit("0000000"));
  assert.deepEqual(verifyGelLineage("f52288fff5ccdbd3de428d573d9f026fce5ff480").headIsGel, true);
  assert.equal(contract.gel, "f52288fff5ccdbd3de428d573d9f026fce5ff480");
  assert.equal(contract.bind, PINNED_BIND);
  assert.ok(PINNED_BIND.length >= 7);
});

test("H-M4 télémétrie zéro : 0 émetteur, 5 déclencheurs tranchés", () => {
  assert.deepEqual(telemetryEmitters(), []);
  assert.equal(assertZeroEmitters(), true);
  assert.equal(TRIGGERS.length, 5);
  for (const t of TRIGGERS) {
    assert.ok(["ABANDONNÉ", "ABSENT-CONFIRME", "N/A"].includes(t.verdict), t.id);
    assert.ok(t.note.length > 10, t.id);
  }
  assert.ok(TRIGGERS.some((t) => t.id === "sink-sdk" && t.verdict === "ABANDONNÉ"));
});

test("H-M6 frontière adapter : triage complet, comptes = table", () => {
  const c = triageCounts();
  assert.equal(c.ported, 12);
  assert.equal(c.surfaces, 1);
  assert.equal(c.abandoned, 4);
  assert.equal(c.total, 17);
  assert.equal(contract.triage.ported, 12);
  assert.equal(contract.triage.total, 17);
  const ids = TRIAGE.map((t) => t.id);
  assert.equal(new Set(ids).size, ids.length, "doublon dans le triage");
});

test("computer-service :4100 + en-tête verbatim + holder", () => {
  assert.equal(COMPUTER_PORT, 4100);
  assert.equal(COMPUTER_HEADER, "x-openbot-bot-id");
  assert.equal(computerServiceUrl(), "http://127.0.0.1:4100");
  assert.deepEqual(computerHeaders("bot-1"), { "x-openbot-bot-id": "bot-1" });
  assert.equal(holderOf("bot"), "bot");
  assert.equal(holderOf("human"), "human");
  assert.throws(() => holderOf("autre"), /holder inconnu/);
  assert.equal(takeover("bot"), "human");
  assert.equal(takeover("human"), "bot");
});

test("gateway :31415 seul, aucune clé", () => {
  assert.equal(GATEWAY_ENDPOINT, "http://127.0.0.1:31415/v1/chat/completions");
  assert.deepEqual(MODEL_CHAIN, ["freellmapi/auto", "claude-sonnet-4-5", "qwen3.8-max", "gemini-3.8-flash", "deepseek-v4-flash"]);
  assert.equal(getApiKey("openai"), "None");
  assert.equal(getApiKey("cpk"), "None");
  assert.equal(gatewayOnly(GATEWAY_ENDPOINT), true);
  assert.equal(gatewayOnly("https://api.openai.com/v1"), false);
});

test("routines : cron refusé, job loop accepté, minimum 15 min", () => {
  assert.equal(MINIMUM_INTERVAL_MS, 15 * 60 * 1000);
  assert.throws(() => routineToJob("r1", "0 * * * *", "brief"), /cron refusé/);
  assert.throws(() => routineToJob("r2", "cron: 0 9 * * *", "brief"), /cron refusé/);
  assert.throws(() => routineToJob("r3", "60000", "brief"), /minimum/);
  const job = routineToJob("r4", String(60 * 60 * 1000), "brief");
  assert.equal(job.kind, "scheduled");
  assert.equal(job.intervalMs, 60 * 60 * 1000);
  const ev = eventJob("g1", "goal");
  assert.equal(ev.kind, "event");
});

test("skin : enregistrement sur la plateforme", () => {
  assert.equal(SKIN.id, "openduet");
  assert.equal(PLATFORM_SKIN.id, "openbot");
  registerSkin(PLATFORM_SKIN);
  const s = registerSkin(SKIN);
  assert.equal(s.configured, true);
  assert.equal(platformConfigured(), true);
});
test("identité OpenDuet: les 6 YAML existent au gel, le vendu est compté", () => {
  for (const n of ["agents", "brand", "channels", "knowledge", "model", "skills"]) {
    assert.ok(existsSync(join(ROOT, "openbot/examples/openduet", `${n}.yaml`)), `YAML manquant: ${n}`);
  }
  for (const e of ["triage", "reply-chips", "voice"]) {
    assert.ok(existsSync(join(ROOT, "evals", e)), `éval manquante: ${e}`);
  }
  const vendu = readdirSync(join(ROOT, "openbot"), { recursive: true }).length;
  assert.ok(vendu >= 2336, `vendu attendu >= 2336 entrées, lu ${vendu}`);
});
test("triage: le vendu 0.2.0 est abandonné, aucun fichier vendu porté", () => {
  const abandoned = TRIAGE.filter((t) => t.verdict === "abandoned");
  assert.ok(abandoned.some((t) => t.id === "vendu-0.2.0"));
  assert.ok(!TRIAGE.some((t) => t.verdict === "ported" && t.id.startsWith("vendu")));
});
