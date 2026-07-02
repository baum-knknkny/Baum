async function sendMessage() {

    const category =
        document
            .getElementById("category")
            .value;

    const name =
        document
            .getElementById("name")
            .value
            .trim();

    const message =
        document
            .getElementById("message")
            .value
            .trim();

    if (message === "") {

        alert("メッセージを入力してください。");
        return;

    }

    await sendToDiscord({

    category,

    name,

    message

});

    document
    .getElementById("category")
    .selectedIndex = 0;

    document
    .getElementById("name")
    .value = "";


    document
    .getElementById("message")
    .value = "";

    alert("送信しました");

}

async function sendToDiscord(data) {

    await fetch(
        "https://clap.hutuuneko-mukiryoku.workers.dev",
        {

            method: "POST",

            headers: {

                "Content-Type":
                    "application/json"

            },

            body: JSON.stringify(data)

        }

    );

}
