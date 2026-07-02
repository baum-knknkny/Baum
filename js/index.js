async function increaseVisitor() {

    const response = await fetch(
        "https://counter-woker.hutuuneko-mukiryoku.workers.dev/",
        {
            method: "POST"
        }
    );

console.log(response.status);

    const data = await response.json();
    
        console.log(data);

    document
        .getElementById("visitorCount")
        .textContent =
        data.count;

}

increaseVisitor();

