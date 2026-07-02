let currentStoryId = "";

function getBFirstName() {
    return localStorage.getItem("dreamBFirstName")
        || "カエデ";
}

function getBLastName() {
    return localStorage.getItem("dreamBLastName")
        || "シラサキ";
}


function saveBFirstName() {

    const value =
        document
        .getElementById("BFirstNameInput")
        .value
        .trim();

    localStorage.setItem(
        "dreamBFirstName",
        value
    );
}

function saveBLastName() {

    const value =
        document
        .getElementById("BLastNameInput")
        .value
        .trim();

    localStorage.setItem(
        "dreamBLastName",
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

    storyListB.forEach(story => {

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
        document.getElementById("storyListB");

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

    currentStoryId = id;

    console.log("開こうとしてる:", id);

    const path =
        `content/novel/novel-b/${id}.md`;

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
            getBFirstName()
        )
        .replaceAll(
            "<<ミョウジ>>",
            getBLastName()
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
        storyListB.findIndex(
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
        index === storyListB.length - 1
        ? "none"
        : "inline-block";

}

async function openPrevStory() {

    const index =
        storyListB.findIndex(
            story =>
                story.id === currentStoryId
        );

    if (index > 0) {

        openStory(
            storyListB[
                index - 1
            ].id
        );

    }

}

async function openNextStory() {

    const index =
        storyListB.findIndex(
            story =>
                story.id === currentStoryId
        );

    if (
        index <
        storyListB.length - 1
    ) {

        openStory(
            storyListB[
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

},1000);}
generateStoryList();
