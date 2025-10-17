import { useEffect, useRef, useState } from "react";
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

    // Conversation mode only
    const [documentKind, setDocumentKind] = useState<"devis" | "facture">("devis");

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
            const res = await fetch("/api/chat", {
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

    async function sendQuick(content: string) {
        setInput(content);
        await sendMessage();
    }
    async function previewPdf() {
		try {
            const payload = { kind: documentKind, messages };
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
            const payload = { validated: true, kind: documentKind, messages };
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

									<div className="grid gap-4">
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
