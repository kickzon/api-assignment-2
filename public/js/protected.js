const message = document.getElementById("users-message");
const usersList = document.getElementById("users-list");
const pageTitle = document.getElementById("page-title");
const adminTools = document.getElementById("admin-tools");
const accountNavLink = document.getElementById("account-nav-link");

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
            showMessage("Det gick inte att hämta ditt konto.");
            return;
        }

        const currentUser = await meResponse.json();

        // Visa olika innehåll beroende på användarens roll
        let users = [currentUser];

        if (currentUser.is_admin) {
            pageTitle.textContent = "Adminpanel";
            document.title = "Bokmärkt – Adminpanel";
            accountNavLink.textContent = "Adminpanel";
            adminTools.classList.remove("hidden");

            const usersResponse = await fetch(API_URL + "/users", {
                credentials: "include",
            });

            if (usersResponse.status === 401) {
                window.location.href = "login.html";
                return;
            }

            if (usersResponse.status === 403) {
                adminTools.classList.add("hidden");
                showMessage("Du har inte adminbehörighet.");
                return;
            }

            if (!usersResponse.ok) {
                showMessage("Kunde inte hämta användarna.");
                return;
            }

            users = await usersResponse.json();
        } else {
            pageTitle.textContent = "Mitt konto";
            document.title = "Bokmärkt – Mitt konto";
            accountNavLink.textContent = "Mitt konto";
            adminTools.classList.add("hidden");
        }
        usersList.replaceChildren();

        users.forEach(function (user) {
            const userElement = document.createElement("div");

            const username = document.createElement("p");
            const isOwnAccount = user._id === currentUser._id;
            username.textContent =
                `Användarnamn: ${user.username}${isOwnAccount ? " (du)" : ""}`;

            const isAdmin = document.createElement("p");
            isAdmin.textContent =
                `Roll: ${user.is_admin ? "Administratör" : "Användare"}`;

            const createdAt = document.createElement("p");
            createdAt.textContent =
                `Skapad: ${new Date(user.created_at).toLocaleString("sv-SE")}`;

            userElement.append(username, isAdmin, createdAt);

            if (isOwnAccount) {
                addAccountButtons(userElement, user);
            } else if (currentUser.is_admin) {
                addRoleButton(userElement, user);
            }

            usersList.appendChild(userElement);
        });
    } catch (error) {
        showMessage("Något gick fel när användarna laddades.");
        console.error("Error loading users:", error);
    }
}

function addRoleButton(userElement, user) {
    const actions = document.createElement("div");
    actions.className = "user-actions";

    const roleButton = document.createElement("button");
    roleButton.type = "button";
    roleButton.className = "account-button role-button";
    roleButton.textContent = user.is_admin
        ? "Ta bort adminroll"
        : "Gör till admin";

    roleButton.addEventListener("click", async function () {
        const newAdminStatus = !user.is_admin;

        const confirmed = window.confirm(
            newAdminStatus
                ? `Vill du göra ${user.username} till admin?`
                : `Vill du ta bort adminrollen från ${user.username}?`,
        );

        if (!confirmed) {
            return;
        }

        try {
            const response = await fetch(
                API_URL + "/users/" + user._id + "/role",
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify({
                        is_admin: newAdminStatus,
                    }),
                },
            );

            if (response.status === 401) {
                window.location.href = "login.html";
                return;
            }

            if (response.status === 403) {
                showMessage("Du har inte behörighet att ändra roller.");
                return;
            }

            if (!response.ok) {
                showMessage("Det gick inte att ändra användarens roll.");
                return;
            }

            showMessage(
                newAdminStatus
                    ? `${user.username} är nu admin.`
                    : `${user.username} är inte längre admin.`,
            );

            await fetchUsers();
        } catch (error) {
            showMessage("Kunde inte ansluta till servern.");
            console.error("Error updating user role:", error);
        }
    });

    actions.appendChild(roleButton);
    userElement.appendChild(actions);
}

function addAccountButtons(userElement, user) {
    const actions = document.createElement("div");
    actions.className = "user-actions";

    const updateButton = document.createElement("button");
    updateButton.className = "account-button update-button";
    updateButton.type = "button";
    updateButton.textContent = "Uppdatera konto";

    const deleteButton = document.createElement("button");
    deleteButton.className = "account-button delete-button";
    deleteButton.type = "button";
    deleteButton.textContent = "Radera konto";

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
        usernameLabel.textContent = "Användarnamn";

        const usernameInput = document.createElement("input");
        usernameInput.type = "text";
        usernameInput.value = user.username;
        usernameInput.required = true;
        usernameLabel.appendChild(usernameInput);

        const passwordLabel = document.createElement("label");
        passwordLabel.textContent = "Nytt lösenord (valfritt)";

        const passwordInput = document.createElement("input");
        passwordInput.type = "password";
        passwordLabel.appendChild(passwordInput);

        const saveButton = document.createElement("button");
        saveButton.className = "account-button save-button";
        saveButton.type = "submit";
        saveButton.textContent = "Spara ändringar";

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
                showMessage("Användarnamn kan inte vara tomt.");
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
                showMessage("Det finns inga ändringar att spara.");
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
                            ? "Användarnamn är redan taget."
                            : "Det gick inte att uppdatera kontot."
                    );
                    return;
                }

                showMessage("Kontot uppdaterat.");
                await fetchUsers();
            } catch (error) {
                showMessage("Det gick inte att ansluta till servern.");
                console.error("Error updating account:", error);
            }
        });

        actions.appendChild(updateForm);
    });

    deleteButton.addEventListener("click", async function () {
        const confirmed = window.confirm(
            "Är du säker på att du vill radera ditt konto?"
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
                showMessage("Det gick inte att radera kontot.");
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
                    "Kontot raderades, men utloggning misslyckades. Försök logga ut igen."
                );
                return;
            }

            window.location.href = "index.html";
        } catch (error) {
            showMessage("Det gick inte att ansluta till servern.");
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

            showMessage("Utloggning misslyckades. Försök logga ut igen.");
        } catch (error) {
            showMessage("Det gick inte att ansluta till servern.");
            console.error("Error logging out:", error);
        }
    }
);