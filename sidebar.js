const toggleBtn = document.getElementById("toggle-sidebar");
const dashLinks = document.getElementById("dash-links");

const mobileLogout = document.createElement("li");
mobileLogout.classList.add("logout");
mobileLogout.innerHTML = `<i class="fa-solid fa-arrow-left"></i>Logout`;

toggleBtn.addEventListener("click", () => {
  dashLinks.classList.toggle("active");

  if(dashLinks.classList.contains('active') && !dashLinks.querySelector('.logout')) {
    dashLinks.appendChild(mobileLogout);
  }
});
