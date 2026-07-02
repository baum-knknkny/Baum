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

window.onload = async () => {

    await increaseVisitor();

};
document

.getElementById("lastUpdate")

.textContent =

updateList[0].date;
