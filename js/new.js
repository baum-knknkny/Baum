let newList = [];

async function generateUpdates() {
    const list =
        document.getElementById("newList");
    list.innerHTML = "";
    const updates =
        [...newList].reverse();
    for (const item of updates) {
        const response =
            await fetch(
                `../content/new/${item.id}.md`
            );
        const markdown =
            await response.text();
        const parts =
            markdown.split("---");
        const content =
            parts[2];
        list.innerHTML +=
        `
        <div class="updateBox">
            <h3>${item.title}</h3>
            <hr>
            <p>${content}</p>
            <div class="updateDate">
                ${item.date}
            </div>
        </div>
        `;
    }
}

async function initNewList() {

    try {

        const response =
            await fetch("../js/content/newList.json");

        newList =
            await response.json();

        generateUpdates();

    } catch (err) {

        console.error(
            "更新情報の取得に失敗しました",
            err
        );
    }
}

initNewList();