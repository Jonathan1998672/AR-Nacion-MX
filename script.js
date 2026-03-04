document.addEventListener("DOMContentLoaded", async () => {
    const ui = document.getElementById('ui-container');
    const statsPanel = document.getElementById('stats-panel');
    const btnStats = document.getElementById('btn-stats');
    const btnClose = document.getElementById('btn-close');
    const btnVerPartidos = document.getElementById('btn-ver-partidos');
    const listaPartidos = document.getElementById('lista-partidos');
    const btnRegresar = document.querySelector('.btn-regresar');

    let currentTargetId = null;
    let seleccionesData = {};

    try {
        const response = await fetch('datos.json');
        seleccionesData = await response.json();
    } catch (error) {
        console.error("Error cargando el JSON:", error);
    }

    Object.keys(seleccionesData).forEach(id => {
        const entity = document.getElementById(id);
        if (entity) {
            entity.addEventListener("targetFound", () => {
                currentTargetId = id;
                
                if (ui) {
                    ui.style.display = "flex";
                    ui.style.visibility = "visible"; 
                }

                if (btnRegresar) btnRegresar.style.display = 'none';
            });

            entity.addEventListener("targetLost", () => {
                ui.style.display = "none";
                statsPanel.style.display = "none";
                currentTargetId = null;

                if (btnRegresar) btnRegresar.style.display = 'block';
            });
        }
    });

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