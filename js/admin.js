function generateMarkdown() {
const title = document.getElementById("title").value;
const chapter = document.getElementById("chapter").value;
const chapterName = document.getElementById("chapterName").value;
const episode = document.getElementById("episode").value;
const summary = document.getElementById("summary").value;
const body = document.getElementById("body").value;
const markdown = `---
title: ${title}

chapter: ${chapter}
chapterName: ${chapterName}

episode: ${episode}

published: ${today}

summary: ${summary}
---

${body}`;

function openMarkdown() {
    document.getElementById("result").value = markdown;
}
}

function copyMarkdown() {
    const result = document.getElementById("result");
    result.select();
    document.execCommand("copy");
}