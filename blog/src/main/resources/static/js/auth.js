document.addEventListener("DOMContentLoaded", () => {

    const loginForm =
        document.getElementById("loginForm");

    const registerForm =
        document.getElementById("registerForm");

    if (loginForm) {
        loginForm.addEventListener(
            "submit",
            handleLogin
        );
    }

    if (registerForm) {
        registerForm.addEventListener(
            "submit",
            handleRegister
        );
    }
});


/* =========================
   LOGIN
========================= */

async function handleLogin(event) {

    event.preventDefault();

    const username =
        document.getElementById("username")
            .value
            .trim();

    const password =
        document.getElementById("password")
            .value;

    const message =
        document.getElementById("authMessage");

    message.className = "auth-message";
    message.textContent =
        "Signing you in...";

    try {

        const response =
            await fetch(
                "/api/auth/login",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        username: username,
                        password: password
                    })
                }
            );


        /* =========================
           READ SERVER RESPONSE
        ========================= */

        const responseText =
            await response.text();

        console.log(
            "Login HTTP Status:",
            response.status
        );

        console.log(
            "Login Server Response:",
            responseText
        );


        let data = {};


        if (responseText) {

            try {

                data =
                    JSON.parse(responseText);

            } catch (e) {

                console.error(
                    "Login response was not valid JSON:",
                    responseText
                );
            }
        }


        /* =========================
           HANDLE LOGIN ERROR
        ========================= */

        if (!response.ok) {

            throw new Error(
                data.message ||
                responseText ||
                "Invalid username or password"
            );
        }


        /* =========================
           CHECK JWT TOKEN
        ========================= */

        if (!data.token) {

            throw new Error(
                "Server did not return a login token."
            );
        }


        /* =========================
           SAVE LOGIN INFORMATION
        ========================= */

        // Save JWT token
        localStorage.setItem(
            "token",
            data.token
        );


        /*
         * Save username.
         *
         * If backend sends username,
         * use it.
         *
         * If backend does not send username,
         * use the username entered in login.
         */

        const loggedInUsername =
            data.username ||
            username;

        localStorage.setItem(
            "username",
            loggedInUsername
        );


        /*
         * Save full name if backend
         * sends it.
         *
         * This is optional and useful
         * for displaying "Welcome, Ananya"
         */

        if (data.fullName) {

            localStorage.setItem(
                "fullName",
                data.fullName
            );
        }


        /* =========================
           SUCCESS MESSAGE
        ========================= */

        message.classList.add(
            "success"
        );

        message.textContent =
            "Login successful. Redirecting...";


        /* =========================
           REDIRECT
        ========================= */

        setTimeout(() => {

            window.location.href = "/";

        }, 800);


    } catch (error) {

        console.error(
            "Login error:",
            error
        );

        message.classList.add(
            "error"
        );

        message.textContent =
            error.message ||
            "Login failed.";
    }
}


/* =========================
   REGISTER
========================= */

async function handleRegister(event) {

    event.preventDefault();

    const fullName =
        document.getElementById("fullName")
            .value
            .trim();

    const username =
        document.getElementById("username")
            .value
            .trim();

    const email =
        document.getElementById("email")
            .value
            .trim();

    const password =
        document.getElementById("password")
            .value;

    const message =
        document.getElementById("authMessage");

    message.className =
        "auth-message";

    message.textContent =
        "Creating your account...";


    /* =========================
       BASIC VALIDATION
    ========================= */

    if (
        !fullName ||
        !username ||
        !email ||
        !password
    ) {

        message.classList.add(
            "error"
        );

        message.textContent =
            "Please fill all fields.";

        return;
    }


    /* =========================
       EMAIL VALIDATION
    ========================= */

    const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {

        message.classList.add(
            "error"
        );

        message.textContent =
            "Please enter a valid email address.";

        return;
    }


    /* =========================
       PASSWORD VALIDATION
    ========================= */

    if (password.length < 6) {

        message.classList.add(
            "error"
        );

        message.textContent =
            "Password must contain at least 6 characters.";

        return;
    }


    try {

        const response =
            await fetch(
                "/api/auth/register",
                {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        fullName:
                            fullName,

                        username:
                            username,

                        email:
                            email,

                        password:
                            password
                    })
                }
            );


        /* =========================
           READ SERVER RESPONSE
        ========================= */

        const responseText =
            await response.text();

        console.log(
            "Registration HTTP Status:",
            response.status
        );

        console.log(
            "Registration Server Response:",
            responseText
        );


        let data = {};


        if (responseText) {

            try {

                data =
                    JSON.parse(
                        responseText
                    );

            } catch (e) {

                console.error(
                    "Registration response was not JSON:",
                    responseText
                );
            }
        }


        /* =========================
           HANDLE ERROR
        ========================= */

        if (!response.ok) {

            if (data.errors) {

                const errors =
                    Object.values(
                        data.errors
                    );

                throw new Error(
                    errors.join(" ")
                );
            }

            throw new Error(
                data.message ||
                responseText ||
                "Registration failed."
            );
        }


        /* =========================
           REGISTRATION SUCCESS
        ========================= */

        message.classList.add(
            "success"
        );

        message.textContent =
            data.message ||
            "Account created successfully!";


        /* =========================
           CLEAR FORM
        ========================= */

        const registerForm =
            document.getElementById(
                "registerForm"
            );

        if (registerForm) {

            registerForm.reset();
        }


        /* =========================
           REDIRECT TO LOGIN
        ========================= */

        setTimeout(() => {

            window.location.href =
                "/login.html";

        }, 1000);


    } catch (error) {

        console.error(
            "Registration Error:",
            error
        );

        message.classList.add(
            "error"
        );

        message.textContent =
            error.message ||
            "Failed to connect to server.";
    }
}