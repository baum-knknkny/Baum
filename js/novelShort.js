function getShortFirstName() {
    return localStorage.getItem("dreamShortFirstName")
        || "アリス";
}

function getShortLastName() {
    return localStorage.getItem("dreamShortLastName")
        || "ローレル";
}


function saveShortFirstName() {

    const value =
        document
        .getElementById("ShortFirstNameInput")
        .value
        .trim();

    localStorage.setItem(
        "dreamShortFirstName",
        value
    );
}

function saveShortLastName() {

    const value =
        document
        .getElementById("ShortLastNameInput")
        .value
        .trim();

    localStorage.setItem(
        "dreamShortLastName",
        value
    );
}

function toggleChapter(id) {

    const element =
        document.getElementById(id);

    if (element.style.display === "none") {

        element.style.display = "block";

    } else {

        element.style.display = "none";

    }
}

function generateStoryList() {

    const chapters = {};

    storyListShort.forEach(story => {

        if (!chapters[story.chapter]) {

            chapters[story.chapter] = {
                name: story.chapterName,
                stories: []
            };
        }

        chapters[story.chapter]
            .stories
            .push(story);
    });

    const container =
        document.getElementById("storyListShort");

    container.innerHTML = "";

    Object.keys(chapters).forEach(chapterNumber => {

        const chapter =
            chapters[chapterNumber];

        let storyButtons = "";

        chapter.stories.forEach(story => {

            storyButtons += `
                <button
                    onclick="openStory('${story.id}')"
                >
                    ${story.title}
                </button>
                <br>
            `;
        });

        container.innerHTML += `
            <button class="chapter"
                onclick="
                    toggleChapter(
                        'chapter-${chapterNumber}'
                    )
                "
            >
                ${chapter.name}
            </button>

            <div
                id="chapter-${chapterNumber}"
                class="chapter-stories"
                style="display:none;"
            >
                ${storyButtons}
            </div>

            <br>
        `;
    });
}

async function openStory(id) {

    console.log("開こうとしてる:", id);

    const path =
        `content/novel/short/${id}.md`;

    console.log("パス:", path);

    const response =
        await fetch(path);

    console.log(response.status);

    const markdown =
        await response.text();

    const parts =
        markdown.split("---");

    const frontMatter =
        parts[1];

    let content =
        parts[2];

    const titleMatch =
        frontMatter.match(
            /title:\s*(.*)/
        );

    document
        .getElementById("storyTitle")
        .textContent =
        titleMatch[1];

    content =
        content
        .replaceAll(
            "<<ナマエ>>",
            getShortFirstName()
        )
        .replaceAll(
            "<<ミョウジ>>",
            getShortLastName()
        );

    document
        .getElementById("novel")
        .textContent =
        content;

    document
        .getElementById("home")
        .style.display =
        "none";

    document
        .getElementById("storyPage")
        .style.display =
        "block";
}

function backToList() {

    document
        .getElementById("storyPage")
        .style.display =
        "none";

    document
        .getElementById("home")
        .style.display =
        "block";
}

generateStoryList();
