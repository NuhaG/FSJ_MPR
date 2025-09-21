const form = document.getElementById("login-form");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const emailIn = document.getElementById("email").value.trim();

  let users = [
    { email: "test@gmail.com", password: "123456" },
    { email: "test1@gmail.com", password: "test123" },
  ];
  const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
  users = [...users, ...storedUsers];

  const user = users.find((u) => u.email === emailIn);
  if (user) {
    alert("Reset Link Sent to email");
  } else {
    alert("Email not found proceed to signup");
    setTimeout(() => {
      window.location.href = "/signup.html";
    }, 1000);
  }
});
