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
increaseVisitor();