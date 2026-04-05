let modeloActivo = null;
let escalaActual = 0.2;
const escalaMin = 0.1;
const escalaMax = 0.5;
let tocando = false;
let lastX = 0;
let lastY = 0;
let distanciaInicial = 0;
let posicionesOriginales = {};
let escalasOriginales = {};

document.addEventListener("DOMContentLoaded", async () => {

    const ui = document.getElementById('ui-container');
    const statsPanel = document.getElementById('stats-panel');
    const btnStats = document.getElementById('btn-stats');
    const btnClose = document.getElementById('btn-close');
    const btnVerPartidos = document.getElementById('btn-ver-partidos');
    const listaPartidos = document.getElementById('lista-partidos');
    const btnAnim = document.getElementById('btn-toggle-anim');
    const btnVerModelo = document.getElementById('btn-ver-modelo');
    const audioPlayer = document.getElementById('musica-pais');
    const sceneEl = document.querySelector('a-scene');
    const loadingScreen = document.getElementById('loading-screen');

    let currentTargetId = null;
    let seleccionesData = {};

    const esMovil = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    const configDispositivo = esMovil
        ? { position: "0 -2 -15.5", scale: "0.8 0.8 0.8" }
        : { position: "0 -2 -12.5", scale: "1 1 1" };

    const rotacionesOriginales = {};

    document.querySelectorAll('[id^="model-"]').forEach(model => {
        const rot = model.getAttribute('rotation');
        rotacionesOriginales[model.id] = {
            x: rot.x,
            y: rot.y,
            z: rot.z
        };
    });

    document.querySelectorAll('[id^="model-"]').forEach(model => {

        const pos = model.getAttribute('position');
        const scale = model.getAttribute('scale');

        posicionesOriginales[model.id] = {
            x: 0,
            y: -0.5,
            z: 0.6
        };

        escalasOriginales[model.id] = {
            x: 0.2,
            y: 0.2,
            z: 0.2
        };

    });

    const hideLoading = () => {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
    };

    sceneEl.addEventListener("loaded", () => {
        setTimeout(hideLoading, 1500);
    });

    const modelMap = {

        'target-mexico': { static: 'model-mexico', animated: 'model-mexico-animated', audio: 'Musica/Mexico.mp3' },
        'target-japon': { static: 'model-japon', animated: 'model-japon-animated', audio: 'Musica/Japon.mp3' },
        'target-sudafrica': { static: 'model-sudafrica', animated: 'model-sudafrica-animated', audio: 'Musica/Sudafrica.mp3' },
        'target-surcorea': { static: 'model-surcorea', animated: 'model-surcorea-animated', audio: 'Musica/surcorea.mp3' },
        'target-ucrania': { static: 'model-ucrania', animated: 'model-ucrania-animated', audio: 'Musica/ucrania.mp3' },
        'target-tunez': { static: 'model-tunez', animated: 'model-tunez-animated', audio: 'Musica/tunez.mp3' },
        'target-uzbekistan': { static: 'model-uzbekistan', animated: 'model-uzbekistan-animated', audio: 'Musica/Uzbekistan.mp3' },
        'target-colombia': { static: 'model-colombia', animated: 'model-colombia-animated', audio: 'Musica/colombia.mp3' },
        'target-capeverde': { static: 'model-capeverde', animated: 'model-capeverde-animated', audio: 'Musica/caboverde.mp3' },
        'target-arabiasaudita': { static: 'model-arabiasaudita', animated: 'model-arabiasaudita-animated', audio: 'Musica/arabiasaudita.mp3' }

    };

    const flagMap = {
        'target-mexico': 'uploads/mexico-flag.png',
        'target-japon': 'uploads/japon-flag.png',
        'target-sudafrica': 'uploads/sudafrica-flag.png',
        'target-surcorea': 'uploads/surcorea-flag.png',
        'target-ucrania': 'uploads/ucrania-flag.png',
        'target-tunez': 'uploads/tunez-flag.png',
        'target-uzbekistan': 'uploads/uzbekistan-flag.png',
        'target-colombia': 'uploads/colombia-flag.png',
        'target-capeverde': 'uploads/capeverde-flag.png',
        'target-arabiasaudita': 'uploads/arabiasaudita-flag.png'
    };

    try {

        const response = await fetch('datos.json');
        seleccionesData = await response.json();

    } catch (error) {

        console.error("Error cargando el JSON:", error);

    }

    function resetModelos() {
        const todosLosModelos = [

            'model-mexico', 'model-mexico-animated',
            'model-japon', 'model-japon-animated',
            'model-sudafrica', 'model-sudafrica-animated',
            'model-surcorea', 'model-surcorea-animated',
            'model-ucrania', 'model-ucrania-animated',
            'model-tunez', 'model-tunez-animated',
            'model-uzbekistan', 'model-uzbekistan-animated',
            'model-colombia', 'model-colombia-animated',
            'model-capeverde', 'model-capeverde-animated',
            'model-arabiasaudita', 'model-arabiasaudita-animated'
        ];

        todosLosModelos.forEach(mId => {
            const mod = document.getElementById(mId);

            if (mod) {
                mod.setAttribute('visible', false);

                if (rotacionesOriginales[mId]) {
                    mod.setAttribute('rotation', rotacionesOriginales[mId]);
                }

                if (posicionesOriginales[mId]) {
                    mod.setAttribute('position', posicionesOriginales[mId]);
                }

                if (escalasOriginales[mId]) {
                    mod.setAttribute('scale', escalasOriginales[mId]);
                }
            }

        });

        const audio = document.querySelectorAll("audio");
        audio.forEach(a => {
            a.pause();
            a.currentTime = 0;
        });
        currentTargetId = null;

        ParticleSystem.deactivate();

    }

    const registerTargets = () => {
        Object.keys(modelMap).forEach(id => {
            const entity = document.getElementById(id);

            if (entity) {
                const handleFound = () => {
                    console.log("Escaner detecto:", id);
                    currentTargetId = id;

                    const models = modelMap[id];
                    const modelStatic = document.getElementById(models.static);
                    const modelAnim = document.getElementById(models.animated);

                    if (modelStatic) modelStatic.setAttribute('visible', true);
                    if (modelAnim) modelAnim.setAttribute('visible', false);

                    ui.style.display = "flex";
                    if (btnVerModelo) btnVerModelo.style.display = "block";

                    document.getElementById('btn-regresar').style.display = 'block';
                    document.getElementById('btn-reset-escaneo').style.display = 'none';
                };

                entity.addEventListener("targetFound", handleFound);

                entity.addEventListener("targetLost", () => {
                    console.log("Escaner perdio:", id);
                    const models = modelMap[id];
                    const staticModel = document.getElementById(models.static);
                    const animModel = document.getElementById(models.animated);

                    if (staticModel) staticModel.setAttribute('visible', false);
                    if (animModel) animModel.setAttribute('visible', false);

                    ui.style.display = "none";
                    if (btnVerModelo) btnVerModelo.style.display = "none";
                    statsPanel.style.display = "none";
                    resetModelos();
                });
            }
        });
    };

    registerTargets();

    function activarControles() {

        const scene = document.querySelector("a-scene");

        scene.addEventListener("mousedown", e => {
            tocando = true;
            lastX = e.clientX;
            lastY = e.clientY;
        });

        scene.addEventListener("mouseup", () => tocando = false);

        scene.addEventListener("mousemove", e => {

            if (!tocando || !modeloActivo) return;

            let dx = e.clientX - lastX;
            let dy = e.clientY - lastY;

            let rot = modeloActivo.getAttribute("rotation");

            rot.y += dx * 0.5;
            rot.x += dy * 0.5;

            modeloActivo.setAttribute("rotation", rot);

            lastX = e.clientX;
            lastY = e.clientY;

        });

        scene.addEventListener("wheel", e => {

            if (!modeloActivo) return;

            e.preventDefault();

            escalaActual += e.deltaY * -0.0003;

            escalaActual = Math.min(Math.max(escalaMin, escalaActual), escalaMax);

            modeloActivo.setAttribute("scale",
                `${escalaActual} ${escalaActual} ${escalaActual}`);

        });

        scene.addEventListener("touchstart", e => {

            if (e.touches.length == 1) {

                tocando = true;
                lastX = e.touches[0].clientX;
                lastY = e.touches[0].clientY;

            }

            if (e.touches.length == 2) {

                let dx = e.touches[0].clientX - e.touches[1].clientX;
                let dy = e.touches[0].clientY - e.touches[1].clientY;

                distanciaInicial = Math.sqrt(dx * dx + dy * dy);

            }

        });

        scene.addEventListener("touchmove", e => {

            if (!modeloActivo) return;

            if (e.touches.length == 1 && tocando) {

                let dx = e.touches[0].clientX - lastX;
                let dy = e.touches[0].clientY - lastY;

                let rot = modeloActivo.getAttribute("rotation");

                rot.y += dx * 0.4;
                rot.x += dy * 0.4;

                modeloActivo.setAttribute("rotation", rot);

                lastX = e.touches[0].clientX;
                lastY = e.touches[0].clientY;

            }

            if (e.touches.length == 2) {

                let dx = e.touches[0].clientX - e.touches[1].clientX;
                let dy = e.touches[0].clientY - e.touches[1].clientY;

                let distanciaActual = Math.sqrt(dx * dx + dy * dy);

                let factor = distanciaActual / distanciaInicial;

                escalaActual *= factor;

                escalaActual = Math.min(Math.max(0.2, escalaActual), 3);

                modeloActivo.setAttribute("scale",
                    `${escalaActual} ${escalaActual} ${escalaActual}`);

                distanciaInicial = distanciaActual;

            }

        });

    }

    if (btnVerModelo) {

        btnVerModelo.addEventListener("click", () => {

            if (!currentTargetId) return;

            const models = modelMap[currentTargetId];

            const staticModel = document.getElementById(models.static);
            const animModel = document.getElementById(models.animated);

            const model = staticModel.getAttribute('visible') ? staticModel : animModel;

            sceneEl.systems['mindar-image-system'].stop();

            const scanningOverlay = document.querySelector('.mindar-ui-scanning');
            if (scanningOverlay) scanningOverlay.style.display = 'none';

            const sectionScanner = document.getElementById('section-scanner');

            sectionScanner.style.background =
                "linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('uploads/estadio.png')";
            sectionScanner.style.backgroundSize = "cover";

            model.setAttribute("visible", true);

            btnVerModelo.style.display = "none";
            document.getElementById('btn-regresar').style.display = 'none';
            document.getElementById('btn-reset-escaneo').style.display = 'block';

            modeloActivo = model;
            modeloActivo.pause();
            document.getElementById("controls-3d").style.display = "flex";
            document.getElementById("controles-mover").style.display = "flex";
            activarControles();

        });
    }

    btnStats.addEventListener("click", () => {
        if (currentTargetId && seleccionesData[currentTargetId]) {
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
        if (currentTargetId && seleccionesData[currentTargetId]) {
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
        }
    });

    btnClose.addEventListener("click", () => statsPanel.style.display = "none");

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
                audioPlayer.play();

            }

            const rutaImagen = flagMap[currentTargetId];
            ParticleSystem.activate(rutaImagen);

        } else {

            staticModel.setAttribute('visible', true);
            animModel.setAttribute('visible', false);

            if (audioPlayer) {

                audioPlayer.pause();
                audioPlayer.currentTime = 0;

            }

            ParticleSystem.deactivate();

        }

    });

    const btnResetEscaneo = document.getElementById('btn-reset-escaneo');

    if (btnResetEscaneo) {
        btnResetEscaneo.addEventListener("click", () => {

            resetModelos();
            sceneEl.systems['mindar-image-system'].start();
            const scanningOverlay = document.querySelector('.mindar-ui-scanning');
            if (scanningOverlay) scanningOverlay.style.display = 'flex';
            const sectionScanner = document.getElementById('section-scanner');
            sectionScanner.style.background = "";
            ui.style.display = "none";
            statsPanel.style.display = "none";
            document.getElementById('btn-regresar').style.display = 'block';
            btnResetEscaneo.style.display = 'none';
            btnVerModelo.style.display = 'none';

            if (modeloActivo) {
                modeloActivo.play();
            }

            modeloActivo = null;
            document.getElementById("controls-3d").style.display = "none";
            document.getElementById("controles-mover").style.display = "none";
            escalaActual = 1;


        });

    }

});

function rotarModelo(eje, valor) {

    if (!modeloActivo) return;

    let rot = modeloActivo.getAttribute("rotation");

    rot[eje] += valor;

    modeloActivo.setAttribute("rotation", rot);

}

function moverModelo(eje, valor) {
    console.log("mover");
    if (!modeloActivo) return;

    let pos = modeloActivo.getAttribute("position");

    pos[eje] = pos[eje] + valor;

    modeloActivo.setAttribute("position", pos);

}