
// ============================================================
// BLOG LIST - SEARCH + CATEGORY FILTER + SHARING
// ============================================================

let allBlogs = [];
let currentCategory = "all";


// ============================================================
// LOAD BLOGS
// ============================================================

async function loadBlogs() {

    // FIX: index.html uses articlesContainer
    const blogList = document.getElementById("articlesContainer");

    if (!blogList) {
        console.error("articlesContainer element not found.");
        return;
    }

    try {

        blogList.innerHTML =
            '<p class="loading-blogs">Loading articles...</p>';

        const response = await fetch("/api/posts");

        if (!response.ok) {
            throw new Error("Could not load blogs.");
        }

        const data = await response.json();

        console.log("Blogs received:", data);

        // Support:
        // [ ... ]
        // and
        // { content: [ ... ] }

        if (Array.isArray(data)) {

            allBlogs = data;

        } else if (data && Array.isArray(data.content)) {

            allBlogs = data.content;

        } else {

            allBlogs = [];
        }

        console.log("All blogs before published filter:", allBlogs);

        /*
         * IMPORTANT FIX:
         *
         * Earlier code was doing:
         *
         * blog.published === true
         *
         * If your backend doesn't return the published
         * property, every blog was removed from the list.
         *
         * We now only filter when the property actually exists.
         */

        const hasPublishedField =
            allBlogs.some(
                blog =>
                    Object.prototype.hasOwnProperty.call(
                        blog,
                        "published"
                    )
            );

        if (hasPublishedField) {

            allBlogs = allBlogs.filter(
                blog =>
                    blog.published === true ||
                    blog.published === "true"
            );
        }

        console.log(
            "Blogs displayed after published check:",
            allBlogs
        );

        displayBlogs(allBlogs);

    } catch (error) {

        console.error("Blog loading error:", error);

        blogList.innerHTML = `
            <div class="blog-error">
                <h3>Unable to load articles</h3>
                <p>
                    Could not load articles from the Spring Boot backend.
                </p>
            </div>
        `;
    }
}


// ============================================================
// DISPLAY BLOGS
// ============================================================

function displayBlogs(blogs) {

    // FIX: index.html uses articlesContainer
    const blogList =
        document.getElementById("articlesContainer");

    if (!blogList) {
        console.error("articlesContainer element not found.");
        return;
    }

    if (!blogs || blogs.length === 0) {

        blogList.innerHTML = `
            <div class="no-blogs">
                <h3>No articles found</h3>
                <p>
                    Try another search or category.
                </p>
            </div>
        `;

        return;
    }

    blogList.innerHTML = blogs
        .map(blog => createBlogCard(blog))
        .join("");
}


// ============================================================
// BLOG CARD
// ============================================================

function createBlogCard(blog) {

    const id = blog.id;

    const title =
        blog.title || "Untitled Article";

    const content =
        blog.content || "";

    const category =
        blog.category || "General";

    const author =
        blog.author?.username ||
        blog.author?.fullName ||
        blog.username ||
        blog.authorName ||
        "Author";

    const date =
        blog.createdAt
            ? new Date(blog.createdAt).toLocaleDateString()
            : "";

    const coverImage =
        blog.coverImage ||
        blog.image ||
        "https://images.unsplash.com/photo-1499750310107-5fef28a66643";

    // Remove HTML for preview text
    const plainText =
        content.replace(/<[^>]*>/g, "");

    const description =
        plainText.length > 150
            ? plainText.substring(0, 150) + "..."
            : plainText;

    return `
        <article class="blog-card">

            <div class="blog-image-wrapper">

                <img
                    src="${escapeAttribute(coverImage)}"
                    alt="${escapeAttribute(title)}"
                    class="blog-card-image"
                    onerror="this.src='https://images.unsplash.com/photo-1499750310107-5fef28a66643'"
                >

            </div>

            <div class="blog-card-content">

                <span class="blog-category">
                    ${escapeHtml(category)}
                </span>

                <h3 class="blog-card-title">
                    ${escapeHtml(title)}
                </h3>

                <p class="blog-description">
                    ${escapeHtml(description)}
                </p>

                <div class="blog-meta">

                    <span>
                        ${escapeHtml(author)}
                    </span>

                    <span>
                        ${escapeHtml(date)}
                    </span>

                </div>

                <div class="blog-actions">

                    <button
                        onclick="openBlog(${id})"
                        class="blog-btn read-btn">
                        Read
                    </button>

                    <button
                        onclick="editBlog(${id})"
                        class="blog-btn edit-btn">
                        Edit
                    </button>

                    <button
                        onclick="deleteBlog(${id})"
                        class="blog-btn delete-btn">
                        Delete
                    </button>

                    <button
                        onclick="shareBlog(${id})"
                        class="blog-btn share-btn">
                        Share
                    </button>

                    <button
                        onclick="downloadPDF(${id})"
                        class="blog-btn export-btn">
                        PDF
                    </button>

                    <button
                        onclick="downloadWord(${id})"
                        class="blog-btn export-btn">
                        Word
                    </button>

                </div>

            </div>

        </article>
    `;
}


