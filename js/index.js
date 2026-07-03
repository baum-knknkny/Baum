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

function getLatestDate(){

    const latest =
        [...newList].sort(
            (a, b) =>
                new Date(b.date) - new Date(a.date)
        )[0];

    document
        .getElementById("latestDate")
        .textContent =
        latest.date;

}

window.onload = async () => {

    await increaseVisitor();
    getLatestDate();

};
