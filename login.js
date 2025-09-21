const form = document.getElementById("login-form");
const message = document.getElementById("message");

let users = [
  { email: "test@gmail.com", password: "123456" },
  { email: "test1@gmail.com", password: "test123" },
];

let storedUsers = JSON.parse(localStorage.getItem("users")) || [];
users = [...users, ...storedUsers];

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  const user = users.find((u) => u.email === email && u.password === password);

  if (user) {
    const name = email.split("@")[0];
    localStorage.setItem("currentUser", JSON.stringify({name,email}));
    alert("Login successful");
    window.location.href = "/dashboard.html";
    return;
  }

  alert("Invalid Email or Password");
});
