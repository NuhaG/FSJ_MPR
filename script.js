document.addEventListener('DOMContentLoaded', () => {
  const ham = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.nav-links');

  if (!ham || !nav) return;
  ham.addEventListener('click', () => {
    nav.classList.toggle('active');
  });
});
