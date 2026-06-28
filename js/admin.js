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

    const fileName =
        String(episode)
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
`
,
,{
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