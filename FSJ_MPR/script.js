const ham = document.querySelector('.nav-toggle');
const nav = document.querySelector('.nav-links');

ham.addEventListener('click', () => {
    nav.classList.toggle('active');
});