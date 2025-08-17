const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: 'https://tfooo.com' 
})); // Permet les requêtes depuis votre frontend
app.use(express.json());

// --- Fonctions de téléchargement (Simulées) ---
// REMARQUE IMPORTANTE : La véritable logique de scraping est complexe et fragile.
// Ces fonctions simulent une réponse réussie pour la démonstration.
// Pour une application réelle, vous devriez intégrer des bibliothèques comme
// puppeteer, playwright, ou des API tierces.

const getTikTokLink = async (url) => {
    console.log(`Scraping de la vidéo TikTok depuis : ${url}`);
    // Logique de scraping réelle ici...
    return {
        success: true,
        title: "Vidéo TikTok Amusante",
        thumbnail: "https://p16-sign-va.tiktokcdn.com/tos-maliva-avt-0068/33c162a83f51081f6213600f680455a9~c5_720x720.jpeg?x-expires=1690000000&x-signature=EXAMPLE",
        links: {
            "HD (Sans Filigrane)": "https://example.com/tiktok-video-hd.mp4",
            "SD (Sans Filigrane)": "https://example.com/tiktok-video-sd.mp4",
            "MP3 Audio": "https://example.com/tiktok-audio.mp3"
        }
    };
};

const getInstagramLink = async (url) => {
    console.log(`Scraping de la vidéo Instagram depuis : ${url}`);
    return {
        success: true,
        title: "Reel Instagram Inspirant",
        thumbnail: "https://cdn.pixabay.com/photo/2018/01/14/23/12/nature-3082832_960_720.jpg",
        links: {
            "HD": "https://example.com/instagram-video-hd.mp4"
        }
    };
};

const getFacebookLink = async (url) => {
    console.log(`Scraping de la vidéo Facebook depuis : ${url}`);
    return {
        success: true,
        title: "Vidéo Facebook Informative",
        thumbnail: "https://cdn.pixabay.com/photo/2017/08/30/01/05/milky-way-2695569_960_720.jpg",
        links: {
            "HD": "https://example.com/facebook-video-hd.mp4",
            "SD": "https://example.com/facebook-video-sd.mp4"
        }
    };
};


// --- Route de l'API ---
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
        } else if (url.includes('facebook.com')) {
            result = await getFacebookLink(url);
        } else {
            throw new Error('Plateforme non supportée. Veuillez utiliser une URL TikTok, Instagram ou Facebook.');
        }
        
        // Journalisation de base
        console.log('Succès :', result);
        res.status(200).json(result);

    } catch (error) {
        // Gestion des erreurs
        console.error('Erreur lors du traitement :', error.message);
        res.status(500).json({ success: false, error: error.message });
    }
});


// Démarrage du serveur
app.listen(PORT, () => {
    console.log(`Le serveur backend est en cours d'exécution sur http://localhost:${PORT}`);
});