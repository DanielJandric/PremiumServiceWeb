import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { CheckCircle2, Droplets, Home, Shirt, Sparkles, Wind } from "lucide-react";
import { Link } from "wouter";

export default function Services() {
  const services = [
    {
      id: "nettoyage-maison",
      icon: Home,
      category: "Nettoyage",
      title: "Nettoyage de maison",
      description: "Premium Solution prendra soin de votre maison de l'entrée à toute la zone de votre maison.",
      price: "Dès 49.- CHF",
      includes: ["Jusqu'à 150 m²", "4 heures de nettoyage", "Cuisine (plan de travail, évier)", "Salle de bain"],
    },
    {
      id: "nettoyage-entretien",
      icon: Home,
      category: "Nettoyage",
      title: "Nettoyage d'entretien",
      description: "Premium Solution prendra soin de votre entreprise de l'entrée à toute la zone de votre entreprise.",
      price: "Dès 250.- CHF",
      includes: ["Jusqu'à 150 m²", "7 heures de nettoyage", "Dépoussiérer des meubles", "2 personnes pendant 5 heures"],
    },
    {
      id: "nettoyage-stores",
      icon: Wind,
      category: "Nettoyage",
      title: "Nettoyage stores",
      description: "Vous emménagez dans une nouvelle maison, vous déménagez dans un nouvel appartement? laissez nous nous occuper du nettoyage.",
      price: "Dès 240.- CHF",
      includes: ["2 personnes pendant 2 heures", "Cuisine (plan de travail, évier)", "Salle de bain", "Dépoussiérer des meubles"],
    },
    {
      id: "nettoyage-fin-bail",
      icon: Home,
      category: "Nettoyage",
      title: "Nettoyage fin de bail",
      description: "Vous emménagez dans une nouvelle maison, vous déménagez dans un nouvel appartement? laissez nous nous occuper du nettoyage.",
      price: "Dès 900.- CHF",
      includes: ["Cuisine", "Salle de bain", "4 pièces", "Stores et fenêtres"],
    },
    {
      id: "nettoyage-rideaux",
      icon: Wind,
      category: "Nettoyage",
      title: "Nettoyage de rideaux",
      description: "Premium Solution a développé un service expert pour l'entretien de vos textiles d'ameublement.",
      price: "Dès 12.- CHF",
      includes: ["Rideaux en soie", "Rideaux en velours doublé", "Rideaux molletonné", "Rideaux en velours doublé"],
    },
    {
      id: "tapis-entretien",
      icon: Sparkles,
      category: "Spécialisé",
      title: "Tapis entretien",
      description: "Nos spécialistes allient techniques traditionnelles et soins innovants pour un nettoyage en profondeur de vos tapis.",
      price: "Dès 38.- CHF",
      includes: ["Tapis mécanique fin", "Tapis mécanique haute laine", "Tapis de marque, de designer", "Tapis en soie"],
    },
  ];

  const categories = ["Tous", "Blanchisserie", "Nettoyage", "Spécialisé"];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-accent/20 via-background to-background py-16 md:py-24">
          <div className="container text-center">
            <h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Nos services
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              À travers sa large gamme de services, Premium Solution vous propose une solution 
              pour tous vos besoins et pour tous types de textiles.
            </p>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-16 md:py-24">
          <div className="container">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {services.map((service, index) => (
                <Card 
                  key={service.id} 
                  className="floating-card group bg-white/90 backdrop-blur-sm border-2 hover:border-primary/50"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardHeader>
                    <div className="mb-4 flex items-center justify-between">
                      <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 group-hover:scale-110 transition-transform duration-300">
                        <service.icon className="h-7 w-7 text-primary group-hover:scale-110 transition-transform" />
                      </div>
                      <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary border border-primary/20">
                        {service.category}
                      </span>
                    </div>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors">{service.title}</CardTitle>
                    <CardDescription className="text-sm">{service.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <div className="text-2xl font-bold text-primary">{service.price}</div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-foreground">Ce qui est inclus :</div>
                      <ul className="space-y-1">
                        {service.includes.map((item) => (
                          <li key={item} className="flex items-start space-x-2 text-sm text-muted-foreground">
                            <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-primary mt-0.5" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="mt-6">
                      <Link href="/contact">
                        <Button className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all" variant="outline">
                          Demander un devis →
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-accent/20 py-16 md:py-24">
          <div className="container text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Besoin d'un service personnalisé ?
            </h2>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
              Nous offrons également des prestations sur mesure pour les entreprises et les besoins spécifiques. 
              Contactez-nous pour discuter de votre projet.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Link href="/contact">
                <Button size="lg">Demander un devis gratuit</Button>
              </Link>
              <a href="tel:+41766074682">
                <Button size="lg" variant="outline">
                  Appelez-nous : +41 76 607 46 82
                </Button>
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

