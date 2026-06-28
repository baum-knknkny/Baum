function generateMarkdown() {
function getTitle (title) {
    const value = document.getItem("title").value.trim();
    return value;
}
function getChapter (chapter) {
    const value = document.getItem("chapter").value.trim();
    return value;
}
function getChapterName (chapterName) {
    const value = document.getItem("chapterName").value.trim();
    return value;
}
function getEpisode (episode) {
    const value = document.getItem("episode").value.trim();
    return value;
}
function getSummary (summary) {
    const value = document.getItem("summary").value.trim();
    return value;
}
const title = getTitle(1);
const chapter = getChapter(1);
const chapterName = getChapterName(1);
const episode = getEpisode(1);
const summary = getSummary(1);
const body = document.getElementById("body").value.trim();
const today = new Date().toISOString().split("T")[0];
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