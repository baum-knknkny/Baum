let clapList = [];

async function initClapList() {

    try {

        const response =
            await fetch("../js/content/clapList.json");

        clapList =
            await response.json();

    } catch (err) {

        console.error(
            "拍手リストの取得に失敗しました",
            err
        );
    }
}

initClapList();

async function sendMessage() {

    const category = "拍手";

    const message =
        document
        .getElementById("clapMessage")
        .value
        .trim();


    await sendToDiscord({

        category,

        name,

        message

    });
    await showRandomClap();

}

async function showRandomClap() {

    if (clapList.length === 0) {
        console.error("拍手リストがまだ読み込まれていません");
        return;
    }

    const randomID =
        clapList[
            Math.floor(Math.random() * clapList.length)
        ];

    const response =
        await fetch(
            `../content/clap/${randomID}.md`
        );

    const markdown =
        await response.text();

    const parts =
        markdown.split("---");

    const frontMatter =
        parts[1];

    const content =
        parts[2];

    const title =
        frontMatter.match(
            /title:\s*(.*)/
        )[1];

    document
        .getElementById("clapTitle")
        .textContent =
        title;
    document
        .getElementById("clapStory")
        .textContent =
        content;
    document
        .getElementById("clapArea")
        .style.display =
        "block";

}

async function sendToDiscord(data) {

    await fetch(
        "https://clap.hutuuneko-mukiryoku.workers.dev",
        {

            method: "POST",

            headers: {

                "Content-Type":
                    "application/json"

            },

            body: JSON.stringify(data)

        }

    );

}