const form = document.getElementById("login-form");

form.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const confirmPassword = document.getElementById("confirm-password").value.trim();

    if(password !== confirmPassword) {
        alert("Passwords don't match");
        return;
    } 
    if(password.length < 6) {
        alert("Password length must be atleast 6 characters long");
        return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];

    const existUser = users.find(u => u.email === email);
    if(existUser) {
        alert("User already exists, please login");
        return;
    }

    users.push({email, password});
    localStorage.setItem("users", JSON.stringify(users));

    alert("Account created successfully! Please Login");
    window.location.href = "login.html";
})