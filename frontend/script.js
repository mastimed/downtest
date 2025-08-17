document.addEventListener('DOMContentLoaded', () => {
    // Sélection des éléments du DOM
    const form = document.getElementById('download-form');
    const urlInput = document.getElementById('url-input');
    const downloadBtn = document.getElementById('download-btn');
    const resultSection = document.getElementById('result');
    const errorMessage = document.getElementById('error-message');
    const thumbnail = document.getElementById('thumbnail');
    const videoTitle = document.getElementById('video-title');
    const downloadLinksContainer = document.getElementById('download-links');

    // Écouteur d'événement sur la soumission du formulaire
    form.addEventListener('submit', async (e) => {
        e.preventDefault(); // Empêche le rechargement de la page
        const url = urlInput.value.trim();

        if (!url) {
            displayError('Veuillez entrer une URL.');
            return;
        }

        // Réinitialiser l'interface et afficher l'état de chargement
        resetUI();
        downloadBtn.disabled = true;
        downloadBtn.textContent = 'Chargement...';

        try {
            // Appel à l'API backend
            const response = await fetch(`https://downtest.onrender.com/api/download?url=${encodeURIComponent(url)}`);

            if (data.success) {
                displayResults(data);
            } else {
                displayError(data.error);
            }
        } catch (error) {
            displayError('Une erreur de réseau est survenue. Le serveur est-il en ligne ?');
            console.error('Fetch Error:', error);
        } finally {
            // Réactiver le bouton
            downloadBtn.disabled = false;
            downloadBtn.textContent = 'Télécharger';
        }
    });

    // Fonction pour afficher les résultats
    function displayResults(data) {
        thumbnail.src = data.thumbnail;
        videoTitle.textContent = data.title;

        // Vider les anciens liens
        downloadLinksContainer.innerHTML = '';

        // Créer et ajouter les nouveaux liens de téléchargement
        for (const [quality, link] of Object.entries(data.links)) {
            const a = document.createElement('a');
            a.href = link;
            a.textContent = `Télécharger ${quality}`;
            a.target = '_blank'; // Ouvre dans un nouvel onglet
            a.download = true; // Suggère le téléchargement du fichier
            downloadLinksContainer.appendChild(a);
        }

        resultSection.classList.remove('hidden');
    }

    // Fonction pour afficher une erreur
    function displayError(message) {
        errorMessage.textContent = message;
        errorMessage.classList.remove('hidden');
    }

    // Fonction pour réinitialiser l'interface
    function resetUI() {
        resultSection.classList.add('hidden');
        errorMessage.classList.add('hidden');
        downloadLinksContainer.innerHTML = ''; // Vider les liens précédents
    }
});