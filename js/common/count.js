const workerURL =
    "https://counter-woker.hutuuneko-mukiryoku.workers.dev/";

async function getCounter(type, novel = "", story = "") {

    let url =
        `${workerURL}?type=${type}`;

    if (novel) {

        url += `&novel=${novel}`;

    }

    if (story) {

        url += `&story=${story}`;

    }

    const response =
        await fetch(url);

    return await response.json();

}

async function addCounter(type, novel = "", story = "") {

    let url =
        `${workerURL}?type=${type}`;

    if (novel) {

        url += `&novel=${novel}`;

    }

    if (story) {

        url += `&story=${story}`;

    }

    const response =
        await fetch(
            url,
            {
                method:"POST"
            }
        );

    return await response.json();

}