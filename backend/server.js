// --- 1. IMPORTATION DES BIBLIOTHÈQUES ---
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const puppeteer = require('puppeteer-core'); // On utilise puppeteer-core
const chromium = require('chrome-aws-lambda'); // On importe le navigateur

// --- 2. CONFIGURATION DU SERVEUR ---
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: 'https://tfooo.com' }));
app.use(express.json());

// --- 3. FONCTIONS DE TÉLÉCHARGEMENT ---

// Fonctions factices pour TikTok et Instagram
// ... (elles restent les mêmes)

// --- VRAIE FONCTION DE SCRAPING POUR FACEBOOK (Version Robuste) ---
const getFacebookLink = async (url) => {
    console.log(`Lancement du scraping pour Facebook : ${url}`);
    let browser = null;

    try {
        // Configuration pour utiliser le navigateur de chrome-aws-lambda
        browser = await puppeteer.launch({
            args: chromium.args,
            defaultViewport: chromium.defaultViewport,
            executablePath: await chromium.executablePath,
            headless: chromium.headless,
            ignoreHTTPSErrors: true,
        });

        const page = await browser.newPage();
        
        // Se faire passer pour un vrai navigateur
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');

        await page.goto(url, { waitUntil: 'networkidle2' });

        const videoUrl = await page.evaluate(() => {
            const videoElement = document.querySelector('video');
            return videoElement ? videoElement.src : null;
        });

        if (!videoUrl) {
            throw new Error('Impossible de trouver la source de la vidéo. Elle est peut-être privée.');
        }

        return {
            success: true,
            title: "Vidéo Facebook",
            links: {
                "Télécharger": videoUrl
            }
        };

    } catch (error) {
        console.error("Erreur de scraping avec Puppeteer :", error.message);
        throw new Error('Le scraping de la vidéo a échoué.');
    } finally {
        if (browser !== null) {
            await browser.close(); // S'assurer que le navigateur est toujours fermé
        }
    }
};

// --- 4. ROUTE DE L'API ---
// ... (le code reste le même, il appelle getFacebookLink)
app.get('/api/download', async (req, res) => {
    // ...
    // Le code de cette fonction ne change pas
    // ...
});


// --- 5. DÉMARRAGE DU SERVEUR ---
app.listen(PORT, () => {
    console.log(`Le serveur est en cours d'exécution sur le port ${PORT}`);
});