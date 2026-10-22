# TimeLock

**Write today. Open later.**

TimeLock garde des messages, photos, vidéos et vocaux scellés jusqu'à la date choisie.
Tout est stocké dans le navigateur : aucune donnée n'est envoyée à un serveur dans cette version.

## Démarrer

```bash
npm install
npm run dev        # http://localhost:3000
npm test           # tests unitaires (Vitest)
npm run typecheck  # vérification TypeScript
npm run build      # build de production
```

Les APIs Web utilisées (`crypto.subtle`, IndexedDB, MediaRecorder) demandent HTTPS ou `localhost`.

## Organisation

```
src/
  app/
    layout.tsx                 Racine : métadonnées, fournisseurs
    globals.css                Thème noir et blanc, verre « Liquid Glass », viseur
    page.tsx                   Accueil et connexion
    not-found.tsx · robots.ts · sitemap.ts
    privacy/page.tsx           Confidentialité
    (workspace)/               Espace connecté (garde dans AppShell)
      layout.tsx
      dashboard/page.tsx       Tableau de bord, niveau, série, prochaine ouverture
      capsules/page.tsx        Liste, filtres, tri
      capsules/new/page.tsx    Nouvelle capsule
      capsules/[id]/page.tsx   Détail d'une capsule
      settings/page.tsx        Langue, compte, effacement des données
  components/
    shell.tsx                  Navigation latérale, PageHeader, garde de session
    ui.tsx                     Boutons, champs, segments, état vide
    capsule-card.tsx           Carte d'une capsule (scellée ou ouverte)
    capsule-form.tsx           Formulaire de création, enregistrement vocal
    auth-panel.tsx             Connexion et inscription (+ vérification anti-robot)
    countdown.tsx              Compte à rebours et anneau de progression
    ceremony.tsx              Fenêtre affichée à l'ouverture d'une capsule
    media-item.tsx             Affichage photo, vidéo ou audio
    support-bar.tsx            Boutons de soutien (PayPal)
    language-toggle.tsx        Choix FR / EN
    crosshair.tsx              Viseur noir et blanc (souris uniquement)
    glass-light.tsx            Reflet des panneaux suivant le pointeur
    toast.tsx
  context/app-context.tsx      État global : session, capsules, statistiques, actions
  i18n/                        Dictionnaires fr et en (même structure)
  lib/
    capsules.ts                Logique pure : ouverture, série, niveaux, filtres
    validation.ts              Règles : nom d'utilisateur, mot de passe, fichiers, capsules
    auth.ts · crypto.ts        Comptes, hachage SHA-256 avec sel
    capsule-service.ts         Création, suppression, chargement des capsules
    storage.ts                 localStorage (métadonnées)
    blobs.ts                   IndexedDB (fichiers joints)
    captcha.ts · format.ts · export.ts · id.ts
  types/index.ts
```

## Limites à connaître

- **Données locales** : elles restent dans le navigateur. Elles ne sont pas partagées entre appareils.
- **Mot de passe** : le hachage SHA-256 avec sel est adapté à un usage local. Un vrai service utiliserait bcrypt ou argon2 côté serveur.
- **Verrouillage** : il est appliqué par l'interface. Quelqu'un qui consulte le stockage du navigateur peut lire le contenu avant la date.
- **Base de données** : aucune base n'est branchée. Pour un service en ligne, ajouter Drizzle et PostgreSQL (le dossier `src/db/` du projet SponsorSnap peut servir de modèle).
- **Vérification anti-robot** : une addition simple. En production, utiliser Cloudflare Turnstile.
- **Images du site** : aucun favicon ni image Open Graph n'est fourni. Les ajouter dans `public/`.
