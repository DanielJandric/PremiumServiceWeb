import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { CheckCircle2, Droplets, Home as HomeIcon, Sparkles, Star, Users } from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  const services = [
    {
      icon: HomeIcon,
      title: "Nettoyage de maison",
      description: "Nettoyage complet de votre maison ou appartement avec notre équipe professionnelle.",
      price: "Dès 49.- CHF",
      color: "text-primary",
    },
    {
      icon: Sparkles,
      title: "Nettoyage d'entretien",
      description: "Service professionnel pour l'entretien régulier de votre entreprise ou de vos locaux.",
      price: "Dès 250.- CHF",
      color: "text-primary",
    },
    {
      icon: Sparkles,
      title: "Service de conciergerie",
      description: "Gestion des espaces communs, évacuation des déchets et menus travaux adaptés à vos besoins.",
      price: "Sur devis",
      color: "text-primary",
    },
  ];

  const stats = [
    { label: "Ans d'expérience", value: "6+", icon: CheckCircle2 },
    { label: "Clients satisfaits", value: "500+", icon: Users },
    { label: "Travaux complétés", value: "5K+", icon: Star },
  ];

  const features = [
    "Personnel formé et expérimenté",
    "Équipement professionnel moderne",
    "Service rapide et soigné",
    "Devis gratuit et transparent",
    "Intervention dans toute la région",
    "Respect de l'environnement",
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative isolate overflow-hidden bg-gradient-to-br from-accent/20 via-background to-background py-20 md:py-32">
          <div className="pointer-events-none absolute inset-0 -z-10 opacity-60">
            <div className="absolute left-1/2 top-[-15%] h-[520px] w-[1200px] -translate-x-1/2 rounded-full blur-3xl bg-gradient-to-r from-primary/20 to-[color-mix(in_oklab,var(--accent)_70%,transparent)]" />
          </div>
          <div className="container">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
              <div className="space-y-8">
                <div className="inline-block rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                  ✨ Votre partenaire de confiance depuis 2016
                </div>
                <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
                  Nettoyage & Service de Conciergerie
                </h1>
                <p className="text-lg text-muted-foreground">
                  Premium Solution vous offre des services professionnels de nettoyage pour votre maison, 
                  votre entreprise et des prestations de conciergerie adaptées à tous vos besoins.
                </p>
                <div className="flex flex-col gap-4 sm:flex-row">
                  <Link href="/contact">
                    <Button size="lg" className="w-full sm:w-auto">
                      Demander un devis gratuit
                    </Button>
                  </Link>
                  <Link href="/services">
                    <Button size="lg" variant="outline" className="w-full sm:w-auto">
                      Découvrir nos services
                    </Button>
                  </Link>
                </div>
                
                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 pt-8">
                  {stats.map((stat) => (
                    <div key={stat.label} className="text-center">
                      <div className="flex items-center justify-center mb-2">
                        <stat.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                      <div className="text-xs text-muted-foreground">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="relative">
                <div className="aspect-square overflow-hidden rounded-2xl shadow-2xl flex items-center justify-center p-8 bg-gradient-to-br from-white/50 to-white/30 backdrop-blur-sm">
                  <img
                    src="/logo-transparent.png"
                    alt="Premium Solution"
                    className="h-full w-full object-contain animate-float"
                  />
                </div>
                <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-primary/10 rounded-3xl blur-2xl -z-10 opacity-50"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-20 md:py-32">
          <div className="container">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Nos services spécialisés
              </h2>
              <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                À travers sa large gamme de services, Premium Solution vous propose une solution 
                pour tous vos besoins et pour tous types de textiles.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {services.map((service, index) => (
                <Card 
                  key={service.title} 
                  className="floating-card group bg-white/90 backdrop-blur-sm border-2 hover:border-primary/50"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardHeader>
                    <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 group-hover:scale-110 transition-transform duration-300">
                      <service.icon className={`h-8 w-8 ${service.color} group-hover:scale-110 transition-transform`} />
                    </div>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors">{service.title}</CardTitle>
                    <CardDescription className="text-base">{service.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-primary">{service.price}</span>
                      <Link href="/services">
                        <Button variant="ghost" size="sm" className="group-hover:translate-x-1 transition-transform">
                          En savoir plus →
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-12 text-center">
              <Link href="/services">
                <Button size="lg" variant="outline">
                  Voir tous nos services
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-accent/20 py-20 md:py-32">
          <div className="container">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
              <div>
                <h2 className="mb-6 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                  Pourquoi choisir Premium Solution ?
                </h2>
                <p className="mb-8 text-lg text-muted-foreground">
                  Fondé sur une expérience forte de près de 6 ans, notre savoir-faire fait notre réussite. 
                  Il atteste d'un gage de qualité et garantit nettoyage et soin professionnel pour vos 
                  vêtements et tous vos articles textiles.
                </p>
                <div className="grid gap-4 sm:grid-cols-2">
                  {features.map((feature) => (
                    <div key={feature} className="flex items-start space-x-3">
                      <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-primary mt-0.5" />
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-8">
                  <Link href="/a-propos">
                    <Button size="lg">En savoir plus sur nous</Button>
                  </Link>
                </div>
              </div>
              
              <div className="space-y-6">
                <Card className="floating-card bg-white/90 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle>Témoignage client</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4 flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 fill-primary text-primary" />
                      ))}
                    </div>
                    <p className="mb-4 text-muted-foreground">
                      "Travail bien fait et rapidement et le personnel toujours très aimable. 
                      Je recommande vivement Premium Solution !"
                    </p>
                    <div className="text-sm font-medium text-foreground">Marie L.</div>
                    <div className="text-xs text-muted-foreground">Cliente depuis 2020</div>
                  </CardContent>
                </Card>
                
                <Card className="floating-card bg-white/90 backdrop-blur-sm" style={{ animationDelay: '0.2s' }}>
                  <CardHeader>
                    <CardTitle>Témoignage client</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4 flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 fill-primary text-primary" />
                      ))}
                    </div>
                    <p className="mb-4 text-muted-foreground">
                      "Travail rapide et soigné et les dames qui m'ont servie sont très sympathiques. 
                      Service impeccable !"
                    </p>
                    <div className="text-sm font-medium text-foreground">Sophie D.</div>
                    <div className="text-xs text-muted-foreground">Cliente depuis 2019</div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 md:py-32">
          <div className="container">
            <Card className="bg-primary text-primary-foreground">
              <CardContent className="p-12 text-center">
                <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
                  Demandez un devis gratuit dès aujourd'hui
                </h2>
                <p className="mb-8 text-lg opacity-90">
                  Des conseils personnalisés et la transparence des prix. 
                  Devis rapide et simple, réservation immédiate.
                </p>
                <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                  <Link href="/contact">
                    <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                      Demander un devis
                    </Button>
                  </Link>
                  <a href="tel:+41766074682">
                    <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent text-primary-foreground border-primary-foreground hover:bg-primary-foreground/10">
                      Appelez-nous : +41 76 607 46 82
                    </Button>
                  </a>
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

