# Projet de Téléchargeur de Vidéos

Ce projet est une application web full-stack qui permet aux utilisateurs de télécharger des vidéos depuis TikTok, Instagram et Facebook.

## Architecture

-   **Backend**: Node.js avec Express.
-   **Frontend**: HTML, CSS, et JavaScript (Vanilla).

## Comment Lancer le Projet Localement

### Prérequis

-   Node.js (version 14 ou supérieure) installé.

### 1. Lancer le Backend

Ouvrez un terminal et naviguez jusqu'au dossier `backend`.

```bash
# Aller dans le dossier backend
cd backend

# Installer les dépendances
npm install

# Démarrer le serveur de développement (avec nodemon)
npm run dev
```

Le serveur backend devrait maintenant être en cours d'exécution sur `http://localhost:5000`.

### 2. Lancer le Frontend

Ouvrez un deuxième terminal (ou utilisez une application comme Live Server dans VS Code). La méthode la plus simple est d'ouvrir le fichier `frontend/index.html` directement dans votre navigateur web.

-   Naviguez jusqu'au dossier `frontend`.
-   Double-cliquez sur `index.html` pour l'ouvrir dans votre navigateur par défaut.

Le site est maintenant visible et prêt à communiquer avec le backend. Collez une URL de test et cliquez sur "Télécharger".

## API Endpoint

-   **URL**: `/api/download`
-   **Méthode**: `GET`
-   **Paramètre de requête**: `url` (L'URL de la vidéo à télécharger, encodée).
-   **Exemple**: `http://localhost:5000/api/download?url=https%3A%2F%2Fwww.tiktok.com%2F%40exemple%2Fvideo%2F12345`