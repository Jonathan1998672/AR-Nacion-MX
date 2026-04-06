/**
 * Maneja el cambio de pestañas dentro de la sección Guía.
 */
function verTab(tabId, event) {
    // Ocultar todos los contenidos de las pestañas
    const contents = document.querySelectorAll('.tab-content');
    contents.forEach(content => content.style.display = 'none');

    // Quitar la clase activa de todos los botones de pestañas
    const buttons = document.querySelectorAll('.tab-btn');
    buttons.forEach(btn => btn.classList.remove('active'));

    // Mostrar el contenido de la pestaña seleccionada
    const targetTab = document.getElementById(tabId);
    if (targetTab) {
        targetTab.style.display = 'block';
    }

    // Añadir clase activa al botón que recibió el clic usando el evento
    if (event && event.currentTarget) {
        event.currentTarget.classList.add('active');
    }
}

// Opcional: Asegurar que la primera pestaña esté lista al cargar
document.addEventListener('DOMContentLoaded', () => {
    const primeraTab = document.querySelector('.tab-btn');
    // Solo disparamos el clic si la sección está visible o para inicializar estados
    if (primeraTab) {
        // No pasamos evento aquí para evitar errores si no hay interacción real aún
        verTab('guia-trivia', null); 
    }
});