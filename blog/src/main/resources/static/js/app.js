let allPosts = [];
let selectedCategory = "all";

document.addEventListener("DOMContentLoaded", () => {

    loadPosts();

    document.getElementById("currentYear").textContent =
        new Date().getFullYear();

    setupSearch();
    setupCategories();
    setupFocusMode();
    setupNewsletter();
    updateLoginState();
    updateReadingProgress();
});
async function loadPosts() {

    const postGrid = document.getElementById("postGrid");

    try {

        const response = await fetch("/api/posts");

        if (!response.ok) {
            throw new Error("Unable to load posts");
        }

        allPosts = await response.json();

        document.getElementById("postCount").textContent =
            allPosts.length;

        renderPosts(allPosts);

        loadFeaturedPost();

    } catch (error) {

        console.error(error);

        postGrid.innerHTML = `
            <div class="loading-state">
                <div>
                    <h3>Unable to load articles</h3>
                    <p style="color:#929bb2;margin-top:8px">
                        Make sure your Spring Boot backend is running.
                    </p>
                </div>
            </div>
        `;
    }
}
function renderPosts(posts) {

    const postGrid = document.getElementById("postGrid");
    const emptyState = document.getElementById("emptyState");

    if (posts.length === 0) {

        postGrid.innerHTML = "";
        emptyState.classList.remove("hidden");

        return;
    }

    emptyState.classList.add("hidden");

    postGrid.innerHTML = posts.map(post => {

        const saved =
            isBookmarked(post.id) ? "saved" : "";

        const excerpt =
            createExcerpt(post.content);

        const category =
            detectCategory(post.title, post.content);

        return `
            <article
                class="post-card"
                data-post-id="${post.id}"
            >

                <div class="post-top">

                    <span class="post-category">
                        ${category}
                    </span>

                    <button
                        class="bookmark-button ${saved}"
                        onclick="toggleBookmark(${post.id})"
                        title="Save article"
                    >
                        ${saved ? "★" : "☆"}
                    </button>

                </div>

                <h3>
                    ${escapeHtml(post.title)}
                </h3>

                <p>
                    ${escapeHtml(excerpt)}
                </p>

                <div class="post-footer">

                    <span>
                        ${post.author ? "By " + escapeHtml(post.author) : "DevSphere"}
                    </span>

                    <button
                        class="read-button"
                        onclick="openPost(${post.id})"
                    >
                        Read →
                    </button>

                </div>

            </article>
        `;

    }).join("");
}
function loadFeaturedPost() {

    if (!allPosts.length) return;

    const post = allPosts[0];

    document.getElementById("featuredTitle").textContent =
        post.title;

    document.getElementById("featuredExcerpt").textContent =
        createExcerpt(post.content, 220);

    document.getElementById("featuredAuthor").textContent =
        post.author
            ? `By ${post.author}`
            : "By DevSphere";

    document.getElementById("featuredReadButton").onclick =
        () => openPost(post.id);
}

function setupSearch() {

    const input =
        document.getElementById("searchInput");

    input.addEventListener("input", () => {

        const query =
            input.value.toLowerCase().trim();

        filterPosts(query, selectedCategory);
    });
}


function filterPosts(query, category) {

    const filtered = allPosts.filter(post => {

        const text = `
            ${post.title}
            ${post.content}
            ${post.author || ""}
        `.toLowerCase();

        const matchesSearch =
            text.includes(query);

        const postCategory =
            detectCategory(
                post.title,
                post.content
            ).toLowerCase();

        const matchesCategory =
            category === "all" ||
            postCategory === category;

        return matchesSearch && matchesCategory;
    });

    renderPosts(filtered);
}

function setupCategories() {

    const buttons =
        document.querySelectorAll(".category-button");

    buttons.forEach(button => {

        button.addEventListener("click", () => {

            buttons.forEach(btn =>
                btn.classList.remove("active")
            );

            button.classList.add("active");

            selectedCategory =
                button.dataset.category;

            const query =
                document
                    .getElementById("searchInput")
                    .value
                    .toLowerCase()
                    .trim();

            filterPosts(
                query,
                selectedCategory
            );
        });
    });
}
function detectCategory(title, content) {

    const text =
        `${title} ${content}`.toLowerCase();

    if (
        text.includes("java") ||
        text.includes("spring") ||
        text.includes("backend")
    ) {
        return "Java";
    }

    if (
        text.includes("javascript") ||
        text.includes("html") ||
        text.includes("css") ||
        text.includes("frontend") ||
        text.includes("web")
    ) {
        return "Web";
    }

    if (
        text.includes("ai") ||
        text.includes("artificial intelligence") ||
        text.includes("machine learning")
    ) {
        return "AI";
    }
    if (
        text.includes("career") ||
        text.includes("interview") ||
        text.includes("job")
    ) {
        return "Career";
    }

    return "Ideas";
}

function isBookmarked(id) {

    const bookmarks =
        JSON.parse(
            localStorage.getItem("bookmarkedPosts") || "[]"
        );

    return bookmarks.includes(id);
}
function toggleBookmark(id) {

    let bookmarks =
        JSON.parse(
            localStorage.getItem("bookmarkedPosts") || "[]"
        );

    if (bookmarks.includes(id)) {

        bookmarks =
            bookmarks.filter(item => item !== id);

    } else {

        bookmarks.push(id);
    }
    localStorage.setItem(
        "bookmarkedPosts",
        JSON.stringify(bookmarks)
    );

    renderPosts(
        filterCurrentPosts()
    );
}
function filterCurrentPosts() {

    const query =
        document
            .getElementById("searchInput")
            .value
            .toLowerCase()
            .trim();

    return allPosts.filter(post => {

        const text =
            `${post.title} ${post.content}`.toLowerCase();

        const category =
            detectCategory(
                post.title,
                post.content
            ).toLowerCase();

        return (
            text.includes(query) &&
            (
                selectedCategory === "all" ||
                category === selectedCategory
            )
        );
    });
}


function openPost(id) {



    const post =
        allPosts.find(item => item.id === id);

    if (!post) return;

    sessionStorage.setItem(
        "selectedPost",
        JSON.stringify(post)
    );

    window.location.href =
        `/post.html?id=${id}`;
}

function setupFocusMode() {

    const button =
        document.getElementById("focusModeButton");

    button.addEventListener("click", () => {

        document.body.classList.toggle(
            "focus-mode"
        );
    });
}

function setupNewsletter() {

    const form =
        document.getElementById("newsletterForm");

    form.addEventListener("submit", event => {

        event.preventDefault();

        document.getElementById(
            "newsletterMessage"
        ).textContent =
            "You're on the list. Stay curious.";

        form.reset();
    });
}

function updateLoginState() {

    const token =
        localStorage.getItem("token");

    const loginLink =
        document.getElementById("loginLink");

    if (token) {

        loginLink.textContent =
            "Logout";

        loginLink.href = "#";

        loginLink.onclick = () => {

            localStorage.removeItem("token");

            window.location.reload();
        };
    }
}

function updateReadingProgress() {

    window.addEventListener("scroll", () => {

        const scrollTop =
            window.scrollY;

        const height =
            document.documentElement.scrollHeight -
            document.documentElement.clientHeight;

        const progress =
            height > 0
                ? (scrollTop / height) * 100
                : 0;

        document.getElementById(
            "readingProgress"
        ).style.width =
            `${progress}%`;
    });
}


function createExcerpt(text, length = 150) {

    if (!text) return "";

    if (text.length <= length)
        return text;

    return text.substring(0, length) + "...";
}


function escapeHtml(value) {

    if (!value) return "";

    return value
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}