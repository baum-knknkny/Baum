async function increaseVisitor() {

    const response = await fetch(
        "https://counter-woker.hutuuneko-mukiryoku.workers.dev/",
        {
            method: "POST"
        }
    );

    const data = await response.json();

    document
        .getElementById("visitorCount")
        .textContent =
        data.count;

}

increaseVisitor();

