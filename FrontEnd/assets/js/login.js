function Login() {
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;

    fetch(baseApi + routeLogin, {
        method: "POST",
        body: JSON.stringify({
            email: email,
            password: password,
        }),
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.token) {
                document.cookie = "token=" + data.token + "; path=/";
                document.getElementById(
                    "error"
                ).innerHTML = `<span style='color: #1d6154;'>Bienvenue, vous allez être redirigé !</span>`;
                setTimeout(function () {
                    window.location.href = "./edit.html";
                }, 2000);
            } else {
                document.getElementById("error").innerHTML =
                    "<span style='color: #B80F0A;'>Erreur dans l’identifiant ou le mot de passe !</span>";
            }
        })
        .catch((error) => {
            console.log(error);
        });
}

document.getElementById("Login").onclick = function () {
    Login();
};

document.getElementById("password").onkeypress = function (e) {
    if (e.keyCode === 13) {
        Login();
    }
};
