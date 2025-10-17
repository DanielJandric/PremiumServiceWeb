# Premium Solution - Site Web Moderne

## 🚀 Installation et Démarrage

### Prérequis
- Node.js 18+ installé
- pnpm installé (`npm install -g pnpm`)

### Installation des dépendances
```bash
pnpm install
```

### Démarrage en développement
```bash
pnpm dev
```
Le site sera accessible sur `http://localhost:3000`

### Build pour production
```bash
pnpm build
```

### Prévisualisation du build
```bash
pnpm preview
```

## 📁 Structure du Projet

```
premium-solution/
├── client/                 # Application React frontend
│   ├── public/            # Fichiers statiques (logo, etc.)
│   └── src/
│       ├── components/    # Composants réutilisables
│       │   ├── ui/       # Composants shadcn/ui
│       │   ├── Header.tsx
│       │   └── Footer.tsx
│       ├── pages/        # Pages du site
│       │   ├── Home.tsx
│       │   ├── Services.tsx
│       │   ├── About.tsx
│       │   └── Contact.tsx
│       ├── contexts/     # Contextes React (Theme)
│       ├── hooks/        # Hooks personnalisés
│       ├── lib/          # Utilitaires
│       ├── App.tsx       # Routes et configuration
│       ├── main.tsx      # Point d'entrée
│       └── index.css     # Styles globaux + animations
├── server/               # Placeholder (template static)
├── shared/               # Constantes partagées
└── package.json          # Dépendances du projet
```

## 🎨 Technologies Utilisées

- **React 19** - Framework UI
- **Vite** - Build tool ultra-rapide
- **Tailwind CSS 4** - Framework CSS utility-first
- **shadcn/ui** - Composants UI modernes
- **Wouter** - Routing léger
- **Lucide React** - Icônes modernes
- **TypeScript** - Typage statique

## 🎯 Fonctionnalités

- ✅ Design moderne avec effets 3D et animations
- ✅ Cartes flottantes avec hover effects
- ✅ Glassmorphism et backdrop blur
- ✅ Logo animé (floating animation)
- ✅ Responsive sur tous les écrans
- ✅ Palette de couleurs verte cohérente
- ✅ 4 pages complètes (Accueil, Services, À propos, Contact)
- ✅ Formulaire de contact fonctionnel
- ✅ Optimisé pour les performances

## 🌐 Déploiement

### Vercel (Recommandé)
1. Créer un compte sur [Vercel](https://vercel.com)
2. Connecter votre repository Git
3. Vercel détectera automatiquement Vite
4. Déployer en un clic !

### Netlify
1. Créer un compte sur [Netlify](https://netlify.com)
2. Glisser-déposer le dossier `dist` après `pnpm build`
3. Ou connecter votre repository Git

### Configuration de build
- **Build command**: `pnpm build`
- **Output directory**: `dist`
- **Install command**: `pnpm install`

## 🎨 Personnalisation

### Couleurs
Les couleurs sont définies dans `client/src/index.css` :
- `--primary`: Vert principal (#6AB43E)
- `--background`: Fond gris clair
- Modifier les variables CSS pour changer la palette

### Logo
Remplacer `/client/public/logo-transparent.png` par votre logo

### Contenu
Modifier les fichiers dans `/client/src/pages/` pour changer le contenu

## 📞 Support

Pour toute question ou assistance, contactez l'équipe Premium Solution.

---

**© 2025 Premium Solution - Tous droits réservés**
