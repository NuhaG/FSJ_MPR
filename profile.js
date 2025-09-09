const currentUser = JSON.parse(localStorage.getItem("currentUser"));

if (currentUser) {
  document.querySelector(
    ".profile h3"
  ).textContent = `Welcome Back, ${currentUser.name}`;
  document.querySelector(".profile p").textContent = currentUser.email;
} else {
  alert("Please Login to view dashboard!");
  setInterval(() => {
    window.location.href = "/login.html";
  }, 600);
}
