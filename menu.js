function openSection(sectionId) {
    document.getElementById('main-menu').style.display = 'none';

    const section = document.getElementById(`section-${sectionId}`);
    section.style.display = 'block';

    if (sectionId === 'scanner') {
        const sceneEl = document.querySelector('a-scene');

        const todosLosModelos = sceneEl.querySelectorAll('a-gltf-model');
        todosLosModelos.forEach(model => {
            model.setAttribute('visible', false);
        });
        const targets = document.querySelectorAll('[mindar-image-target]');
        targets.forEach(target => {
            target.setAttribute('visible', false);
        });
        const uiContainer = document.getElementById('ui-container');
        if (uiContainer) uiContainer.style.display = 'none';

        const scanningOverlay = document.querySelector('.mindar-ui-scanning');
        if (scanningOverlay) scanningOverlay.style.display = 'flex';

        setTimeout(() => {
            sceneEl.systems['mindar-image-system'].start();
        }, 100);
    }

    if (sectionId === 'trivia') {
        iniciarTrivia();
    }

    if (sectionId === 'videos') {
        const player = document.getElementById('youtube-player');
        if (player && player.src === "" || player.src.includes(window.location.host)) {
             cargarPrimerVideo(); 
        }
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
    document.getElementById('section-videos').style.display = 'none';
    document.getElementById('main-menu').style.display = 'flex';

    const player = document.getElementById('youtube-player');
    if (player) {
        player.src = "";
    }
}

function backToMenuTrivia() {
    document.getElementById('section-trivia').style.display = 'none';
    document.getElementById('main-menu').style.display = 'flex';
}

function backToMenuGuia() {
    document.getElementById('section-guia').style.display = 'none';
    document.getElementById('main-menu').style.display = 'flex';
}