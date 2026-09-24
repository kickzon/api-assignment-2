document.getElementById("register-form").addEventListener("submit", function (event) {
    event.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;

    // 2. Should make a POST request to API_URL + "/auth/register",
    // And include "credentials: "include"

    // 3. Use async/await and try/catch to handle the response and any errors that may occur. If the response is successful, console log the data returned from the server.
    async function register() {
        try {
            const response = await fetch(API_URL + "/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username: username,
                    password: password
                }),
                credentials: "include"
            });
            // 4 On success, redirect to login.html. On failure display an error message in #register-message
            if (response.ok) {
                window.location.href = "login.html";
            } else {
                // 5. Make the error message display in a red fashioned label. Use bootstraps classes
                document.getElementById("register-message").className =
                    "alert alert-danger";

                document.getElementById("register-message").textContent =
                    response.status === 409
                        ? "Användarnamnet är redan upptaget."
                        : "Registreringen misslyckades. Försök igen.";
            }
        } catch (error) {
            document.getElementById("register-message").className = "alert alert-danger";
            document.getElementById("register-message").textContent =
                "Det gick inte att ansluta till servern.";
        }
    }
    register();
});