// ============================================================
// SEARCH
// ============================================================

function setupSearch() {

    const searchInput =
        document.getElementById("searchInput") ||
        document.getElementById("searchBar") ||
        document.querySelector(".search-input") ||
        document.querySelector('input[type="search"]');

    if (!searchInput) {

        console.log("Search input not found.");

        return;
    }

    searchInput.addEventListener(
        "input",
        function () {

            const searchText =
                this.value.toLowerCase().trim();

            filterBlogs(
                searchText,
                currentCategory
            );
        }
    );

    console.log("Search activated.");
}


// ============================================================
// CATEGORY BUTTONS
// ============================================================

function setupCategoryButtons() {

    const categoryButtons =
        document.querySelectorAll(
            "[data-category], .category-btn, .topic-btn"
        );

    categoryButtons.forEach(button => {

        button.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                const category =
                    this.dataset.category ||
                    this.textContent.trim();

                currentCategory =
                    category.toLowerCase() === "all"
                        ? "all"
                        : category;

                filterBlogs(
                    "",
                    currentCategory
                );

            }
        );

    });

    console.log(
        "Category buttons activated:",
        categoryButtons.length
    );
}


// ============================================================
// FILTER BLOGS
// ============================================================

// ============================================================
// FILTER BLOGS
// ============================================================

function filterBlogs(
    searchText,
    category
) {

    let filteredBlogs = [...allBlogs];


    // ========================================================
    // SEARCH FILTER
    // ========================================================

    if (searchText) {

        filteredBlogs =
            filteredBlogs.filter(blog => {

                const title =
                    (blog.title || "").toLowerCase();

                const content =
                    (blog.content || "").toLowerCase();

                const tags =
                    (blog.tags || "").toLowerCase();

                const blogCategory =
                    (blog.category || "").toLowerCase();

                return (
                    title.includes(searchText) ||
                    content.includes(searchText) ||
                    tags.includes(searchText) ||
                    blogCategory.includes(searchText)
                );
            });
    }


    // ========================================================
    // CATEGORY FILTER
    // ========================================================

    if (
        category &&
        category.toLowerCase().trim() !== "all"
    ) {

        const selectedCategory =
            category.toLowerCase().trim();


        // Category aliases
        const categoryKeywords = {

            "ai": [
                "artificial intelligence",
                "generative ai",
                "machine intelligence"
            ],

            "java": [
                "java programming",
                "java developer",
                "core java"
            ],

            "python": [
                "python programming",
                "python developer"
            ],

            "web development": [
                "web development",
                "frontend",
                "front end",
                "backend",
                "back end",
                "full stack",
                "fullstack",
                "html",
                "css",
                "javascript"
            ],

            "data science": [
                "data science",
                "data scientist",
                "data analysis",
                "data analytics",
                "pandas",
                "numpy"
            ],

            "ml": [
                "machine learning",
                "deep learning",
                "neural network",
                "neural networks"
            ],

            "c": [
                "c programming",
                "c language",
                "programming in c"
            ],

            "c++": [
                "c++",
                "cpp",
                "c plus plus"
            ],

            "spring boot": [
                "spring boot",
                "springboot",
                "spring framework"
            ],

            "javascript": [
                "javascript",
                "ecmascript"
            ],

            "sql": [
                "sql",
                "mysql",
                "database",
                "postgresql"
            ]

        };


        const keywords = [
            selectedCategory,
            ...(categoryKeywords[selectedCategory] || [])
        ];


        // ====================================================
        // KEYWORD MATCHING
        // ====================================================

        function matchesKeyword(text, keyword) {

            const value =
                String(text || "").toLowerCase();

            const key =
                keyword.toLowerCase();


            // C++
            if (key === "c++") {
                return (
                    value.includes("c++") ||
                    value.includes("cpp") ||
                    value.includes("c plus plus")
                );
            }


            // C
            // Prevents "c" from matching every word
            if (key === "c") {
                return /\bc\b/i.test(value);
            }


            // AI
            if (key === "ai") {
                return /\bai\b/i.test(value);
            }


            // ML
            if (key === "ml") {
                return /\bml\b/i.test(value);
            }


            // Java
            // Prevents Java from matching JavaScript
            if (key === "java") {
                return /\bjava\b/i.test(value);
            }


            // JavaScript
            if (key === "javascript") {
                return /\bjavascript\b/i.test(value);
            }


            // Normal keyword
            return value.includes(key);
        }


        // ====================================================
        // CHECK BLOG
        // ====================================================

        filteredBlogs =
            filteredBlogs.filter(blog => {

                const fields = [

                    blog.category || "",

                    blog.title || "",

                    blog.content || "",

                    blog.tags || ""

                ];


                return keywords.some(keyword =>

                    fields.some(field =>
                        matchesKeyword(
                            field,
                            keyword
                        )
                    )

                );

            });
    }


    // ========================================================
    // DISPLAY RESULTS
    // ========================================================

    displayBlogs(filteredBlogs);
}


