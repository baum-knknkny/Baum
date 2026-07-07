let currentStoryId = "";

let storyListA = [];

const novelName = "novel-a";

function getAFirstName() {
    return localStorage.getItem("dreamAFirstName")
        || "アカリ";
}

function getALastName() {
    return localStorage.getItem("dreamALastName")
        || "ユウキ";
}

function saveAFirstName() {

    const value =
        document
        .getElementById("AFirstNameInput")
        .value
        .trim();

    localStorage.setItem(
        "dreamAFirstName",
        value
    );
}

function saveALastName() {

    const value =
        document
        .getElementById("ALastNameInput")
        .value
        .trim();

    localStorage.setItem(
        "dreamALastName",
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

    storyListA.forEach(story => {

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
        document.getElementById("storyListA");

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
        `../../content/novel/novel-a/${id}.md`;

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
            getAFirstName()
        )
        .replaceAll(
            "<<ミョウジ>>",
            getALastName()
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
        storyListA.findIndex(
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
        index === storyListA.length - 1 
        ? "none"
            : "inline-block";
}

async function openPrevStory() {

    const index =
        storyListA.findIndex(
            story =>
                story.id === currentStoryId
        );

    if (index > 0) {

        openStory(
            storyListA[
                index - 1
            ].id
            );
        }
}

async function openNextStory() {

    const index =
        storyListA.findIndex(
            story =>
                story.id === currentStoryId
        );

    if (
        index < storyListA.length - 1
        ) ;{    

        openStory(
            storyListA[
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
    
    const heart =
        document
        .getElementById("likeButton")
        .querySelector("img");

    document
        .getElementById("likeCount")
        .textContent =
        data.count;

    document
        .getElementById("likeButton")
        .textContent = "thank you!"

    heart.src = "../../image/pinkhart.png";

    setTimeout(() => {

    document
        .getElementById("likeButton")
        .textContent = "いいねを送る";

    heart.src = "../../image/grayhart.png";

},1000);}

async function initStoryListA() {

    try {

        const response =
            await fetch("../../js/content/storyA.json");

        storyListA =
            await response.json();

        generateStoryList();

    } catch (err) {

        console.error(
            "話一覧の取得に失敗しました",
            err
        );
    }
}

initStoryListA();
