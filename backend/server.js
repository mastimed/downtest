// --- 1. IMPORTATION DES BIBLIOTHÈQUES ---
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const puppeteer = require('puppeteer'); // Importation de Puppeteer

// --- 2. CONFIGURATION DU SERVEUR ---
const app = express();
const PORT = process.env.PORT; // Utilise le port fourni par Render

// Configuration de CORS pour n'autoriser que votre site
app.use(cors({
  origin: 'https://tfooo.com' 
}));

app.use(express.json());

// --- 3. FONCTIONS DE TÉLÉCHARGEMENT ---

// Fonction factice pour TikTok (à remplacer plus tard)
const getTikTokLink = async (url) => {
    return {
        success: true,
        title: "Vidéo TikTok (Exemple)",
        thumbnail: "https://p16-sign-va.tiktokcdn.com/tos-maliva-avt-0068/33c162a83f51081f6213600f680455a9~c5_720x720.jpeg",
        links: { "HD": "https://example.com/tiktok-video-hd.mp4" }
    };
};

// Fonction factice pour Instagram (à remplacer plus tard)
const getInstagramLink = async (url) => {
    return {
        success: true,
        title: "Reel Instagram (Exemple)",
        thumbnail: "https://cdn.pixabay.com/photo/2018/01/14/23/12/nature-3082832_960_720.jpg",
        links: { "HD": "https://example.com/instagram-video-hd.mp4" }
    };
};

// --- VRAIE FONCTION DE SCRAPING POUR FACEBOOK AVEC PUPPETEER ---
const getFacebookLink = async (url) => {
    console.log(`Lancement du scraping pour Facebook : ${url}`);
    // Lancement du navigateur. L'argument '--no-sandbox' est ESSENTIEL pour que ça fonctionne sur Render.
    const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    
    try {
        // Naviguer vers la page et attendre que le réseau soit calme
        await page.goto(url, { waitUntil: 'networkidle2' });

        // Attendre un peu que la vidéo se charge (parfois nécessaire)
        await page.waitForTimeout(2000); 

        // Le code suivant est exécuté DANS le navigateur pour trouver l'URL de la vidéo
        const videoUrl = await page.evaluate(() => {
            const videoElement = document.querySelector('video');
            return videoElement ? videoElement.src : null;
        });

        await browser.close(); // Fermer le navigateur

        if (!videoUrl) {
            throw new Error('Impossible de trouver la source de la vidéo. Elle est peut-être privée.');
        }

        // On renvoie le VRAI lien trouvé !
        return {
            success: true,
            title: "Vidéo Facebook (Qualité trouvée)",
            thumbnail: "https://cdn.pixabay.com/photo/2017/08/30/01/05/milky-way-2695569_960_720.jpg", // La miniature est encore factice pour l'instant
            links: {
                "Télécharger": videoUrl 
            }
        };
    } catch (error) {
        await browser.close(); // S'assurer de fermer le navigateur même en cas d'erreur
        console.error("Erreur de scraping avec Puppeteer :", error.message);
        throw new Error('Le scraping de la vidéo a échoué. L\'URL est peut-être incorrecte ou la vidéo est privée.');
    }
};


// --- 4. ROUTE DE L'API ---
// C'est le "chef d'orchestre" qui reçoit la demande et appelle la bonne fonction
app.get('/api/download', async (req, res) => {
    const { url } = req.query;

    if (!url) {
        return res.status(400).json({ success: false, error: 'URL est requise.' });
    }

    try {
        let result;
        if (url.includes('tiktok.com')) {
            result = await getTikTokLink(url);
        } else if (url.includes('instagram.com')) {
            result = await getInstagramLink(url);
        } else if (url.includes('facebook.com') || url.includes('fb.watch')) {
            result = await getFacebookLink(url);
        } else {
            throw new Error('Plateforme non supportée.');
        }
        
        console.log('Succès :', result);
        res.status(200).json(result);

    } catch (error) {
        console.error('Erreur finale dans /api/download :', error.message);
        res.status(500).json({ success: false, error: error.message });
    }
});

// --- 5. DÉMARRAGE DU SERVEUR ---
app.listen(PORT, () => {
    console.log(`Le serveur est en cours d'exécution sur le port ${PORT}`);
});