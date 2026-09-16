const message = document.getElementById("users-message");
const usersList = document.getElementById("users-list");

function showMessage(text) {
    message.textContent = text;
}

async function fetchUsers() {
    try {
        // Hämta den inloggade användaren
        const meResponse = await fetch(API_URL + "/auth/me", {
            credentials: "include"
        });

        if (meResponse.status === 401 || meResponse.status === 403) {
            window.location.href = "login.html";
            return;
        }

        if (!meResponse.ok) {
            showMessage("Could not load your account.");
            return;
        }

        const currentUser = await meResponse.json();

        // Hämta alla användare
        const usersResponse = await fetch(API_URL + "/users", {
            credentials: "include"
        });

        if (usersResponse.status === 401 || usersResponse.status === 403) {
            window.location.href = "login.html";
            return;
        }

        if (!usersResponse.ok) {
            showMessage("Could not load users.");
            return;
        }

        const users = await usersResponse.json();
        usersList.replaceChildren();

        users.forEach(function (user) {
            const userElement = document.createElement("div");

            const username = document.createElement("p");
            const isOwnAccount = user._id === currentUser._id;
            username.textContent =
                `Username: ${user.username}${isOwnAccount ? " (you)" : ""}`;

            const isAdmin = document.createElement("p");
            isAdmin.textContent = `Admin: ${user.is_admin}`;

            const createdAt = document.createElement("p");
            createdAt.textContent =
                `Created At: ${new Date(user.created_at).toLocaleString("sv-SE")}`;

            userElement.append(username, isAdmin, createdAt);

            if (isOwnAccount) {
                addAccountButtons(userElement, user);
            }

            usersList.appendChild(userElement);
        });
    } catch (error) {
        showMessage("Something went wrong while loading users.");
        console.error("Error loading users:", error);
    }
}

function addAccountButtons(userElement, user) {
    const actions = document.createElement("div");
    actions.className = "user-actions";

    const updateButton = document.createElement("button");
    updateButton.className = "account-button update-button";
    updateButton.type = "button";
    updateButton.textContent = "Update Account";

    const deleteButton = document.createElement("button");
    deleteButton.className = "account-button delete-button";
    deleteButton.type = "button";
    deleteButton.textContent = "Delete Account";

    updateButton.addEventListener("click", function () {
        // Undvik att öppna flera formulär på samma rad
        const existingForm = actions.querySelector("form");

        if (existingForm) {
            existingForm.remove();
            return;
        }

        const updateForm = document.createElement("form");
        updateForm.className = "update-form";

        const usernameLabel = document.createElement("label");
        usernameLabel.textContent = "Username";

        const usernameInput = document.createElement("input");
        usernameInput.type = "text";
        usernameInput.value = user.username;
        usernameInput.required = true;
        usernameLabel.appendChild(usernameInput);

        const passwordLabel = document.createElement("label");
        passwordLabel.textContent = "New password (optional)";

        const passwordInput = document.createElement("input");
        passwordInput.type = "password";
        passwordLabel.appendChild(passwordInput);

        const saveButton = document.createElement("button");
        saveButton.className = "account-button save-button";
        saveButton.type = "submit";
        saveButton.textContent = "Save changes";

        updateForm.append(
            usernameLabel,
            passwordLabel,
            saveButton
        );

        updateForm.addEventListener("submit", async function (event) {
            event.preventDefault();

            const newUsername = usernameInput.value.trim();
            const newPassword = passwordInput.value;

            if (!newUsername) {
                showMessage("Username cannot be empty.");
                return;
            }

            const changes = {};

            if (newUsername !== user.username) {
                changes.username = newUsername;
            }

            if (newPassword) {
                changes.password = newPassword;
            }

            if (Object.keys(changes).length === 0) {
                showMessage("No changes to save.");
                return;
            }

            try {
                const response = await fetch(API_URL + "/users/" + user._id, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(changes),
                    credentials: "include"
                });

                if (!response.ok) {
                    showMessage(
                        response.status === 409
                            ? "Username is already taken."
                            : "Could not update your account."
                    );
                    return;
                }

                showMessage("Account updated.");
                await fetchUsers();
            } catch (error) {
                showMessage("Could not connect to the server.");
                console.error("Error updating account:", error);
            }
        });

        actions.appendChild(updateForm);
    });

    deleteButton.addEventListener("click", async function () {
        const confirmed = window.confirm(
            "Are you sure you want to delete your account?"
        );

        if (!confirmed) {
            return;
        }

        try {
            const deleteResponse = await fetch(
                API_URL + "/users/" + user._id,
                {
                    method: "DELETE",
                    credentials: "include"
                }
            );

            if (!deleteResponse.ok) {
                showMessage("Could not delete your account.");
                return;
            }

            // Rensa httpOnly-cookien efter att kontot har raderats
            const logoutResponse = await fetch(
                API_URL + "/auth/logout",
                {
                    method: "POST",
                    credentials: "include"
                }
            );

            if (!logoutResponse.ok) {
                showMessage(
                    "Account deleted, but logout failed. Please try logging out."
                );
                return;
            }

            window.location.href = "index.html";
        } catch (error) {
            showMessage("Could not connect to the server.");
            console.error("Error deleting account:", error);
        }
    });

    actions.append(updateButton, deleteButton);
    userElement.appendChild(actions);
}

fetchUsers();

document.getElementById("logout-btn").addEventListener(
    "click",
    async function () {
        try {
            const response = await fetch(API_URL + "/auth/logout", {
                method: "POST",
                credentials: "include"
            });

            if (response.ok) {
                window.location.href = "index.html";
                return;
            }

            showMessage("Logout failed. Please try again.");
        } catch (error) {
            showMessage("Could not connect to the server.");
            console.error("Error logging out:", error);
        }
    }
);

