// Attendre que toute la page soit chargée avant d'exécuter le script
document.addEventListener('DOMContentLoaded', () => {
    console.log('Page chargée. Le script.js commence.');

    // Sélection des éléments du DOM
    const form = document.getElementById('download-form');
    const urlInput = document.getElementById('url-input');
    const downloadBtn = document.getElementById('download-btn');
    const resultSection = document.getElementById('result');
    const errorMessage = document.getElementById('error-message');
    const thumbnail = document.getElementById('thumbnail');
    const videoTitle = document.getElementById('video-title');
    const downloadLinksContainer = document.getElementById('download-links');

    // Vérification si le formulaire existe
    if (!form) {
        console.error('ERREUR CRITIQUE : Le formulaire avec l\'ID "download-form" est introuvable !');
        return; // Arrête le script si le formulaire n'est pas trouvé
    }
    
    console.log('Le formulaire a été trouvé. Ajout de l\'écouteur d\'événement.');

    // Écouteur d'événement sur la soumission du formulaire
    form.addEventListener('submit', async (e) => {
        e.preventDefault(); // Empêche le rechargement de la page
        console.log('Le bouton a été cliqué. Le téléchargement commence.');

        const url = urlInput.value.trim();

        if (!url) {
            displayError('Veuillez entrer une URL.');
            return;
        }

        resetUI();
        downloadBtn.disabled = true;
        downloadBtn.textContent = 'Chargement...';

        try {
            console.log('Tentative de fetch vers l\'API...');
            const response = await fetch(`https://downtest.onrender.com/api/download?url=${encodeURIComponent(url)}`);
            console.log('Réponse reçue du serveur.');

            if (!response.ok) {
                // Gère les erreurs HTTP comme 404 ou 500
                throw new Error(`Erreur HTTP ! Statut : ${response.status}`);
            }

            const data = await response.json();
            
            if (data.success) {
                console.log('Succès ! Affichage des résultats.');
                displayResults(data);
            } else {
                console.error('Échec de l\'API :', data.error);
                displayError(data.error);
            }
        } catch (error) {
            console.error('Une erreur est survenue dans le bloc catch :', error);
            displayError('Une erreur de réseau est survenue. Le serveur est-il en ligne ? Vérifiez la console (F12).');
        } finally {
            downloadBtn.disabled = false;
            downloadBtn.textContent = 'Télécharger';
        }
    });

    function displayResults(data) {
        thumbnail.src = data.thumbnail;
        videoTitle.textContent = data.title;
        downloadLinksContainer.innerHTML = '';
        for (const [quality, link] of Object.entries(data.links)) {
            const a = document.createElement('a');
            a.href = link;
            a.textContent = `Télécharger ${quality}`;
            a.target = '_blank';
            a.download = true;
            downloadLinksContainer.appendChild(a);
        }
        resultSection.classList.remove('hidden');
    }

    function displayError(message) {
        errorMessage.textContent = message;
        errorMessage.classList.remove('hidden');
    }

    function resetUI() {
        resultSection.classList.add('hidden');
        errorMessage.classList.add('hidden');
        downloadLinksContainer.innerHTML = '';
    }
});
