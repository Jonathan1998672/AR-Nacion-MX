document.addEventListener("DOMContentLoaded", async () => {
    const ui = document.getElementById('ui-container');
    const statsPanel = document.getElementById('stats-panel');
    const btnStats = document.getElementById('btn-stats');
    const btnClose = document.getElementById('btn-close');
    const btnVerPartidos = document.getElementById('btn-ver-partidos');
    const listaPartidos = document.getElementById('lista-partidos');
    const btnAnim = document.getElementById('btn-toggle-anim');
    const audioPlayer = document.getElementById('musica-pais');

    const targets = [
        "mexico",
        "japon",
        "sudafrica",
        "surcorea",
        "ucrania",
        "tunez",
        "uzbekistan",
        "colombia",
        "capeverde",
        "arabiasaudita"
    ];

    targets.forEach((name) => {

        const target = document.querySelector("#target-" + name);

        target.addEventListener("targetFound", () => {
            console.log("Se escaneó: " + name);
        });

    });


    let currentTargetId = null;
    let seleccionesData = {};

    let isDragging = false;
    let previousMouseX = 0;

    const esMovil = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const configDispositivo = esMovil
        ? { position: "0 -2 -15.5", scale: "0.8 0.8 0.8" }
        : { position: "0 -2 -12.5", scale: "1 1 1" };

    try {
        const response = await fetch('datos.json');
        seleccionesData = await response.json();
    } catch (error) {
        console.error("Error cargando el JSON:", error);
    }

    const modelMap = {
        'target-mexico': { static: 'model-mexico', animated: 'model-mexico-animated', audio: 'Musica/Mexico.mp3' },
        'target-japon': { static: 'model-japon', animated: 'model-japon-animated', audio: 'Musica/Japon.mp3' },
        'target-sudafrica': { static: 'model-sudafrica', animated: 'model-sudafrica-animated', audio: 'Musica/Sudafrica.mp3' },
        'target-surcorea': { static: 'model-surcorea', animated: 'model-surcorea-animated', audio: 'Musica/surcorea.mp3' },
        'target-tunez': { static: 'model-tunez', animated: 'model-tunez-animated', audio: 'Musica/tunez.mp3' }
    };

    Object.values(modelMap).forEach(m => {
        const s = document.getElementById(m.static);
        const a = document.getElementById(m.animated);
        if (s) { s.setAttribute('position', configDispositivo.position); s.setAttribute('scale', configDispositivo.scale); }
        if (a) { a.setAttribute('position', configDispositivo.position); a.setAttribute('scale', configDispositivo.scale); }
    });

    btnAnim.addEventListener("click", () => {
        if (!currentTargetId || !modelMap[currentTargetId]) return;

        const models = modelMap[currentTargetId];
        const staticModel = document.getElementById(models.static);
        const animModel = document.getElementById(models.animated);

        const isStaticVisible = staticModel.getAttribute('visible');

        if (isStaticVisible) {
            staticModel.setAttribute('visible', false);
            animModel.setAttribute('visible', true);
            if (audioPlayer) {
                audioPlayer.src = models.audio;
                audioPlayer.play().catch(e => console.log("Error al reproducir:", e));
            }
        } else {
            staticModel.setAttribute('visible', true);
            animModel.setAttribute('visible', false);
            if (audioPlayer) {
                audioPlayer.pause();
                audioPlayer.currentTime = 0;
            }
        }
    });

    Object.keys(seleccionesData).forEach(id => {
        const entity = document.getElementById(id);

        if (entity) {
            entity.addEventListener("targetFound", () => {
                currentTargetId = id;

                const todosLosModelos = [
                    'model-mexico', 'model-mexico-animated',
                    'model-japon', 'model-japon-animated',
                    'model-sudafrica', 'model-sudafrica-animated',
                    'model-surcorea', 'model-surcorea-animated',
                    'model-tunez', 'model-tunez-animated'
                ];
                todosLosModelos.forEach(mId => {
                    const mod = document.getElementById(mId);
                    if (mod) mod.setAttribute('visible', false);
                });

                let modelIdBase;
                if (id === 'target-mexico') modelIdBase = 'model-mexico';
                else if (id === 'target-japon') modelIdBase = 'model-japon';
                else if (id === 'target-sudafrica') modelIdBase = 'model-sudafrica';
                else if (id === 'target-surcorea') modelIdBase = 'model-surcorea';
                else if (id === 'target-tunez') modelIdBase = 'model-tunez';

                const modelEntity = document.getElementById(modelIdBase);
                if (modelEntity) modelEntity.setAttribute('visible', true);

                const sceneEl = document.querySelector('a-scene');
                sceneEl.systems['mindar-image-system'].stop();

                const scanningOverlay = document.querySelector('.mindar-ui-scanning');
                if (scanningOverlay) scanningOverlay.style.display = 'none';

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
        document.getElementById('model-mexico-animated').setAttribute('visible', false);
        document.getElementById('model-japon').setAttribute('visible', false);
        document.getElementById('model-japon-animated').setAttribute('visible', false);
        document.getElementById('model-sudafrica').setAttribute('visible', false);
        document.getElementById('model-sudafrica-animated').setAttribute('visible', false);
        document.getElementById('model-surcorea').setAttribute('visible', false);
        document.getElementById('model-surcorea-animated').setAttribute('visible', false);
        document.getElementById('model-tunez').setAttribute('visible', false);
        document.getElementById('model-tunez-animated').setAttribute('visible', false);
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

        if (audioPlayer) {
            audioPlayer.pause();
            audioPlayer.currentTime = 0;
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

        if (!currentTargetId) return;

        let staticId, animatedId;

        if (currentTargetId === 'target-mexico') {
            staticId = 'model-mexico'; animatedId = 'model-mexico-animated';
        } else if (currentTargetId === 'target-japon') {
            staticId = 'model-japon'; animatedId = 'model-japon-animated';
        } else if (currentTargetId === 'target-sudafrica') {
            staticId = 'model-sudafrica'; animatedId = 'model-sudafrica-animated';
        } else if (currentTargetId === 'target-surcorea') {
            staticId = 'model-surcorea'; animatedId = 'model-surcorea-animated';
        } else if (currentTargetId === 'target-tunez') {
            staticId = 'model-tunez'; animatedId = 'model-tunez-animated';
        }

        const modelStatic = document.getElementById(staticId);
        const modelAnim = document.getElementById(animatedId);

        [modelStatic, modelAnim].forEach(model => {
            if (model && model.getAttribute('visible') === true) {
                let rotation = model.getAttribute('rotation');
                rotation.y += deltaX * 0.5;
                model.setAttribute('rotation', rotation);
            }
        });
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
                    <a href="${p.mapa}" target="_blank">${p.estadio}</a>
                </div>
            `;
        });
        listaPartidos.style.display = "block";
    });

    btnClose.addEventListener("click", () => { statsPanel.style.display = "none"; });
});