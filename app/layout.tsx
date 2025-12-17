import type { Metadata } from "next";
import "./globals.css";
import DevBadge from "@/components/DevBadge";

export const metadata: Metadata = {
	title: "Bond Stability Analysis",
	description: "Chemistry Mystery – tablet flow",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<body>
				{children}
				<DevBadge />
			</body>
		</html>
	);
}
