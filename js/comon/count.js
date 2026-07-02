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

}async function loadLike(){

    const data =
        await getCounter(
            "like",
            novelName,
            currentStoryId
        );

    document
        .getElementById("likeCount")
        .textContent =
        data.count;

}

async function addLike(){

    const data =
        await addCounter(
            "like",
            novelName,
            currentStoryId
        );

    document
        .getElementById("likeCount")
        .textContent =
        data.count;

    document
    .getElementById("likeButton")
    .textContent =
    "♥ 応援ありがとう！";

    setTimeout(() => {

    document
        .getElementById("likeButton")
        .textContent =
        "♡ 応援する";

},1000);

}