// ============================================================
// OPEN BLOG
// ============================================================

function openBlog(id) {

    window.location.href =
        `/blog.html?id=${id}`;
}


// ============================================================
// EDIT BLOG
// ============================================================

function editBlog(id) {

    window.location.href =
        `/create-post.html?id=${id}`;
}


// ============================================================
// DELETE BLOG
// ============================================================

async function deleteBlog(id) {

    const confirmed =
        confirm(
            "Are you sure you want to delete this blog?"
        );

    if (!confirmed) {
        return;
    }

    try {

        const token =
            localStorage.getItem("token");

        const response =
            await fetch(
                `/api/posts/${id}`,
                {
                    method: "DELETE",

                    headers: {
                        "Authorization":
                            "Bearer " + token
                    }
                }
            );

        const result =
            await response.json()
                .catch(() => ({}));

        if (!response.ok) {

            throw new Error(
                result.message ||
                "Could not delete blog."
            );
        }

        alert(
            "Blog deleted successfully."
        );

        await loadBlogs();

    } catch (error) {

        console.error(error);

        alert(
            error.message ||
            "Something went wrong while deleting."
        );
    }
}


// ============================================================
// SHARE BLOG
// ============================================================

async function shareBlog(id) {

    const blog =
        allBlogs.find(
            item => item.id === id
        );

    if (!blog) {

        alert("Blog not found.");

        return;
    }

    const title =
        blog.title || "My Blog";

    const url =
        `${window.location.origin}/blog.html?id=${id}`;

    showShareMenu(title, url);
}


// ============================================================
// SHARE MENU
// ============================================================

function showShareMenu(title, url) {

    const oldMenu =
        document.getElementById("shareMenu");

    if (oldMenu) {
        oldMenu.remove();
    }

    const overlay =
        document.createElement("div");

    overlay.id = "shareMenu";

    overlay.innerHTML = `

        <div class="share-overlay">

            <div class="share-modal">

                <button
                    class="share-close"
                    onclick="closeShareMenu()">
                    ×
                </button>

                <h2>Share Article</h2>

                <p>
                    Share this article on your favorite platform.
                </p>

                <div class="share-options">

                    <button
                        onclick="shareLinkedIn('${encodeURIComponent(url)}')">
                        <span>in</span>
                        LinkedIn
                    </button>

                    <button
                        onclick="shareFacebook('${encodeURIComponent(url)}')">
                        <span>f</span>
                        Facebook
                    </button>

                    <button
                        onclick="shareTwitter('${encodeURIComponent(url)}')">
                        <span>𝕏</span>
                        X / Twitter
                    </button>

                    <button
                        onclick="shareWhatsApp('${encodeURIComponent(url)}')">
                        <span>WA</span>
                        WhatsApp
                    </button>

                    <button
                        onclick="shareInstagram()">
                        <span>◎</span>
                        Instagram
                    </button>

                    <button
                        onclick="copyBlogLink('${encodeURIComponent(url)}')">
                        <span>🔗</span>
                        Copy Link
                    </button>

                </div>

            </div>

        </div>
    `;

    document.body.appendChild(overlay);
}


// ============================================================
// CLOSE SHARE MENU
// ============================================================

function closeShareMenu() {

    const menu =
        document.getElementById("shareMenu");

    if (menu) {
        menu.remove();
    }
}


// ============================================================
// LINKEDIN
// ============================================================

function shareLinkedIn(encodedUrl) {

    const url =
        decodeURIComponent(encodedUrl);

    window.open(
        `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
        "_blank",
        "width=700,height=600"
    );
}


// ============================================================
// FACEBOOK
// ============================================================

function shareFacebook(encodedUrl) {

    const url =
        decodeURIComponent(encodedUrl);

    window.open(
        `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
        "_blank",
        "width=700,height=600"
    );
}


