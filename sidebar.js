const toggleBtn = document.getElementById("toggle-sidebar");
const dashLinks = document.getElementById("dash-links");

const mobileLogout = document.createElement("li");
mobileLogout.classList.add("logout");
mobileLogout.innerHTML = `<i class="fa-solid fa-arrow-left"></i><a href="/index.html">Logout</a>`;

// Add event listener to remove currentUser
mobileLogout.querySelector("a").addEventListener("click", (e) => {
  e.preventDefault(); // prevent immediate navigation
  localStorage.removeItem("currentUser");
  window.location.href = "index.html"; // redirect after clearing
});

toggleBtn.addEventListener("click", () => {
  dashLinks.classList.toggle("active");

  if (window.innerWidth <= 425) {
    if (!dashLinks.querySelector(".logout")) {
      dashLinks.appendChild(mobileLogout);
    }
  } else {
    if (dashLinks.contains(mobileLogout)) {
      dashLinks.removeChild(mobileLogout);
    }
  }
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 425) {
    if (dashLinks.contains(mobileLogout)) {
      dashLinks.removeChild(mobileLogout);
    }
  }
});
