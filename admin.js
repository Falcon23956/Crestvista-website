// Protect admin page
if (localStorage.getItem("crestvista_auth") !== "true") {
    window.location.href = "login.html";
}

function logout() {
    localStorage.removeItem("crestvista_auth");
    window.location.href = "login.html";
}
