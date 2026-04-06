document.addEventListener("DOMContentLoaded", () => {
    cargarPlaylist();
});

async function cargarPrimerVideo() {
    try {
        const response = await fetch('videos.json');
        const videos = await response.json();
        if (videos.length > 0) {
            const player = document.getElementById('youtube-player');
            player.src = `https://www.youtube.com/embed/${videos[0].youtubeId}?autoplay=1`;
        }
    } catch (e) {
        console.error("Error al cargar el video inicial:", e);
    }
}

async function cargarPlaylist() {
    const listaContenedor = document.getElementById('lista-items-video');
    const player = document.getElementById('youtube-player');

    try {
        const response = await fetch('videos.json');
        const videos = await response.json();

        listaContenedor.innerHTML = ""; 

        videos.forEach((vid, index) => {
            const btn = document.createElement('div');
            btn.className = 'video-item-card';
            btn.innerHTML = `<strong>${vid.titulo}</strong>`;
            
            btn.onclick = () => {
                player.src = `https://www.youtube.com/embed/${vid.youtubeId}?autoplay=1`;
                applyFilter('none'); 
            };

            listaContenedor.appendChild(btn);
        });
    } catch (e) {
        console.error("Error cargando la lista de videos:", e);
    }
}

function applyFilter(filterType) {
    const player = document.getElementById('youtube-player');
    
    player.style.imageRendering = "auto";
    player.style.filter = "none";
    
    const filters = {
        'none': 'none',
        'pixel': 'blur(2px)', 
        
        'blur': 'blur(10px)',
        'saturate': 'saturate(5)',
        'thermal': 'invert(1) hue-rotate(180deg) saturate(3)',
        'black-white': 'grayscale(1)',
        'sepia': 'sepia(1)',
        'vhs': 'sepia(0.2) hue-rotate(10deg) contrast(1.1)',
        'security-cam': 'sepia(1) hue-rotate(70deg) saturate(3)',
        'invert': 'invert(1)',
        'manga': 'grayscale(1) contrast(10) brightness(1.2)', 
        'techno': 'hue-rotate(280deg) saturate(2)',
        'gold': 'sepia(0.5) hue-rotate(-15deg) saturate(4)'
    };
    
    if (filterType === 'pixel') {
        player.style.imageRendering = "pixelated";
        player.style.imageRendering = "crisp-edges";
        player.style.filter = filters['pixel'];
    } else {
        player.style.filter = filters[filterType] || 'none';
    }
}