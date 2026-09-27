
// ==========================================
// LOGIN CHECK + FORM SUBMIT
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    const token = localStorage.getItem("token");

    if (!token) {
        alert("Please login before creating an article.");
        window.location.href = "/login.html";
        return;
    }

    const postForm = document.getElementById("postForm");

    if (postForm) {
        postForm.addEventListener("submit", createPost);
    }
});


// ==========================================
// GENERATE SLUG
// ==========================================

function generateSlug(title) {

    return title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-+|-+$/g, "");
}


// ==========================================
// COLLECT BLOG DATA
// ==========================================

function collectBlogData() {

    const titleElement =
        document.getElementById("postTitle");

    const categoryElement =
        document.getElementById("postCategory");

    const tagsElement =
        document.getElementById("postTags");

    const coverImageElement =
        document.getElementById("coverImage");

    const editorElement =
        document.getElementById("blogEditor");

    const seoTitleElement =
        document.getElementById("seoTitle");

    const seoDescriptionElement =
        document.getElementById("seoDescription");


    const title =
        titleElement
            ? titleElement.value.trim()
            : "";


    const slug =
        generateSlug(title);


    return {

        title: title,

        slug: slug,

        category:
            categoryElement
                ? categoryElement.value.trim()
                : "",

        tags:
            tagsElement
                ? tagsElement.value.trim()
                : "",

        coverImage:
            coverImageElement
                ? coverImageElement.value.trim()
                : "",

        content:
            editorElement
                ? editorElement.innerHTML.trim()
                : "",

        seoTitle:
            seoTitleElement
                ? seoTitleElement.value.trim()
                : "",

        seoDescription:
            seoDescriptionElement
                ? seoDescriptionElement.value.trim()
                : ""
    };
}


// ==========================================
// CREATE POST
// ==========================================

async function createPost(event) {

    event.preventDefault();

    await publishBlog();
}


// ==========================================
// BLOG EDITOR
// ==========================================

function formatText(command) {

    document.execCommand(command, false, null);

    const editor =
        document.getElementById("blogEditor");

    if (editor) {
        editor.focus();
    }
}


function formatBlock(tag) {

    document.execCommand(
        "formatBlock",
        false,
        tag
    );

    const editor =
        document.getElementById("blogEditor");

    if (editor) {
        editor.focus();
    }
}


// ==========================================
// ADD LINK
// ==========================================

function addLink() {

    const url =
        prompt("Enter website URL:");

    if (!url) {
        return;
    }

    document.execCommand(
        "createLink",
        false,
        url
    );

    const editor =
        document.getElementById("blogEditor");

    if (editor) {
        editor.focus();
    }
}


// ==========================================
// ADD IMAGE
// ==========================================

function addImage() {

    const imageUrl =
        prompt("Enter image URL:");

    if (!imageUrl) {
        return;
    }

    const editor =
        document.getElementById("blogEditor");

    if (!editor) {
        return;
    }

    const image =
        document.createElement("img");

    image.src = imageUrl;
    image.alt = "Blog Image";
    image.className = "blog-content-image";

    editor.appendChild(image);

    editor.focus();
}


// ==========================================
// ADD YOUTUBE VIDEO
// ==========================================

function addYoutube() {

    const url =
        prompt("Paste YouTube URL:");

    if (!url) {
        return;
    }

    let videoId = "";

    try {

        const parsedUrl =
            new URL(url);


        // youtube.com/watch?v=VIDEO_ID

        if (
            parsedUrl.hostname.includes("youtube.com") &&
            parsedUrl.searchParams.get("v")
        ) {

            videoId =
                parsedUrl.searchParams.get("v");
        }


        // youtu.be/VIDEO_ID

        else if (
            parsedUrl.hostname === "youtu.be"
        ) {

            videoId =
                parsedUrl.pathname
                    .substring(1)
                    .split("/")[0];
        }


        // youtube.com/embed/VIDEO_ID

        else if (
            parsedUrl.pathname.startsWith("/embed/")
        ) {

            videoId =
                parsedUrl.pathname
                    .split("/embed/")[1]
                    .split("/")[0];
        }

    } catch (error) {

        console.error(
            "Invalid YouTube URL:",
            error
        );
    }


    if (!videoId) {

        alert(
            "Invalid YouTube URL."
        );

        return;
    }


    const editor =
        document.getElementById("blogEditor");

    if (!editor) {
        return;
    }


    const wrapper =
        document.createElement("div");

    wrapper.className =
        "youtube-container";


    wrapper.innerHTML = `
        <iframe
            src="https://www.youtube.com/embed/${videoId}"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen>
        </iframe>
    `;


    editor.appendChild(wrapper);

    editor.focus();
}


