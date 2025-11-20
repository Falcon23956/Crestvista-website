// Credentials
const ADMIN_USER = "Asmin";
const ADMIN_PASS_HASH = "b8ee8d6719adbd762b44707a3b3812c1";  // MD5 of Droid254

function login() {
    const u = document.getElementById("username").value;
    const p = document.getElementById("password").value;

    if (u === ADMIN_USER && CryptoJS.MD5(p).toString() === ADMIN_PASS_HASH) {
        localStorage.setItem("crestvista_auth", "true");
        window.location.href = "admin.html";
    } else {
        document.getElementById("error").style.display = "block";
    }
}