// ============================================================
// X / TWITTER
// ============================================================

function shareTwitter(encodedUrl) {

    const url =
        decodeURIComponent(encodedUrl);

    window.open(
        `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}`,
        "_blank",
        "width=700,height=600"
    );
}


// ============================================================
// WHATSAPP
// ============================================================

function shareWhatsApp(encodedUrl) {

    const url =
        decodeURIComponent(encodedUrl);

    window.open(
        `https://api.whatsapp.com/send?text=${encodeURIComponent(url)}`,
        "_blank"
    );
}


// ============================================================
// INSTAGRAM
// ============================================================

function shareInstagram() {

    window.open(
        "https://www.instagram.com/",
        "_blank"
    );

    alert(
        "Instagram opened. Copy the article link first and paste it into your Instagram post/profile workflow."
    );
}


// ============================================================
// COPY LINK
// ============================================================

async function copyBlogLink(encodedUrl) {

    const url =
        decodeURIComponent(encodedUrl);

    try {

        await navigator.clipboard.writeText(url);

        alert("Blog link copied!");

    } catch (error) {

        const textarea =
            document.createElement("textarea");

        textarea.value = url;

        document.body.appendChild(textarea);

        textarea.select();

        document.execCommand("copy");

        textarea.remove();

        alert("Blog link copied!");
    }
}


// ============================================================
// PDF EXPORT
// ============================================================

async function downloadPDF(id) {

    try {

        const response =
            await fetch(`/api/posts/${id}`);

        if (!response.ok) {
            throw new Error("Could not load blog.");
        }

        const blog =
            await response.json();

        const printWindow =
            window.open("", "_blank");

        printWindow.document.write(`

            <!DOCTYPE html>

            <html>

            <head>

                <title>
                    ${escapeHtml(blog.title || "Blog")}
                </title>

                <style>

                    body {
                        font-family: Arial, sans-serif;
                        max-width: 850px;
                        margin: 50px auto;
                        padding: 30px;
                        line-height: 1.7;
                    }

                    h1 {
                        font-size: 34px;
                        margin-bottom: 10px;
                    }

                    .meta {
                        color: #666;
                        margin-bottom: 30px;
                    }

                    img {
                        max-width: 100%;
                        border-radius: 10px;
                    }

                </style>

            </head>

            <body>

                <h1>
                    ${escapeHtml(blog.title || "")}
                </h1>

                <div class="meta">
                    ${escapeHtml(
                        blog.category || "General"
                    )}
                </div>

                ${
                    blog.coverImage
                        ? `<img src="${escapeAttribute(blog.coverImage)}">`
                        : ""
                }

                <div>
                    ${blog.content || ""}
                </div>

            </body>

            </html>
        `);

        printWindow.document.close();

        printWindow.onload = function () {

            printWindow.print();
        };

    } catch (error) {

        console.error(error);

        alert("Could not create PDF.");
    }
}


// ============================================================
// WORD EXPORT
// ============================================================

async function downloadWord(id) {

    try {

        const response =
            await fetch(`/api/posts/${id}`);

        if (!response.ok) {
            throw new Error("Could not load blog.");
        }

        const blog =
            await response.json();

        const html = `

            <html>

            <head>

                <meta charset="UTF-8">

                <title>
                    ${escapeHtml(blog.title || "Blog")}
                </title>

            </head>

            <body>

                <h1>
                    ${escapeHtml(blog.title || "")}
                </h1>

                <p>
                    ${escapeHtml(
                        blog.category || "General"
                    )}
                </p>

                <hr>

                ${blog.content || ""}

            </body>

            </html>
        `;

        const blob =
            new Blob(
                [html],
                {
                    type:
                        "application/msword"
                }
            );

        const url =
            URL.createObjectURL(blob);

        const link =
            document.createElement("a");

        link.href = url;

        link.download =
            `${slugify(blog.title || "blog")}.doc`;

        document.body.appendChild(link);

        link.click();

        link.remove();

        URL.revokeObjectURL(url);

    } catch (error) {

        console.error(error);

        alert("Could not export Word file.");
    }
}


// ============================================================
// HELPERS
// ============================================================

function slugify(text) {

    return text
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
}


function escapeHtml(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


function escapeAttribute(value) {

    return escapeHtml(value);
}


// ============================================================
// INITIALIZE
// ============================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        console.log(
            "Blog platform initialized."
        );

        loadBlogs();

        setupSearch();

        setupCategoryButtons();

    }
);

