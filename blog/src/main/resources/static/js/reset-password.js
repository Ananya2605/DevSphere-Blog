document.addEventListener("DOMContentLoaded", () => {

    const form =
        document.getElementById(
            "resetPasswordForm"
        );

    const message =
        document.getElementById(
            "message"
        );

    const params =
        new URLSearchParams(
            window.location.search
        );

    const token =
        params.get("token");

    if (!token) {

        message.textContent =
            "Invalid or missing reset token.";

        return;
    }

    form.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();

            const newPassword =
                document.getElementById(
                    "newPassword"
                ).value;

            const confirmPassword =
                document.getElementById(
                    "confirmPassword"
                ).value;

            if (newPassword !== confirmPassword) {

                message.textContent =
                    "Passwords do not match.";

                return;
            }

            if (newPassword.length < 6) {

                message.textContent =
                    "Password must be at least 6 characters.";

                return;
            }

            message.textContent =
                "Updating password...";

            try {

                const response =
                    await fetch(
                        "/api/auth/reset-password",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({

                                token: token,

                                newPassword:
                                    newPassword
                            })
                        }
                    );

                const data =
                    await response.json();

                if (!response.ok) {

                    throw new Error(
                        data.message ||
                        "Unable to reset password."
                    );
                }

                message.style.color =
                    "#4ade80";

                message.textContent =
                    "Password reset successfully! Redirecting to login...";

                setTimeout(() => {

                    window.location.href =
                        "/login.html";

                }, 2000);

            } catch (error) {

                console.error(
                    "Reset password error:",
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