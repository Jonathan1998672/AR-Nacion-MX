function openSection(sectionId) {
    document.getElementById('main-menu').style.display = 'none';

    const section = document.getElementById(`section-${sectionId}`);
    section.style.display = 'block';

    if (sectionId === 'scanner') {
        const sceneEl = document.querySelector('a-scene');
        const targets = document.querySelectorAll('[mindar-image-target]');
        targets.forEach(target => {
            target.setAttribute('visible', true); 
            const model = target.querySelector('a-gltf-model');
            if (model) model.setAttribute('visible', true);
        });

        const scanningOverlay = document.querySelector('.mindar-ui-scanning');
        if (scanningOverlay) {
            scanningOverlay.style.display = 'flex';
        }

        setTimeout(() => {
            sceneEl.systems['mindar-image-system'].start();
        }, 100);
    }

    if (sectionId === 'trivia') {
        iniciarTrivia();
    }
}

function backToMenu() {
    const sceneEl = document.querySelector('a-scene');
    if (sceneEl) {
        sceneEl.systems['mindar-image-system'].stop();
        const targets = document.querySelectorAll('[mindar-image-target]');
        targets.forEach(target => {
            target.setAttribute('visible', false);
            const model = target.querySelector('a-gltf-model');
            if (model) model.setAttribute('visible', false);
        });
    }

    const overlay = document.querySelector('.mindar-ui-scanning');
    if (overlay) overlay.style.display = 'none';

    document.querySelectorAll('.app-section').forEach(s => s.style.display = 'none');
    document.getElementById('main-menu').style.display = 'flex';
}

function backToMenuVideos() {
    // Ocultamos la sección de videos
    document.getElementById('section-videos').style.display = 'none';
    // Mostramos el menú principal
    document.getElementById('main-menu').style.display = 'flex';
    
    // Opcional: Pausar el video de YouTube al salir
    const player = document.getElementById('youtube-player');
    if (player) {
        const currentSrc = player.src;
        player.src = ""; // Esto detiene el video por completo
        player.src = currentSrc; // Lo reseteamos para la próxima vez
    }
}

function backToMenuTrivia() {
    document.getElementById('section-trivia').style.display = 'none';
    document.getElementById('main-menu').style.display = 'flex';
}

