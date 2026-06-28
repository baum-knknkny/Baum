const PER_PAGE = 10;

let currentPage = 1;

async function generateNewList(page = 1) {

    currentPage = page;

    const list =
        document.getElementById("newList");

    list.innerHTML = "";

    // 新しい順に表示
    const updates =
        [...newList].reverse();

    const start =
        (page - 1) * PER_PAGE;

    const end =
        start + PER_PAGE;

    const pageUpdates =
        updates.slice(start, end);

    for (const id of pageUpdates) {

        const response =
            await fetch(
                `content/new/${id}.md`
            );

        const markdown =
            await response.text();

        const parts =
            markdown.split("---");

        const frontMatter =
            parts[1];

        const title =
            frontMatter
            .match(/title:\s*(.*)/)[1];

        const date =
            frontMatter
            .match(/date:\s*(.*)/)[1];

        const article =
            document.createElement("article");

        article.innerHTML =
            `
            <h3>${title}</h3>
            <p>${date}</p>
            `;

        article.onclick =
            () => openUpdate(id);

        list.appendChild(article);

    }

    updatePageButtons();

}

async function openUpdate(id) {

    const response =
        await fetch(
            `content/new/${id}.md`
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
        frontMatter
        .match(/title:\s*(.*)/)[1];

    const date =
        frontMatter
        .match(/date:\s*(.*)/)[1];

    document
        .getElementById("updateTitle")
        .textContent =
        title;

    document
        .getElementById("updateDate")
        .textContent =
        date;

    document
        .getElementById("updateContent")
        .textContent =
        content;

}

function updatePageButtons() {

    const totalPages =
        Math.ceil(
            newList.length /
            PER_PAGE
        );

    const page =
        document.getElementById("page");

    page.innerHTML = "";

    for (
        let i = 1;
        i <= totalPages;
        i++
    ) {

        const button =
            document.createElement("button");

        button.textContent = i;

        button.onclick =
            () => generateNewList(i);

        page.appendChild(button);

    }

}

generateNewList();