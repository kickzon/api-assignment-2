document.getElementById("login-form").addEventListener("submit", function (event) {
    event.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;
    // 2. SHould make a POST request to API_URL + "/auth/login",   
    // And include "credentials: "include"


    // 3. Use async/await and try/catch to handle the response and any errors that may occur. If the response is successful, console log the data returned from the server.
    async function login() {
        try {
            const response = await fetch(API_URL + "/auth/login", {
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
            const data = await response.json();
            // 4 On success, redirect to protected.html. On failure display an error message in #login-message
            if (response.ok) {
                window.location.href = "protected.html";
            } else {
                // 5. Make the error message display in a red fashioned label. Use bootstraps classes 
                document.getElementById("login-message").className = "alert alert-danger";
                document.getElementById("login-message").textContent =
                    "Inloggningen misslyckades. Kontrollera användarnamn och lösenord.";
            }
        } catch (error) {
            document.getElementById("login-message").className = "alert alert-danger";
            document.getElementById("login-message").textContent =
                "Det gick inte att ansluta till servern.";
            console.error("Error:", error);
        }
    }
    login();
});