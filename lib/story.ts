export const STORY = {
  start: {
    title: "Sealed Dossier",
    beats: [
      "A protocol surfaced in the Archive, recovered from storage c. 1987. Its provenance is unknown; its structure suggests deliberate concealment.",
      "It describes a bond so statistically improbable that its formation requires a specific orbital alignment—one that rarely occurs by chance.",
      "Verification demands systematic proof: structural identity → thermodynamic persistence → mechanistic catalysis → field reproducibility.",
      "Your background in pericyclic reactions qualifies you uniquely to evaluate whether symmetry constraints support or refute the legend.",
    ],
  },
intro: {
  title: "Orbital Symmetry Advisory",
  subtitle: "Proceed by evidence only. Do not optimize by guesswork.",
  emphasisIndex: 2,
  sections: [
    "In the time of great chemists, discoveries rarely announced themselves. They appeared as anomalies—small deviations in spectra, unexpected ratios, products that should not have persisted. Most were dismissed as contamination, instrument error, or wishful thinking.",
    "Among those anomalies there was a recurring rumor: a bond so reluctant that it seemed to defy intuition. It would not appear simply because reagents were present, or because a pathway looked plausible on paper.",
    "Some transformations do not fail. They are simply forbidden until the conditions are correct.",
    "Researchers suspected a quieter law at work—orbital symmetry—governing whether a transformation is permitted at all. The literature is full of cases that are thermally forbidden yet become possible under light, and rearrangements that occur cleanly only when symmetry constraints align (Woodward–Hoffmann rules).",
    "This dossier surfaced without provenance. Only a protocol—structured like field notes—written as if the outcome must be earned rather than guessed. If the legend has any truth in it, it won’t yield to force. It will yield to correct reasoning, careful bookkeeping, and patience.",
  ],
  footnote: "The system will not reveal the final objective in advance. Proceed by evidence only.",
},
  station1: {
    title: "Identity Confirmation",
    why: "Before a transformation can be trusted, the subject must be known. ¹H NMR is a fingerprint: it does not persuade—it reveals.",
    objective: "Confirm the identity signature of Sample B using ¹H NMR integration and a reasoned identity assignment.",
    procedure: [
      "Step A: Observe the spectrum and integrate signals in increasing δ order. Register the integral pattern.",
      "Step B: With the integrals registered, select the candidate structure that matches and provide the reason for your choice.",
      "Only the accepted rationale will allow progression.",
    ],
    microLore: [
      "In the Archive, identity is the first lock.",
      "A matching integral pattern narrows possibilities; a reason closes the case.",
    ],
  },

  station2: {
    title: "Stability Over Time",
    why: "Some outcomes appear quickly but do not last. The equilibrium product is what remains when time is allowed to speak.",
    objective: "Determine the thermodynamic product and the conditions that allow it to dominate.",
    procedure: [
      "Step A: Inspect the reaction coordinate and choose which product will dominate at equilibrium.",
      "Step B: Choose the experimental condition that allows the equilibrium product to persist.",
      "Only the correct pair of choices permits field deployment.",
    ],
    microLore: ["Speed is not permanence.", "Stability is the only honest metric under time."],
  },

  station3: {
    title: "Field Sequence",
    why: "A conclusion that survives only ideal conditions is not a conclusion. Perturbation reveals what is real.",
    objective: "Execute a sequential set of perturbations in the field and retrieve the confirmation code.",
    procedure: [
      "Proceed to the field site with the device.",
      "Follow the labeled forks in the prescribed order (sequence matters).",
      "Complete the sequence; a short confirmation code will be recorded and returned with you.",
    ],
    microLore: ["When conditions change, truth either holds or collapses.", "Sequence is the experiment's contract."],
  },

  station4: {
    title: "Catalyst and Persistence",
    why: "Some agents accelerate a process without being consumed. Distinguishing transient catalysts from persistent species is essential bookkeeping.",
    objective: "Differentiate the catalytic species from persistent reagents and solvents; enter both entries for verification.",
    procedure: [
      "Inspect the mechanism and note which species is regenerated (the catalyst).",
      "Also note which species appears throughout but is not the catalyst (persistent).",
      "Enter both selections to complete mechanistic resolution.",
    ],
    microLore: ["The catalyst is bookkeeping — it appears and disappears within the mechanism.", "Persistence through steps does not imply catalysis."],
  },

  debrief: {
    title: "Archival Procedure",
    why: "Four independent analytical methods have converged on a consistent structural and mechanistic model. Sample B has been identified through ¹H NMR integration. Thermodynamic stability has been verified under equilibrium conditions and field perturbation. The catalytic mechanism has been resolved. No inconsistencies remain.",
    objective: "The investigation confirms that all prerequisite constraints are satisfied. However, the model does not predict whether the transformation will occur under ambient conditions. One variable—external to the mechanistic framework—remains unspecified. Access to the sealed repository is authorized.",
  },

  finalLock: {
    title: "Sealed Repository",
    why: "All constraints have been satisfied. The system is fully determined. No additional optimization is possible; no further variables remain. What follows is not a choice but a consequence of the evidence already recorded.",
    objective: "Access requires a three-part verification derived from prior constraints. Identity, stability, and catalytic mechanism are sufficient to determine the code. Enter the values extracted from the sealed protocol.",
  },
} as const;
