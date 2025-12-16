export const ROUTES = {
  start: "/start",
  s1: "/station1",
  s2: "/station2",
  s3: "/station3",
  s4: "/station4",
  debrief: "/debrief",
  archive: "/archive",
  final: "/final-lock",
  reveal: "/reveal",
} as const;

export function lastValidRoute(state: any): string {
  // state may contain expanded fields; check in order of required steps
  if (!state || !state.playerName) return ROUTES.start;

  if (!state.s1_integralsOk || !state.s1_identityOk) return ROUTES.s1;

  if (!state.s2_productOk || !state.s2_conditionOk) return ROUTES.s2;

  if (!state.s3_confirmed) return ROUTES.s3;

  if (!state.s4_catalystOk || !state.s4_persistentOk) return ROUTES.s4;

  return ROUTES.final;
}
