function mostrarRecursoGuia(url, tipo) {
    const modal = document.getElementById('guia-preview-modal');
    const container = document.getElementById('guia-media-container');
    
    container.innerHTML = '';
    
    const estiloAjustado = "max-width: 100%; max-height: 75vh; height: auto; width: auto; border-radius: 10px; border: 2px solid #28a745; object-fit: contain;";

    if (tipo === 'video') {
        const video = document.createElement('video');
        video.src = url;
        video.autoplay = true;
        video.loop = true;
        video.muted = true;
        video.style.width = '100%';
        video.style.borderRadius = '15px';
        video.style.boxShadow = '0 0 20px #28a745';
        container.appendChild(video);
    } else {
        const img = document.createElement('img');
        img.src = url;
        img.style.width = '100%';
        img.style.borderRadius = '15px';
        img.style.boxShadow = '0 0 20px #28a745';
        container.appendChild(img);
    }
    
    modal.style.display = 'flex';
}

function cerrarPreviewGuia() {
    const modal = document.getElementById('guia-preview-modal');
    const container = document.getElementById('guia-media-container');
    
    container.innerHTML = '';
    modal.style.display = 'none';
}

function verTab(tabId, event) {
    const contents = document.querySelectorAll('.tab-content');
    contents.forEach(content => content.style.display = 'none');

    const buttons = document.querySelectorAll('.tab-btn');
    buttons.forEach(btn => btn.classList.remove('active'));

    const targetTab = document.getElementById(tabId);
    if (targetTab) {
        targetTab.style.display = 'block';
    }

    if (event && event.currentTarget) {
        event.currentTarget.classList.add('active');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const primeraTab = document.querySelector('.tab-btn');
    if (primeraTab) {
        verTab('guia-trivia', null); 
    }
});