// ==========================================
// ADD QUOTE
// ==========================================

function addQuote() {

    const quote =
        prompt("Enter your quote:");

    if (!quote) {
        return;
    }

    const editor =
        document.getElementById("blogEditor");

    if (!editor) {
        return;
    }


    const blockquote =
        document.createElement("blockquote");

    blockquote.textContent =
        quote;


    editor.appendChild(blockquote);

    editor.focus();
}


// ==========================================
// SAVE DRAFT
// ==========================================

function saveDraft() {

    const post =
        collectBlogData();


    post.status =
        "DRAFT";


    localStorage.setItem(
        "blogDraft",
        JSON.stringify(post)
    );


    alert(
        "Blog saved as draft!"
    );
}


// ==========================================
// PREVIEW
// ==========================================

function previewBlog() {

    const data =
        collectBlogData();


    const preview =
        document.getElementById(
            "previewArticle"
        );


    if (!preview) {
        return;
    }


    preview.innerHTML = `

        <h1>
            ${escapeHtml(data.title)}
        </h1>


        ${
            data.coverImage
                ? `
                    <img
                        src="${escapeHtml(data.coverImage)}"
                        class="preview-cover"
                        alt="Blog cover">
                  `
                : ""
        }


        <div class="preview-meta">

            <span>
                ${escapeHtml(data.category)}
            </span>

            <span>
                ${escapeHtml(data.tags)}
            </span>

        </div>


        <div class="preview-body">

            ${data.content}

        </div>
    `;


    const modal =
        document.getElementById(
            "previewModal"
        );


    if (modal) {

        modal.style.display =
            "flex";
    }
}


// ==========================================
// CLOSE PREVIEW
// ==========================================

function closePreview() {

    const modal =
        document.getElementById(
            "previewModal"
        );


    if (modal) {

        modal.style.display =
            "none";
    }
}


// ==========================================
// PUBLISH BLOG
// ==========================================

async function publishBlog() {

    const data =
        collectBlogData();


    // --------------------------------------
    // VALIDATION
    // --------------------------------------

    if (!data.title) {

        alert(
            "Please enter a blog title."
        );

        return;
    }


    if (!data.content) {

        alert(
            "Please write something in your blog."
        );

        return;
    }


    const token =
        localStorage.getItem("token");


    if (!token) {

        alert(
            "Please login before publishing."
        );

        window.location.href =
            "/login.html";

        return;
    }


    const message =
        document.getElementById(
            "editorMessage"
        );


    if (message) {

        message.style.color =
            "#ffffff";

        message.textContent =
            "Publishing your article...";
    }


    // --------------------------------------
    // PREPARE DATA
    // --------------------------------------

    const postData = {

        title:
            data.title,

        slug:
            data.slug,

        content:
            data.content,

        category:
            data.category,

        tags:
            data.tags,

        coverImage:
            data.coverImage,

        seoTitle:
            data.seoTitle,

        seoDescription:
            data.seoDescription,

        published:
            true
    };


    console.log(
        "Sending post to backend:",
        postData
    );


    try {

        // ----------------------------------
        // SEND REQUEST
        // ----------------------------------

        const response =
            await fetch(
                "/api/posts",
                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json",

                        "Authorization":
                            `Bearer ${token}`
                    },

                    body:
                        JSON.stringify(
                            postData
                        )
                }
            );


        // ----------------------------------
        // READ RESPONSE
        // ----------------------------------

        let result = {};


        const responseText =
            await response.text();


        console.log(
            "Backend HTTP status:",
            response.status
        );


        console.log(
            "Backend raw response:",
            responseText
        );


        if (responseText) {

            try {

                result =
                    JSON.parse(
                        responseText
                    );

            } catch (parseError) {

                console.warn(
                    "Backend response was not valid JSON."
                );

                result = {
                    message:
                        responseText
                };
            }
        }


        // ----------------------------------
        // ERROR RESPONSE
        // ----------------------------------

        if (!response.ok) {

            console.error(
                "Backend returned:",
                JSON.stringify(
                    result,
                    null,
                    2
                )
            );


            throw new Error(

                result.message ||

                result.error ||

                result.details ||

                result.exception ||

                `Failed to publish blog (${response.status})`
            );
        }


        // ----------------------------------
        // SUCCESS
        // ----------------------------------

        console.log(
            "Blog published successfully:",
            result
        );


        if (message) {

            message.style.color =
                "#4ade80";

            message.textContent =
                "Article published successfully!";
        }


        alert(
            "🎉 Blog published successfully!"
        );


        // ----------------------------------
        // CREATE SHARE URL
        // ----------------------------------

        if (result.id) {

            const blogUrl =
                window.location.origin +
                "/blog/" +
                result.id;


            showShareButtons(
                blogUrl,
                data.title
            );

        } else {

            console.warn(
                "Post created, but no post ID was returned."
            );
        }


        // ----------------------------------
        // RESET FORM
        // ----------------------------------

        const form =
            document.getElementById(
                "postForm"
            );


        if (form) {
            form.reset();
        }


    } catch (error) {

        console.error(
            "Publish blog error:",
            error
        );


        if (message) {

            message.style.color =
                "#ff7188";

            message.textContent =
                error.message ||
                "Could not publish the blog.";
        }


        // ----------------------------------
        // AUTHENTICATION ERROR
        // ----------------------------------

        const errorMessage =
            (
                error.message || ""
            ).toLowerCase();


        if (
            errorMessage.includes(
                "unauthorized"
            ) ||
            errorMessage.includes(
                "forbidden"
            ) ||
            errorMessage.includes(
                "authentication"
            ) ||
            errorMessage.includes(
                "token"
            )
        ) {

            localStorage.removeItem(
                "token"
            );

            localStorage.removeItem(
                "username"
            );

            localStorage.removeItem(
                "fullName"
            );


            setTimeout(() => {

                window.location.href =
                    "/login.html";

            }, 1000);
        }


        alert(
            "Could not publish the blog.\n\n" +
            (
                error.message ||
                "Something went wrong."
            )
        );
    }
}


