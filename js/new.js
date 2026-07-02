async function generateUpdates() {

    const list =
        document.getElementById("newList");

    list.innerHTML = "";

    const updates =
        [...newList].reverse();

    for (const id of updates) {
 (const item of updates) {
    const response = await fetch(
        `content/new/${item.id}.md`   // プロパティを明示
    );

    const markdown = await response.text();
    const parts = markdown.split("---");
    const frontMatter = parts[1];
    const content = parts[2];

    // frontMatterからパースせず、リストのデータをそのまま使ってもOK
    const title = frontMatter.match(/title:\s*(.*)/)[1];
    const date  = frontMatter.match(/date:\s*(.*)/)[1];

    list.innerHTML += `
        <div class="updateBox">
            <h3>${title}</h3>
            <hr>
            <p>${content}</p>
            <div class="updateDate">${date}</div>
        </div>
    `;

    }

}

generateUpdates();
