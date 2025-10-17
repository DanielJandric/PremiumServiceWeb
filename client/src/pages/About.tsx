import { Card, CardContent } from "@/components/ui/card";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Award, CheckCircle2, Droplets, Heart, Shield, Sparkles, Star, Users, Wrench } from "lucide-react";

export default function About() {
  const values = [
    {
      icon: Heart,
      title: "Passion du métier",
      description: "Nos employés font un travail fantastique et prennent soin de vos biens dans des conditions de travail optimales.",
    },
    {
      icon: Shield,
      title: "Qualité garantie",
      description: "Fondé sur une expérience forte de près de 6 ans, notre savoir-faire fait notre réussite.",
    },
    {
      icon: Users,
      title: "Équipe professionnelle",
      description: "Plus de 30 employés formés et équipés du meilleur matériel professionnel.",
    },
    {
      icon: Award,
      title: "Service d'excellence",
      description: "500+ clients satisfaits et 5000+ travaux complétés avec succès.",
    },
  ];

  const equipment = [
    { icon: Droplets, name: "Laveur de vitre", description: "Équipement professionnel pour un nettoyage impeccable" },
    { icon: Sparkles, name: "Nettoyeur de tapis", description: "Machines spécialisées pour tous types de tapis" },
    { icon: Wrench, name: "Fourgons de travail", description: "Flotte de véhicules pour nos interventions" },
    { icon: Sparkles, name: "Cireuse", description: "Pour l'entretien des sols" },
    { icon: Droplets, name: "Microfibre", description: "Matériaux de qualité professionnelle" },
    { icon: Shield, name: "Désinfectant", description: "Produits professionnels et écologiques" },
    { icon: Droplets, name: "Haute pression", description: "Nettoyage en profondeur" },
    { icon: Sparkles, name: "Nettoyeur à vapeur", description: "Technologie moderne et efficace" },
  ];

  const stats = [
    { value: "6+", label: "Ans d'expérience", icon: Award },
    { value: "500+", label: "Clients satisfaits", icon: Users },
    { value: "30+", label: "Employés", icon: Users },
    { value: "5K+", label: "Travaux complétés", icon: CheckCircle2 },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-accent/20 via-background to-background py-16 md:py-24">
          <div className="container">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
              <div>
                <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                  À propos de Premium Solution
                </h1>
                <p className="mb-6 text-lg text-muted-foreground">
                  Depuis 2020, nous mettons l’exigence au service de vos espaces : discrétion, ponctualité, finitions irréprochables.
                </p>
                <p className="text-lg text-muted-foreground">
                  Née en Suisse romande, Premium Solution grandit avec une idée simple : un nettoyage premium repose sur des équipes stables, un matériel de qualité et des protocoles précis. Aujourd’hui, 500+ clients et 5 000+ interventions témoignent de la constance de notre service.
                </p>
              </div>
              
              <div className="relative">
                <div className="aspect-square overflow-hidden rounded-2xl shadow-2xl flex items-center justify-center p-8">
                  <img
                    src="/logo-transparent.png"
                    alt="Premium Solution"
                    className="h-full w-full object-contain"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 md:py-24">
          <div className="container">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat) => (
                <Card key={stat.label} className="text-center">
                  <CardContent className="pt-6">
                    <div className="mb-4 flex justify-center">
                      <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                        <stat.icon className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                    <div className="mb-2 text-4xl font-bold text-foreground">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="bg-accent/20 py-16 md:py-24">
          <div className="container">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Nos valeurs
              </h2>
              <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                Ce qui nous distingue et fait notre force au quotidien
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {values.map((value) => (
                <Card key={value.title} className="text-center">
                  <CardContent className="pt-6">
                    <div className="mb-4 flex justify-center">
                      <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                        <value.icon className="h-8 w-8 text-primary" />
                      </div>
                    </div>
                    <h3 className="mb-3 text-xl font-semibold text-foreground">{value.title}</h3>
                    <p className="text-sm text-muted-foreground">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Equipment Section */}
        <section className="py-16 md:py-24">
          <div className="container">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Le meilleur personnel & équipement
              </h2>
              <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                Être à la pointe de la technologie et à l'écoute des besoins de notre clientèle 
                nécessite un développement continu. La garantie de Premium Solution est d'apporter 
                le meilleur service possible à ses clients.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {equipment.map((item) => (
                <Card key={item.name} className="group transition-all hover:shadow-lg hover:-translate-y-1">
                  <CardContent className="pt-6">
                    <div className="mb-4 flex justify-center">
                      <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                        <item.icon className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                    <h3 className="mb-2 text-center font-semibold text-foreground">{item.name}</h3>
                    <p className="text-center text-sm text-muted-foreground">{item.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="bg-accent/20 py-16 md:py-24">
          <div className="container">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Ce que disent nos clients
              </h2>
              <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                5 étoiles sur 5 pour la qualité de notre service
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardContent className="pt-6">
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

              <Card>
                <CardContent className="pt-6">
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

              <Card>
                <CardContent className="pt-6">
                  <div className="mb-4 flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="mb-4 text-muted-foreground">
                    "Service professionnel et de qualité. Je fais appel à Premium Solution 
                    régulièrement et je suis toujours satisfaite."
                  </p>
                  <div className="text-sm font-medium text-foreground">Claire M.</div>
                  <div className="text-xs text-muted-foreground">Cliente depuis 2018</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

