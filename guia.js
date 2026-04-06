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