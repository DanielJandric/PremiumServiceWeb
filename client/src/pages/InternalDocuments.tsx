import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DocumentItem {
	id: string;
	kind: "devis" | "facture";
	number?: string;
	createdAt?: string;
	pdfUrl?: string;
}

export default function InternalDocuments() {
	const [items, setItems] = useState<DocumentItem[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		(async () => {
			try {
				const res = await fetch("/api/documents");
				if (!res.ok) throw new Error("HTTP " + res.status);
				const data = await res.json();
				setItems(Array.isArray(data) ? data : data?.items ?? []);
			} catch (e) {
				setItems([]);
			} finally {
				setLoading(false);
			}
		})();
	}, []);

	return (
		<div className="min-h-screen flex flex-col">
			<Header />
			<main className="flex-1">
				<section className="py-12">
					<div className="container max-w-5xl">
						<Card>
							<CardHeader>
								<CardTitle>Documents</CardTitle>
							</CardHeader>
							<CardContent>
								{loading ? (
									<div className="text-sm text-muted-foreground">Chargement…</div>
								) : items.length === 0 ? (
									<div className="text-sm text-muted-foreground">Aucun document.</div>
								) : (
									<div className="divide-y border rounded-[var(--radius)]">
										{items.map((d) => (
											<div key={d.id} className="flex items-center justify-between p-3">
												<div className="space-x-3">
													<span className="font-medium">{(d.kind || "").toUpperCase()}</span>
													<span className="text-muted-foreground">{d.number ?? d.id}</span>
													<span className="text-muted-foreground">{d.createdAt ? new Date(d.createdAt).toLocaleString() : ""}</span>
												</div>
												{d.pdfUrl && (
													<a className="text-primary hover:underline" href={d.pdfUrl} target="_blank" rel="noreferrer">PDF</a>
												)}
											</div>
										))}
									</div>
								)}
							</CardContent>
						</Card>
					</div>
				</section>
			</main>
			<Footer />
		</div>
	);
}
