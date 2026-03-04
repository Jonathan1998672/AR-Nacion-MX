document.addEventListener("DOMContentLoaded", () => {
    cargarPlaylist();
});

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

            if (index === 0 && player.src === "") {
                player.src = `https://www.youtube.com/embed/${vid.youtubeId}`;
            }
        });
    } catch (e) {
        console.error("Error cargando la lista de videos:", e);
    }
}

function applyFilter(filterType) {
    const player = document.getElementById('youtube-player');
    
    const filters = {
        'none': 'none',
        'blur': 'blur(8px)',
        'pixel': 'contrast(180%) blur(2px) grayscale(0.5)',
        'saturate': 'saturate(5)',
        'thermal': 'invert(1) hue-rotate(180deg) saturate(3)'
    };
    
    player.style.filter = filters[filterType] || 'none';
}