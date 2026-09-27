
document.addEventListener("DOMContentLoaded", () => {

    // ================================
    // DISPLAY LOGGED-IN USER
    // ================================

    const username = localStorage.getItem("username");
    const fullName = localStorage.getItem("fullName");

    const userElement =
        document.getElementById("loggedInUsername");

    if (userElement) {
        userElement.textContent =
            fullName || username || "User";
    }


    // ================================
    // LOAD BLOGS FROM BACKEND
    // ================================

    loadBlogs();
});


async function loadBlogs() {

    try {

        const response =
            await fetch("/api/posts");

        if (!response.ok) {
            throw new Error(
                "Failed to load blogs. Status: " +
                response.status
            );
        }

        const posts =
            await response.json();

        console.log("Blogs received:", posts);

        displayBlogs(posts);

    } catch (error) {

        console.error(
            "Error loading blogs:",
            error
        );

        const container =
            document.getElementById("blogsContainer");

        if (container) {

            container.innerHTML = `
                <p class="blog-error">
                    Unable to load blogs.
                </p>
            `;
        }
    }
}


// ================================
// DISPLAY BLOG CARDS
// ================================

function displayBlogs(posts) {

    const container =
        document.getElementById("blogsContainer");

    if (!container) {

        console.error(
            "blogsContainer not found in index.html"
        );

        return;
    }

    container.innerHTML = "";


    // Show only published blogs
    const publishedPosts =
        posts.filter(post =>
            post.published === true
        );


    if (publishedPosts.length === 0) {

        container.innerHTML = `
            <p class="no-blogs">
                No published blogs yet.
            </p>
        `;

        return;
    }


    // Latest blogs first
    publishedPosts.reverse();


    publishedPosts.forEach(post => {

        const card =
            document.createElement("article");

        card.className = "blog-card";


        const title =
            post.title || "Untitled Blog";

        const content =
            post.content || "";

        const excerpt =
            content.length > 150
                ? content.substring(0, 150) + "..."
                : content;


        const author =
            post.authorName ||
            post.author ||
            "Admin";


        const date =
            post.createdAt
                ? new Date(post.createdAt)
                    .toLocaleDateString()
                : "";


        card.innerHTML = `

            <div class="blog-card-content">

                <div class="blog-category">
                    ${post.category || "Technology"}
                </div>

                <h2>
                    ${escapeHtml(title)}
                </h2>

                <p class="blog-excerpt">
                    ${escapeHtml(excerpt)}
                </p>

                <div class="blog-meta">

                    <span>
                        ${escapeHtml(author)}
                    </span>

                    <span>
                        ${date}
                    </span>

                </div>

            </div>
        `;


        // Open the complete blog
        card.addEventListener("click", () => {

            if (post.id) {

                window.location.href =
                    `post.html?id=${post.id}`;

            }
        });


        container.appendChild(card);

    });
}


// ================================
// BASIC HTML ESCAPING
// ================================

function escapeHtml(value) {

    const div =
        document.createElement("div");

    div.textContent =
        value ?? "";

    return div.innerHTML;
}

