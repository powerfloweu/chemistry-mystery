export function validateNmrIntegrals(selected: number[]): boolean {
  const expected = [3, 3, 2, 2, 2];
  return selected.length === 5 && expected.every((v, i) => v === selected[i]);
}

export function normalizeText(input: string): string {
  return input.trim().toLowerCase().replace(/\s+/g, "").replace("⁺", "+");
}

export function validateCatalyst(input: string): boolean {
  const t = normalizeText(input);
  return new Set(["h+", "proton", "acid"]).has(t);
}

export function validateFinalLock(a: string, b: string, c: string): boolean {
  return a.trim().toUpperCase() === "C" && b.trim() === "8" && c.trim().toUpperCase() === "H";
}

export function validateS1Identity(choice: "A" | "B", reason: string): boolean {
  const acceptedReason = "Mismatch in methyl integration";
  if (choice !== "A") return false;
  return normalizeText(reason) === normalizeText(acceptedReason);
}

export function validateS2Product(which: "kinetic" | "thermo"): boolean {
  return which === "thermo";
}

export function validateS2Condition(which: "I" | "II"): boolean {
  return which === "I";
}

export function validateS3FieldCode(input: string): boolean {
  const t = normalizeText(input);
  return t === "l-3" || t === "l3";
}

export function validateS4CatalystPair(catalyst: string, persistent: string): boolean {
  const a = normalizeText(catalyst);
  const b = normalizeText(persistent);
  return a === "h+" && b === "h3o+";
}

export function validateFinalLockDerived(a: string, b: string, c: string): boolean {
  const A = Number(a.trim());
  const B = Number(b.trim());
  const cNorm = normalizeText(c);
  const Cok = cNorm === "+1" || cNorm === "1+" || cNorm === "1";
  return A === 5 && B === 8 && Cok;
}
