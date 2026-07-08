fetch(
    `${workerURL}?type=visitor`,
    {
        method:"POST"
    }
);


async function loadVisitor(){

    const data =
        await getCounter(
            "visitor"
        );

    document
        .getElementById("visitorCount")
        .textContent =
        data.count;

}

async function increaseVisitor(){

    const data =
        await addCounter(
            "visitor"
        );

    document
        .getElementById("visitorCount")
        .textContent =
        data.count;

}

async function getLatestDate(){

    try {

        const response =
            await fetch("js/content/newList.json");

        const newList =
            await response.json();

        if (newList.length === 0) {
            return;
        }

        const latest =
            [...newList].sort(
                (a, b) =>
                    new Date(b.date) - new Date(a.date)
            )[0];

        document
            .getElementById("latestDate")
            .textContent =
            latest.date;

    } catch (err) {

        console.error(
            "最終更新日の取得に失敗しました",
            err
        );
    }
}

getLatestDate();

window.onload = async () => {

    await increaseVisitor();
    getLatestDate();

};

async function sendClapMessage() {

    const category = "拍手";

    const message = "";


    await sendToDiscord({

        category,

        name,

        message

    });
    sendToDiscord()
    
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


