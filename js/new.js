async function generateUpdates() {

    const list =
        document.getElementById("newList");

    list.innerHTML = "";

    const updates =
        [...newList].reverse();

    for (const id of updates) {

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
            frontMatter.match(
                /title:\s*(.*)/
            )[1];

        const date =
            frontMatter.match(
                /date:\s*(.*)/
            )[1];

        list.innerHTML +=
        `
        <div class="updateBox">

            <h2>${title}</h2>

            <hr>

            <p>${content}</p>

            <div class="updateDate">
                ${date}
            </div>

        </div>
        `;

    }

}

generateUpdates();
