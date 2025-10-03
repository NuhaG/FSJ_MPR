document.addEventListener('DOMContentLoaded', () => {
  // Create theme toggle button
  const tbtn = document.createElement('button');
  tbtn.id = 'theme-toggle';
  tbtn.setAttribute('aria-label', 'Toggle dark mode');
  tbtn.style.cssText = `
    position: fixed;
    right: 16px;
    bottom: 16px;
    padding: 12px;
    border-radius: 50%;
    z-index: 9999;
    font-size: 18px;
    background: var(--primary-color);
    border: 2px solid var(--primary-color);
    color: var(--surface-color);
    cursor: pointer;
    transition: transform 0.3s ease, background 0.3s ease, color 0.3s ease;
  `;
  document.body.appendChild(tbtn);

  // Load Font Awesome if not already present
  if (!document.querySelector('#fa-link')) {
    const faLink = document.createElement('link');
    faLink.id = 'fa-link';
    faLink.rel = 'stylesheet';
    faLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
    document.head.appendChild(faLink);
  }

  function updateIcon(theme) {
    // Animate button with a little spin
    tbtn.style.transform = 'rotate(360deg)';
    setTimeout(() => tbtn.style.transform = 'rotate(0deg)', 300);

    // Update icon safely (after Font Awesome loads)
    tbtn.innerHTML = theme === 'dark'
      ? '<i class="fas fa-sun"></i>'
      : '<i class="fas fa-moon"></i>';
  }

  function applyTheme(theme) {
    document.documentElement.classList.toggle('dark-theme', theme === 'dark');
    updateIcon(theme);
    localStorage.setItem('theme', theme);
  }

  // Apply saved or system theme
  const savedTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  applyTheme(savedTheme);

  // Toggle on click
  tbtn.addEventListener('click', () => {
    const current = document.documentElement.classList.contains('dark-theme') ? 'dark' : 'light';
    applyTheme(current === 'dark' ? 'light' : 'dark');
  });

  // auto-change if system theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    if (!localStorage.getItem('theme')) {
      applyTheme(e.matches ? 'dark' : 'light');
    }
  });
});
