async function loadAllTotals() {

    const blocks =
        document.querySelectorAll(".novel-block");

    for (const block of blocks) {

        const novel = block.dataset.novel;

        const data =
            await getCounter("total", novel);

        block
            .querySelector(".totalLikeCount")
            .textContent = data.total;
    }
}

async function addNovelLike(button) {

    const block =
        button.closest(".novel-block");

    const novel = block.dataset.novel;

    // 小説全体いいねを1件増やす
    await addCounter("novel-like", novel);

    // 合計（小説全体＋各話）を取り直して表示
    const data =
        await getCounter("total", novel);

    block
        .querySelector(".totalLikeCount")
        .textContent = data.total;

    const textEl =
        block.querySelector(".novelLikeButtonText");

    const heartEl =
        block.querySelector(".heart-pop");

    textEl.textContent = "thank you!";
    heartEl.src = "../image/pinkhart.png";

    setTimeout(() => {
        textEl.textContent = "この小説をいいね";
        heartEl.src = "../image/grayhart.png";
    }, 2000);
}

loadAllTotals();