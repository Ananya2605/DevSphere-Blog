document.addEventListener("DOMContentLoaded", () => {

    const form =
        document.getElementById(
            "forgotPasswordForm"
        );

    if (!form) {
        return;
    }

    form.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();

            const email =
                document.getElementById(
                    "email"
                ).value.trim();

            const message =
                document.getElementById(
                    "message"
                );

            if (!email) {
                message.textContent =
                    "Please enter your email.";
                return;
            }

            message.textContent =
                "Sending reset link...";

            try {

                const response =
                    await fetch(
                        "/api/auth/forgot-password",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({
                                email: email
                            })
                        }
                    );

                const data =
                    await response.json();

                if (!response.ok) {

                    throw new Error(
                        data.message ||
                        "Unable to send reset link."
                    );
                }

                message.style.color =
                    "#4ade80";

                message.textContent =
                    "If an account exists with this email, a password reset link has been sent.";

            } catch (error) {

                console.error(
                    "Forgot password error:",
                    error
                );

                message.style.color =
                    "#ff7188";

                message.textContent =
                    error.message;
            }
        }
    );
});