// ==========================================
// SOCIAL SHARING
// ==========================================

function showShareButtons(
    blogUrl,
    blogTitle
) {

    const shareContainer =
        document.getElementById(
            "shareButtons"
        );


    if (!shareContainer) {

        console.error(
            "shareButtons container not found."
        );

        return;
    }


    const encodedUrl =
        encodeURIComponent(
            blogUrl
        );


    const encodedTitle =
        encodeURIComponent(
            blogTitle
        );


    shareContainer.innerHTML = `

        <div class="share-title">
            Share your blog
        </div>


        <div class="share-buttons">


            <!-- LINKEDIN -->

            <a
                href="https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}"
                target="_blank"
                rel="noopener noreferrer"
                class="share-btn linkedin">

                LinkedIn

            </a>


            <!-- FACEBOOK -->

            <a
                href="https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}"
                target="_blank"
                rel="noopener noreferrer"
                class="share-btn facebook">

                Facebook

            </a>


            <!-- X / TWITTER -->

            <a
                href="https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}"
                target="_blank"
                rel="noopener noreferrer"
                class="share-btn twitter">

                X / Twitter

            </a>


            <!-- WHATSAPP -->

            <a
                href="https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}"
                target="_blank"
                rel="noopener noreferrer"
                class="share-btn whatsapp">

                WhatsApp

            </a>


            <!-- INSTAGRAM -->

            <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
                class="share-btn instagram">

                Instagram

            </a>


            <!-- COPY LINK -->

            <button
                type="button"
                class="share-btn copy-link"
                onclick="copyBlogLink('${escapeAttribute(blogUrl)}')">

                Copy Link

            </button>


        </div>
    `;
}


// ==========================================
// COPY BLOG LINK
// ==========================================

function copyBlogLink(url) {

    if (
        navigator.clipboard &&
        navigator.clipboard.writeText
    ) {

        navigator.clipboard
            .writeText(url)

            .then(() => {

                alert(
                    "Blog link copied!"
                );

            })

            .catch(() => {

                fallbackCopy(url);

            });

    } else {

        fallbackCopy(url);
    }
}


// ==========================================
// FALLBACK COPY
// ==========================================

function fallbackCopy(text) {

    const textarea =
        document.createElement(
            "textarea"
        );


    textarea.value =
        text;


    document.body.appendChild(
        textarea
    );


    textarea.select();


    try {

        document.execCommand(
            "copy"
        );

        alert(
            "Blog link copied!"
        );

    } catch (error) {

        alert(
            "Could not copy the link."
        );

    }


    document.body.removeChild(
        textarea
    );
}


// ==========================================
// ESCAPE HTML
// ==========================================

function escapeHtml(text) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        text || "";


    return div.innerHTML;
}


// ==========================================
// ESCAPE ATTRIBUTE
// ==========================================

function escapeAttribute(text) {

    return String(text || "")
        .replace(/\\/g, "\\\\")
        .replace(/'/g, "\\'")
        .replace(/"/g, "&quot;");
}

