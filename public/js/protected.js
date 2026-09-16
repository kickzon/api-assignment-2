async function fetchUsers() {
    try {
        const response = await fetch(API_URL + "/users", {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include"
        });

        if  (response.status === 401 || response.status === 403) {
            window.location.href = "login.html";
            return;
        }

        const data = await response.json();
        if (response.ok) {
            const usersList = document.getElementById("users-list");

            data.forEach(function (user) {
                const userElement = document.createElement("div");

                const username = document.createElement("p");
                username.textContent = `Username: ${user.username}`;

                const isAdmin = document.createElement("p");
                isAdmin.textContent = `Admin: ${user.is_admin}`;

                const createdAt = document.createElement("p");
                createdAt.textContent = `Created At: ${new Date(user.created_at).toLocaleString()}`;

                userElement.append(username, isAdmin, createdAt);
                usersList.appendChild(userElement);
            });
            
        }
    } catch (error) {
        console.error("Error:", error);
    }
}
fetchUsers();


// 2. Create an addEventlistener for the logout button on click. The buttons ID is "#logout-btn"
document.getElementById("logout-btn").addEventListener("click", function(event) {
    event.preventDefault();
    // 3. Should make a POST request to API_URL + "/auth/logout", with credentials: "include"
    async function logout() {
        try {
            const response = await fetch(API_URL + "/auth/logout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include"
            });
            if (response.ok) {
                window.location.href = "index.html";
            } else {
                // 5. Make the error message display in a red fashioned label. Use bootstraps classes 
                document.getElementById("users-message").className = "alert alert-danger";
                document.getElementById("users-message").textContent = "Logout failed. Please try again";
            }
        } catch (error) {
            console.error("Error:", error);
        }
    }
    logout();
});