const registerForm = document.getElementById("registerForm");
const message = document.getElementById("message");

registerForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const fullName = document.getElementById("fullName").value.trim();
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;

    if (!fullName || !username || !password) {
        message.textContent = "Please fill all fields.";
        return;
    }

    try {
        const response = await fetch("/api/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                fullName: fullName,
                username: username,
                password: password
            })
        });

        const data = await response.json();

        if (response.ok) {
            message.textContent = "Account created successfully!";

            setTimeout(() => {
                window.location.href = "/login.html";
            }, 1000);
        } else {
            message.textContent = data.message || "Registration failed.";
        }

    } catch (error) {
        console.error("Registration error:", error);
        message.textContent = "Cannot connect to server.";
    }
});