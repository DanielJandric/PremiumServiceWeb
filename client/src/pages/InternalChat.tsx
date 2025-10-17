import { useEffect, useMemo, useRef, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { toast } from "sonner";

interface ChatMessage {
	role: "user" | "assistant";
	content: string;
}

export default function InternalChat() {
	const [messages, setMessages] = useState<ChatMessage[]>([]);
	const [input, setInput] = useState("");
	const [loading, setLoading] = useState(false);
	const endRef = useRef<HTMLDivElement | null>(null);

	// Business fields
	const [documentKind, setDocumentKind] = useState<"devis" | "facture">("devis");
	const [buyerName, setBuyerName] = useState("");
	const [buyerAddress, setBuyerAddress] = useState("");
	const [vatRate, setVatRate] = useState(8.1);

	type Item = { description: string; quantity: number; unitPrice: number };
	const [items, setItems] = useState<Item[]>([]);

	// Typeahead for services
	const serviceTemplates = useMemo(
		() => [
			"Nettoyage de maison",
			"Nettoyage d'entretien",
			"Service de conciergerie",
			"Blanchisserie / literie",
			"Repassage",
			"Nettoyage de vitres",
			"Débarras",
			"Shampoing moquette",
		],
		[]
	);
	const [query, setQuery] = useState("");
	const suggestions = useMemo(
		() =>
			query.length >= 2
				? serviceTemplates.filter((s) => s.toLowerCase().includes(query.toLowerCase())).slice(0, 8)
				: [],
		[query, serviceTemplates]
	);

	const subtotal = useMemo(
		() => items.reduce((acc, it) => acc + it.quantity * it.unitPrice, 0),
		[items]
	);
	const vatAmount = useMemo(() => (subtotal * vatRate) / 100, [subtotal, vatRate]);
	const total = useMemo(() => subtotal + vatAmount, [subtotal, vatAmount]);

	useEffect(() => {
		endRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]);

	async function sendMessage() {
		const prompt = input.trim();
		if (!prompt) return;
		setInput("");
		setMessages((m) => [...m, { role: "user", content: prompt }]);
		setLoading(true);
		try {
			// Forward in OpenAI Chat format to backend proxy (/api/openai)
			const res = await fetch("/api/openai", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					messages: [
						...messages.map(({ role, content }) => ({ role, content })),
						{ role: "user", content: prompt },
					],
					stream: false,
				}),
			});
			if (!res.ok) throw new Error(`HTTP ${res.status}`);
			const data = await res.json();
			const reply = data?.reply ?? data?.content ?? data?.choices?.[0]?.message?.content ?? "";
			setMessages((m) => [...m, { role: "assistant", content: reply }]);
		} catch (err) {
			setMessages((m) => [...m, { role: "assistant", content: "Une erreur est survenue." }]);
		} finally {
			setLoading(false);
		}
	}

	function addItemFromQuery(desc: string) {
		if (!desc) return;
		setItems((prev) => [...prev, { description: desc, quantity: 1, unitPrice: 0 }]);
		setQuery("");
	}

	function updateItem(index: number, patch: Partial<Item>) {
		setItems((prev) => prev.map((it, i) => (i === index ? { ...it, ...patch } : it)));
	}

	function removeItem(index: number) {
		setItems((prev) => prev.filter((_, i) => i !== index));
	}

	async function previewPdf() {
		try {
			const payload = {
				data: {
					kind: documentKind,
					buyer: { name: buyerName, address: buyerAddress },
					items: items.map((it) => ({ description: it.description, quantity: it.quantity, unitPrice: it.unitPrice })),
					totals: { subtotal, vatRate, vatAmount, total },
				},
			};
			const res = await fetch("/api/preview", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(payload),
			});
			if (!res.ok) throw new Error(`HTTP ${res.status}`);
			const blob = await res.blob();
			const url = URL.createObjectURL(blob);
			window.open(url, "_blank");
		} catch (e) {
			toast.error("Prévisualisation indisponible");
		}
	}

	async function generatePdf() {
		try {
			const payload = {
				validated: true,
				data: {
					kind: documentKind,
					buyer: { name: buyerName, address: buyerAddress },
					items: items.map((it) => ({ description: it.description, quantity: it.quantity, unitPrice: it.unitPrice })),
					totals: { subtotal, vatRate, vatAmount, total },
				},
			};
			const res = await fetch("/api/documents", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(payload),
			});
			if (!res.ok) throw new Error(`HTTP ${res.status}`);
			const data = await res.json();
			toast.success("Document généré");
			if (data?.pdfUrl) window.open(data.pdfUrl, "_blank");
		} catch (e) {
			toast.error("Génération échouée");
		}
	}

	return (
		<div className="min-h-screen flex flex-col">
			<Header />
			<main className="flex-1">
				<section className="py-12">
					<div className="container max-w-4xl">
						<Card>
							<CardHeader>
								<CardTitle>Chat interne</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="space-y-6">
									<div className="flex flex-wrap items-center gap-2">
										<span className="text-sm text-muted-foreground">Type:</span>
										<Button variant={documentKind === "devis" ? "default" : "outline"} size="sm" onClick={() => setDocumentKind("devis")}>
											Créer un devis
										</Button>
										<Button variant={documentKind === "facture" ? "default" : "outline"} size="sm" onClick={() => setDocumentKind("facture")}>
											Créer une facture
										</Button>
										<div className="ml-auto text-sm">
											<Link href="/internal/documents">
												<a className="text-primary hover:underline">Voir les documents →</a>
											</Link>
										</div>
										</div>
										{/* close first grid */}
										</div>

										<div className="grid gap-4 md:grid-cols-2">
										<div className="space-y-3">
											<div className="text-sm font-medium">Client</div>
											<input
												value={buyerName}
												onChange={(e) => setBuyerName(e.target.value)}
												placeholder="Nom du client"
												className="w-full rounded-[var(--radius)] border bg-background px-3 py-2"
											/>
											<textarea
												value={buyerAddress}
												onChange={(e) => setBuyerAddress(e.target.value)}
												placeholder="Adresse (rue, NPA, ville)"
												className="w-full rounded-[var(--radius)] border bg-background px-3 py-2 min-h-24"
											/>
											<div className="flex items-center gap-3">
												<label className="text-sm text-muted-foreground">TVA %</label>
												<input
													type="number"
													step="0.1"
													value={vatRate}
													onChange={(e) => setVatRate(Number(e.target.value))}
													className="w-24 rounded-[var(--radius)] border bg-background px-3 py-2"
												/>
											</div>
										</div>

										<div className="space-y-3">
											<div className="text-sm font-medium">Ajouter un service</div>
											<div className="relative">
												<input
													value={query}
													onChange={(e) => setQuery(e.target.value)}
													placeholder="Ex: Nettoyage de maison"
													className="w-full rounded-[var(--radius)] border bg-background px-3 py-2"
													onKeyDown={(e) => {
														if (e.key === "Enter") addItemFromQuery(query.trim());
													}}
												/>
												{suggestions.length > 0 && (
													<div className="absolute z-10 mt-1 w-full rounded-[var(--radius)] border bg-card shadow-md">
														{suggestions.map((s) => (
															<button
																key={s}
																onClick={() => addItemFromQuery(s)}
																className="block w-full text-left px-3 py-2 hover:bg-accent"
															>
																{s}
															</button>
														))}
													</div>
												)}
											</div>

										<div className="space-y-2">
											{items.map((it, idx) => (
												<div key={idx} className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-2">
													<input
														value={it.description}
														onChange={(e) => updateItem(idx, { description: e.target.value })}
														className="rounded-[var(--radius)] border bg-background px-3 py-2"
													/>
													<input
														type="number"
														min={0}
														step="1"
														value={it.quantity}
														onChange={(e) => updateItem(idx, { quantity: Number(e.target.value) })}
														className="w-20 rounded-[var(--radius)] border bg-background px-3 py-2 text-right"
													/>
													<input
														type="number"
														min={0}
														step="0.05"
														value={it.unitPrice}
														onChange={(e) => updateItem(idx, { unitPrice: Number(e.target.value) })}
														className="w-28 rounded-[var(--radius)] border bg-background px-3 py-2 text-right"
													/>
													<Button variant="ghost" size="sm" onClick={() => removeItem(idx)}>Suppr</Button>
												</div>
											))}
											{items.length === 0 && (
												<div className="text-sm text-muted-foreground">Aucun service pour l’instant.</div>
											)}
										</div>
										</div>
									</div>

									<div className="grid gap-4 md:grid-cols-2">
										<div>
											<div className="text-sm font-medium mb-2">Conversation</div>
									<div className="h-[420px] overflow-y-auto rounded-[var(--radius)] border p-4 bg-card">
										{messages.map((m, i) => (
											<div key={i} className={`mb-3 ${m.role === "user" ? "text-foreground" : "text-muted-foreground"}`}>
												<span className="font-medium mr-2">{m.role === "user" ? "Vous" : "Assistant"}:</span>
												<span>{m.content}</span>
											</div>
										))}
										<div ref={endRef} />
									</div>
									<div className="flex gap-3">
										<input
											value={input}
											onChange={(e) => setInput(e.target.value)}
											placeholder="Posez une question..."
											className="flex-1 rounded-[var(--radius)] border bg-background px-3 py-2"
											onKeyDown={(e) => {
												if (e.key === "Enter") sendMessage();
											}}
										/>
										<Button onClick={sendMessage} disabled={loading}>Envoyer</Button>
									</div>
									</div>
									<div>
										<div className="text-sm font-medium mb-2">Récapitulatif</div>
										<div className="rounded-[var(--radius)] border bg-card p-4 space-y-2">
											<div className="flex justify-between text-sm"><span>Sous-total</span><span>{subtotal.toFixed(2)} CHF</span></div>
											<div className="flex justify-between text-sm"><span>TVA {vatRate}%</span><span>{vatAmount.toFixed(2)} CHF</span></div>
											<div className="flex justify-between font-semibold"><span>Total</span><span>{total.toFixed(2)} CHF</span></div>
											<div className="flex gap-3 pt-2">
												<Button variant="outline" onClick={previewPdf}>Aperçu PDF</Button>
												<Button onClick={generatePdf}>Valider et générer</Button>
											</div>
										</div>
									</div>
								</div>
							</CardContent>
						</Card>
					</div>
				</section>
			</main>
			<Footer />
		</div>
	);
}
