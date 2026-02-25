# 4you — Cartes cadeaux digitales

Site de démonstration pour la vente de cartes cadeaux digitales avec message vidéo personnalisé.

> **Important :** Ce projet est une démo. Le paiement est simulé, l'enregistrement vidéo est un placeholder fonctionnel.

## Stack technique

- **Frontend** : React 19 + Vite 7 + React Router 7 + Zustand + Tailwind CSS 4
- **Backend** : Express.js (ESM)
- **Base de données** : SQLite via `better-sqlite3`
- **PDF** : `pdf-lib`
- **QR Code** : `qrcode`

## Structure du projet

```
4you/
├── client/          # Application React (Vite)
├── server/          # API Express + SQLite
└── package.json     # Root workspace
```

## Prérequis

- Node.js 18+
- npm 9+

## Installation

```bash
# Cloner ou décompresser le projet, puis :
npm install
```

Cela installe les dépendances de tous les workspaces (client + server).

## Configuration

Le serveur se configure via un fichier `.env` dans `/server` :

```bash
cp server/.env.example server/.env
```

Variables disponibles :

| Variable   | Défaut                    | Description                              |
|------------|---------------------------|------------------------------------------|
| `PORT`     | `3001`                    | Port du serveur Express                  |
| `BASE_URL` | `http://localhost:5173`   | URL de base pour les QR codes            |
| `NODE_ENV` | `development`             | Environnement (`development`/`production`) |

## Lancer en développement

```bash
npm run dev
```

Cela démarre en parallèle :
- **Client** sur `http://localhost:5173` (Vite dev server + HMR)
- **Serveur** sur `http://localhost:3001`

La base de données SQLite est créée automatiquement dans `server/data/giftcards.db` au premier démarrage. Les 8 enseignes sont seedées automatiquement.

## Build de production

```bash
npm run build       # Build le client React dans client/dist/
npm run start       # Lance Express qui sert aussi les fichiers statiques
```

En production, Express sert l'application React complète sur le port configuré.

## API

| Méthode | Route | Description |
|---------|-------|-------------|
| `GET` | `/api/brands` | Liste des enseignes |
| `GET` | `/api/brands/:id` | Détail d'une enseigne |
| `POST` | `/api/orders` | Créer une commande |
| `PATCH` | `/api/orders/:id/pay` | Simuler le paiement |
| `GET` | `/api/orders/:id` | Détail d'une commande |
| `GET` | `/api/orders/:id/voucher-pdf` | Télécharger le voucher PDF |
| `GET` | `/api/qr?url=...` | Générer un QR code PNG |
| `GET` | `/api/voucher/:id/video` | Données de la page vidéo |

### Exemple : créer une commande

```bash
curl -X POST http://localhost:3001/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "brand_id": 1,
    "amount": 50,
    "recipient_email": "marie@exemple.fr",
    "recipient_name": "Marie",
    "personal_message": "Joyeux anniversaire",
    "has_video_message": true
  }'
```

## Parcours utilisateur

1. **Accueil** — Grille de 8 enseignes (Amazon, Netflix, Spotify, Fnac, Zalando, Uber Eats, Airbnb, Steam)
2. **Personnalisation** (3 étapes) :
   - Choix du montant (presets ou libre, 5€–500€)
   - Informations destinataire (email, prénom, message optionnel)
   - Message vidéo (simulation)
3. **Récapitulatif** — Validation et paiement simulé
4. **Confirmation** — Voucher avec QR code + téléchargement PDF

## Fonctionnalités à brancher (futures)

- Enregistrement vidéo réel (MediaRecorder API)
- Lecture vidéo via QR code
- Intégration paiement Stripe
- Envoi email du voucher au destinataire
# 4you
