
let currentStoryId = "";

let storyListShort = [];

const novelName = "short";

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
                <button class="color-button" 
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

    currentStoryId = id;

    console.log("開こうとしてる:", id);

    const path =
        `../../content/novel/short/${id}.md`;

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

    await loadLike();

    updateStoryButtons();

    window.scrollTo(0, 0);
}

function updateStoryButtons() {

    const index =
        storyListShort.findIndex(
            story =>
                story.id === currentStoryId
        );

    document
        .getElementById("prevButton")
        .style.display =
        index === 0
        ? "none"
        : "inline-block";

    document
        .getElementById("nextButton")
        .style.display =
        index === storyListShort.length - 1
        ? "none"
        : "inline-block";
}

async function openPrevStory() {

    const index =
        storyListShort.findIndex(
            story =>
                story.id === currentStoryId
        );

    if (index > 0) {

        openStory(
            storyListShort[
                index - 1
            ].id
        );
    }
}

async function openNextStory() {

    const index =
        storyListShort.findIndex(
            story =>
                story.id === currentStoryId
        );

    if (
        index < storyListShort.length - 1
    ) ;{

        openStory(
            storyListShort[
                index + 1
            ].id
        );
    }
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

async function loadLike(){

    const data =
        await getCounter(
            "like",
            novelName,
            currentStoryId
        );

    document
        .getElementById("likeCount")
        .textContent =
        data.count;
}

async function addLike(){

    const data =
        await addCounter(
            "like",
            novelName,
            currentStoryId
        );

    document
        .getElementById("likeCount")
        .textContent =
        data.count;

    document
        .getElementById("likeButton")
        .textContent =
        "♥ 応援ありがとう！";

    setTimeout(() => {

        document
            .getElementById("likeButton")
            .textContent =
            "♡ 応援する";

    }, 1000);
}

async function initStoryListShort() {

    try {

        const response =
            await fetch("../../js/content/storyShort.json");

        storyListShort =
            await response.json();

        generateStoryList();

    } catch (err) {

        console.error(
            "話一覧の取得に失敗しました",
            err
        );
    }
}

initStoryListShort();