const triviaData = [
    {
        pregunta: "¿En qué estadio de México se jugará el partido inaugural del Mundial 2026?",
        opciones: ["Estadio BBVA", "Estadio Azteca", "Estadio Akron"],
        correcta: 1 
    },
    {
        pregunta: "¿Cuántas sedes tendrá México para el Mundial 2026?",
        opciones: ["2 sedes", "4 sedes", "3 sedes"],
        correcta: 2 
    },
    {
        pregunta: "¿Qué selección asiática ya has escaneado en esta app y participará en 2026?",
        opciones: ["Corea del Sur", "Japón", "Arabia Saudita"],
        correcta: 1 
    },
    {
        pregunta: "¿Cuántas veces habrá sido México anfitrión de una Copa del Mundo tras el 2026?",
        opciones: ["2 veces", "3 veces", "1 vez"],
        correcta: 1 
    }
];

let indicePregunta = 0;
let puntaje = 0;

function iniciarTrivia() {
    indicePregunta = 0;
    puntaje = 0;
    mostrarPregunta();
}

function mostrarPregunta() {
    const contenedor = document.getElementById('contenedor-trivia');
    const preguntaActual = triviaData[indicePregunta];

    contenedor.innerHTML = `
        <div class="trivia-card">
            <p class="trivia-progreso">Pregunta ${indicePregunta + 1} de ${triviaData.length}</p>
            <h3 class="trivia-pregunta">${preguntaActual.pregunta}</h3>
            <div class="opciones-grid">
                ${preguntaActual.opciones.map((opcion, i) => `
                    <button class="opcion-btn" onclick="verificarRespuesta(${i})">${opcion}</button>
                `).join('')}
            </div>
        </div>
    `;
}

function verificarRespuesta(seleccionado) {
    const preguntaActual = triviaData[indicePregunta];
    const botones = document.querySelectorAll('.opcion-btn');
    
    botones.forEach(btn => btn.style.pointerEvents = 'none');

    if (seleccionado === preguntaActual.correcta) {
        puntaje++;
        botones[seleccionado].classList.add('correct');
    } else {
        botones[seleccionado].classList.add('incorrect');
        botones[preguntaActual.correcta].classList.add('correct');
    }

    setTimeout(() => {
        indicePregunta++;
        if (indicePregunta < triviaData.length) {
            mostrarPregunta();
        } else {
            finalizarTrivia();
        }
    }, 1500); 
}

function finalizarTrivia() {
    const contenedor = document.getElementById('contenedor-trivia');
    contenedor.innerHTML = `
        <div class="trivia-card resultado">
            <h2>¡Trivia Finalizada!</h2>
            <p>Tu puntaje: <strong>${puntaje} / ${triviaData.length}</strong></p>
            <button class="menu-btn" onclick="iniciarTrivia()">Reintentar</button>
        </div>
    `;
}