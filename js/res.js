async function generateRes() {

    const list =
        document.getElementById("resList");

    list.innerHTML = "";

    const res =
        [...resList].reverse();

    for (const id of res) {

        const response =
            await fetch(
                `../content/res/${id}.md`
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
        <div class="resBox">

            <h3>${title}</h3>

            <hr>

            <p>${content}</p>

            <div class="resDate">
                ${date}
            </div>

        </div>
        `;

    }

}

generateRes();
