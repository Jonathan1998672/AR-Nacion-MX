let preguntasTotales = [];
let preguntasSesion = [];
let indicePregunta = 0;
let puntaje = 0;
let cantidadParaEstaSesion = 0;

async function iniciarTrivia() {
    try {
        const respuesta = await fetch('preguntas.json');
        preguntasTotales = await respuesta.json();

        cantidadParaEstaSesion = Math.floor(Math.random() * (18 - 12 + 1)) + 12;

        preguntasSesion = preguntasTotales
            .sort(() => Math.random() - 0.5)
            .slice(0, cantidadParaEstaSesion);

        indicePregunta = 0;
        puntaje = 0;
        mostrarPregunta();
    } catch (error) {
        console.error("Error cargando la trivia:", error);
        document.getElementById('contenedor-trivia').innerHTML = "<p>Error al cargar las preguntas.</p>";
    }
}

function mostrarPregunta() {
    const contenedor = document.getElementById('contenedor-trivia');
    const data = preguntasSesion[indicePregunta];

    const opcionesMezcladas = data.opciones
        .map((texto, i) => ({ texto, esCorrecta: i === data.correcta }))
        .sort(() => Math.random() - 0.5);

    contenedor.innerHTML = `
        <div class="trivia-card">
            <p class="trivia-progreso">Pregunta ${indicePregunta + 1} de ${cantidadParaEstaSesion}</p>
            <h3 class="trivia-pregunta">${data.pregunta}</h3>
            <div class="opciones-grid">
                ${opcionesMezcladas.map((op) => `
                    <button class="opcion-btn" 
                            data-correcta="${op.esCorrecta}" 
                            onclick="verificarRespuesta(this)">${op.texto}</button>
                `).join('')}
            </div>
        </div>
    `;
}

function verificarRespuesta(botonSeleccionado) {
    const botones = document.querySelectorAll('.opcion-btn');
    const esCorrecta = botonSeleccionado.getAttribute('data-correcta') === "true";

    botones.forEach(btn => btn.style.pointerEvents = 'none');

    if (esCorrecta) {
        puntaje++;
        botonSeleccionado.classList.add('correct');
    } else {
        botonSeleccionado.classList.add('incorrect');
        botones.forEach(btn => {
            if (btn.getAttribute('data-correcta') === "true") {
                btn.classList.add('correct');
            }
        });
    }

    setTimeout(() => {
        indicePregunta++;
        if (indicePregunta < preguntasSesion.length) {
            mostrarPregunta();
        } else {
            finalizarTrivia();
        }
    }, 1800);
}

function finalizarTrivia() {
    const contenedor = document.getElementById('contenedor-trivia');
    let mensaje = "";
    const porcentaje = (puntaje / cantidadParaEstaSesion) * 100;

    if (porcentaje === 100) mensaje = "¡Nivel Dios Mundialista!";
    else if (porcentaje >= 70) mensaje = "¡Gran conocimiento!";
    else mensaje = "¡Sigue practicando!";

    contenedor.innerHTML = `
        <div class="trivia-card resultado">
            <h2>${mensaje}</h2>
            <p>Lograste <strong>${puntaje}</strong> aciertos de <strong>${cantidadParaEstaSesion}</strong> preguntas.</p>
            <button class="menu-btn" onclick="iniciarTrivia()">Jugar de nuevo</button>
        </div>
    `;
}