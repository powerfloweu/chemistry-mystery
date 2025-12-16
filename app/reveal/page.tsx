"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { BasicShell, Guard } from "@/components/Guard";
import Folio from "@/components/ui/Folio";
import { Button } from "@/components/ui/Button";
import { ROUTES } from "@/lib/routes";
import { readState } from "@/lib/gameStore";

export default function Reveal() {
	const router = useRouter();
	return (
		<Guard require={["final_ok"]}>
			<BasicShell title="Sealed Repository" subtitle="Access granted">
				<Folio label="ARCHIVE" title="Repository Unsealed" note="Authorization confirmed. You may proceed.">
					<RevealBody onOpenArchive={() => router.push(ROUTES.archive)} />
				</Folio>
			</BasicShell>
		</Guard>
	);
}

function RevealBody({ onOpenArchive }: { onOpenArchive: () => void }) {
	const s = useMemo(() => readState(), []);
	const tokensReady = Boolean(s.token1 && s.token2 && s.token3);
	return (
		<div className="space-y-4 text-slate-800">
			<p className="text-sm">The final record is unlocked. Continue to the Archive to view the materials.</p>

			<div className="rounded-xl border border-slate-900/10 bg-white/70 p-3 text-sm">
				<div className="mb-2 text-[11px] uppercase tracking-[0.22em] text-amber-800/80">Readiness</div>
				<div className="grid grid-cols-2 gap-x-6 gap-y-1 text-slate-700">
					<div>Token 1</div><div>{s.token1 ? s.token1 : "Missing"}</div>
					<div>Token 2</div><div>{s.token2 ? s.token2 : "Missing"}</div>
					<div>Token 3</div><div>{s.token3 ? s.token3 : "Missing"}</div>
				</div>
				{!tokensReady ? (
					<p className="mt-2 text-xs text-amber-900/80">Tokens are missing. Visit each station to generate them before opening the Archive.</p>
				) : null}
			</div>

			<Button variant="primary" onClick={onOpenArchive} className="w-full" disabled={!tokensReady} title={!tokensReady ? "Complete stations to generate tokens" : "Open Archive"}>
				Open Archive
			</Button>
		</div>
	);
}
