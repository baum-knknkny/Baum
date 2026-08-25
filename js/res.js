let resList = [];

async function generateRes() {
    const list =
        document.getElementById("resList");
    list.innerHTML = "";
    const res =
        [...resList].reverse();
    for (const item of res) {
        const response =
            await fetch(
                `../content/res/${item.id}.md`
            );
        const markdown =
            await response.text();
        const parts =
            markdown.split("---");
        const content =
            parts[2];
        list.innerHTML +=
        `
        <div class="resBox">
            <h3>${item.title}(${item.commentdate})</h3>
            <hr>
            <p>${content}</p>
            <div class="updateDate">
                ${item.resdate}
            </div>
        </div>
        `;
    }
}

async function initResList() {

    try {

        const response =
            await fetch("../js/content/resList.json");

        resList =
            await response.json();

        generateRes();

    } catch (err) {

        console.error(
            "情報の取得に失敗しました",
            err
        );
    }
}

initResList();