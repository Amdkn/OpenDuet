// Lignée du gel — H-M1 / H-M2 (F8 pas 7, OpenDuet).
export const PINNED_GEL = "f52288f";
export const PINNED_GEL_FULL = "f52288fff5ccdbd3de428d573d9f026fce5ff480";
export const PINNED_BIND = "be7ec832379fd1f76aa27704ae80cdf9fc9cb7c1";
export const PINNED_BIND_FULL = "be7ec832379fd1f76aa27704ae80cdf9fc9cb7c1";
export const PINNED_BIND_BLOB = "002690a18645ad3c2360bea65aaf28d0dad1e37f";
export const FORK = "Amdkn/OpenDuet";
export const UPSTREAM = "CopilotKit/OpenDuet";
export const SKIN_ID = "openduet";

export function isGelCommit(sha: string): boolean {
  return sha === PINNED_GEL || sha === PINNED_GEL_FULL;
}

export function verifyGelLineage(head: string): { head: string; gel: string; headIsGel: boolean } {
  return { head, gel: PINNED_GEL_FULL, headIsGel: isGelCommit(head) };
}
