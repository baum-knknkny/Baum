async function sendMessage() {

    const message =
        document
        .getElementById("message")
        .value
        .trim;

    await sendToDiscord(message);
    await showRandomClap();
    
}

async function showRandomClap() {
const randomID =
    clapList[
        Math.floor(Math.random() * clapList.length)
    ];


const response =
    await fetch(
        `content/clap/${randomID}.md`
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
    .innerHTML =
    content;

document
    .getElementById("clapArea")
    .style.display =
    "block";
    }

async function sendToDiscord(message) {

    await fetch(
        "https://clap.hutuuneko-mukiryoku.workers.dev",
        {

            method: "POST",

            headers: {

                "Content-Type":
                    "application/json"

            },

            body: JSON.stringify({

                message,

                page:
                    document.title

            })

        }

    );

}
