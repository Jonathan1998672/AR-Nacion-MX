document.addEventListener("DOMContentLoaded", async () => {
    const ui = document.getElementById('ui-container');
    const statsPanel = document.getElementById('stats-panel');
    const btnStats = document.getElementById('btn-stats');
    const btnClose = document.getElementById('btn-close');
    const btnVerPartidos = document.getElementById('btn-ver-partidos');
    const listaPartidos = document.getElementById('lista-partidos');


    let currentTargetId = null;
    let seleccionesData = {};

    let isDragging = false;
    let previousMouseX = 0;

    try {
        const response = await fetch('datos.json');
        seleccionesData = await response.json();
    } catch (error) {
        console.error("Error cargando el JSON:", error);
    }

    Object.keys(seleccionesData).forEach(id => {
        const entity = document.getElementById(id);
        const modelId = id === 'target-mexico' ? 'model-mexico' : 'model-japon';
        const modelEntity = document.getElementById(modelId);

        if (entity && modelEntity) {
            entity.addEventListener("targetFound", () => {
                currentTargetId = id;
                modelEntity.setAttribute('visible', true);

                const sceneEl = document.querySelector('a-scene');
                sceneEl.systems['mindar-image-system'].stop();

                const scanningOverlay = document.querySelector('.mindar-ui-scanning');
                if (scanningOverlay) {
                    scanningOverlay.style.display = 'none';
                }

                const sectionScanner = document.getElementById('section-scanner');
                sectionScanner.style.background = "linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('uploads/estadio.png')";
                sectionScanner.style.backgroundSize = "cover";

                document.getElementById('btn-regresar').style.display = 'none';
                document.getElementById('btn-reset-escaneo').style.display = 'block';

                if (ui) {
                    ui.style.display = "flex";
                    ui.style.visibility = "visible";
                }
            });

        }
    });

    window.reiniciarEscaneo = function () {
        document.getElementById('model-mexico').setAttribute('visible', false);
        document.getElementById('model-japon').setAttribute('visible', false);
        document.getElementById('ui-container').style.display = 'none';
        document.getElementById('stats-panel').style.display = 'none';

        document.getElementById('btn-regresar').style.display = 'block';
        document.getElementById('btn-reset-escaneo').style.display = 'none';

        const sectionScanner = document.getElementById('section-scanner');
        sectionScanner.style.background = "transparent";

        const scanningOverlay = document.querySelector('.mindar-ui-scanning');
        if (scanningOverlay) {
            scanningOverlay.style.display = 'flex';
        }

        const sceneEl = document.querySelector('a-scene');
        sceneEl.systems['mindar-image-system'].start();
    };

    document.addEventListener('mousedown', (e) => { isDragging = true; previousMouseX = e.clientX; });
    document.addEventListener('touchstart', (e) => { isDragging = true; previousMouseX = e.touches[0].clientX; });

    document.addEventListener('mouseup', () => { isDragging = false; });
    document.addEventListener('touchend', () => { isDragging = false; });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging || !currentTargetId) return;
        handleRotation(e.clientX);
    });

    document.addEventListener('touchmove', (e) => {
        if (!isDragging || !currentTargetId) return;
        handleRotation(e.touches[0].clientX);
    });

    function handleRotation(currentX) {
        const deltaX = currentX - previousMouseX;
        previousMouseX = currentX;

        const modelId = currentTargetId === 'target-mexico' ? 'model-mexico' : 'model-japon';
        const model = document.getElementById(modelId);

        if (model) {
            let rotation = model.getAttribute('rotation');
            rotation.y += deltaX * 0.5;
            model.setAttribute('rotation', rotation);
        }
    }

    btnStats.addEventListener("click", () => {
        if (currentTargetId) {
            const data = seleccionesData[currentTargetId];
            const titleHTML = `
                <div id="stats-title-container">
                    <h2 id="stats-title">${data.name}</h2>
                    <img src="${data.flag}" class="flag-icon">
                </div>
            `;
            statsPanel.querySelector('#stats-title-container')?.remove();
            statsPanel.insertAdjacentHTML('afterbegin', titleHTML);

            const infoContainer = document.getElementById('stats-info');
            infoContainer.innerHTML = "";

            const ul = document.createElement('ul');
            ul.className = "lista-info-premium";

            data.info.forEach(punto => {
                const li = document.createElement('li');
                li.textContent = punto;
                ul.appendChild(li);
            });

            infoContainer.appendChild(ul);

            listaPartidos.style.display = "none";
            statsPanel.style.display = "block";
        }
    });

    btnVerPartidos.addEventListener("click", () => {
        const partidos = seleccionesData[currentTargetId].partidos;
        listaPartidos.innerHTML = "<h4 style='color:#28a745'>Sedes en México:</h4>";

        partidos.forEach(p => {
            listaPartidos.innerHTML += `
                <div class="partido-card">
                    <small style="color:#888">${p.fecha}</small><br>
                    <strong>${p.equipo1} vs ${p.equipo2}</strong><br>
                    📍 <a href="${p.mapa}" target="_blank">${p.estadio}</a>
                </div>
            `;
        });
        listaPartidos.style.display = "block";
    });

    btnClose.addEventListener("click", () => { statsPanel.style.display = "none"; });
});