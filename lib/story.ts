export const STORY = {
  start: {
    title: "Sealed Dossier",
    beats: [
      "A protocol surfaced in the Archive, recovered from storage c. 1987. Its provenance is unknown; its structure suggests deliberate concealment.",
      "It describes a rare type of bond that has been reported—one whose formation requires a specific orbital alignment to persist.",
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
  footnote: "",
},
  station1: {
    title: "Identity Confirmation",
    why: "Before a transformation can be trusted, the subject must be known. ¹H NMR is a fingerprint: it does not persuade—it reveals.",
    objective: "Confirm the identity signature of Sample B using ¹H NMR and structural analysis.",
    procedure: [
      "1. Identify the aromatic symmetry: does it collapse into two equivalent aromatic sets?",
      "2. Study the integration pattern and determine what structure fits.",
      "3. Confirm a methyl (CH₃) signature consistent with a ring substituent. If you can, note the approximate region (~2.2–2.5 ppm).",
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
    objective: "Apply three perturbations and observe how the model responds under stress.",
    procedure: [
      "Catalysis: presence without ownership. A catalyst is defined operationally: it participates in elementary steps, lowers the activation barrier by providing an alternative pathway, and is regenerated, leaving the overall stoichiometry and equilibrium unchanged.",
      "Consider this definition. Then step outside—to the field, to the bench, to wherever your chemistry lives. Sometimes solutions need a change of perspective.",
      "Return when you have verified all three perturbations. The host will confirm each one.",
    ],
    microLore: ["When conditions change, truth either holds or collapses.", "Perspective is not optional."],
  },

  station4: {
    title: "Catalyst and Persistence",
    why: "Some agents accelerate a process without being consumed. Distinguishing transient catalysts from persistent species is essential bookkeeping.",
    objective: "Differentiate the catalytic species from persistent reagents and solvents; enter both entries for verification.",
    procedure: [
      "Inspect the mechanism and note which species is regenerated (the catalyst).",
      "Also note which species appears throughout but is not the catalyst (persistent).",
      "Use a chemical species. Names like 'catalyst' may be rejected.",
    ],
    microLore: ["The catalyst is bookkeeping — it appears and disappears within the mechanism.", "Persistence through steps does not imply catalysis."],
  },

  debrief: {
    title: "Archival Procedure",
    why: "Four independent analytical methods have converged on a consistent structural and mechanistic model. Sample B has been identified through ¹H NMR integration. Thermodynamic stability has been verified under equilibrium conditions and field perturbation. The catalytic mechanism has been resolved. No inconsistencies remain.",
    objective: "The investigation confirms that all prerequisite constraints are satisfied. Access to the sealed repository is authorized.",
  },

  finalLock: {
    title: "Sealed Repository",
    why: "All constraints have been satisfied. The system is fully determined. No additional optimization is possible; no further variables remain. What follows is not a choice but a consequence of the evidence already recorded.",
    objective: "Access requires a three-part verification derived from prior constraints. Identity, stability, and catalytic mechanism are sufficient to determine the code. Enter the values extracted from the sealed protocol.",
  },
} as const;
