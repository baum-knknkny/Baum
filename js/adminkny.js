async function saveMarkdown() {

    const response =
        await fetch(

            "https://baum-cms.hutuuneko-mukiryoku.workers.dev",

            {

                method: "POST",

                headers: {

                    "Content-Type":
                        "application/json"

                },

                body: JSON.stringify({

                    action: "saveMarkdown",

                    path:
                        "content/test.md",

                    title:
                        document.getElementById("title").value,

                    body:
                        document.getElementById("body").value

                })

            }

        );

    console.log(
        await response.json()
    );

}
function generateMarkdown() {

    const chapter =
        document
            .getElementById("chapter")
            .value;

    const chapterName =
        document
            .getElementById("chapterName")
            .value;

    const episode =
        document
            .getElementById("episode")
            .value;

    const title =
        document
            .getElementById("title")
            .value;

     const summary =
        document
            .getElementById("summary")
            .value;

    const body =
        document
            .getElementById("body")
            .value;

    // 今日の日付   

    const today = new Date();

    const date =
        today.getFullYear()
        + "-"
        + String(today.getMonth() + 1)
            .padStart(2, "0")
        + "-"
        + String(today.getDate())
            .padStart(2, "0");

    // 00001形式
    
    function getStoryList() {

    const series =
        document
            .getElementById("series")
            .value;

    if (series === "novel-a") {

        return storyListA;

    } else if (series === "novel-b") {

        return storyListB;

    } else {

        return storyListShort;

    }

    };
    const fileName =
        String(getStoryList().length + 1)
            .padStart(5, "0");

    // Markdown生成

    const markdown =
`---
title: ${title}

chapter: ${chapter}
chapterName: ${chapterName}

episode: ${episode}

published: ${date}

summary: ${summary}
---

${body}`;

    const javascript =
`,{
    id:"${fileName}",
    title:"${title}",
    chapter:${chapter},
    chapterName:"${chapterName}"
}
`;


    document
        .getElementById("result")
        .value =
        markdown;

    document
        .getElementById("resultJs")
        .value =
        javascript;

    document
        .getElementById("filename")
        .textContent =
        `保存ファイル名：${fileName}.md`;
}

function copyMarkdown() {

    const result =
        document
            .getElementById("result");

    result.select();

    navigator.clipboard.writeText(
        result.value
    );
}

function copyJs() {

    const result =
        document
            .getElementById("resultJs");

    result.select();

    navigator.clipboard.writeText(
        result.value
    );
}