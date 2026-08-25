const workerURL =
    "https://counter-woker.hutuuneko-mukiryoku.workers.dev/";

// 小説全体いいねボタン
async function likeNovel(novel) {
  const res = await fetch(`${WORKER_URL}?type=novel-like&novel=${novel}`, { method: "POST" });
  const data = await res.json();
  // data.count が「小説全体いいね」の数
}

// 作品ページで合計を表示
async function loadTotalLikes(novel) {
  const res = await fetch(`${WORKER_URL}?type=total&novel=${novel}`);
  const data = await res.json();
  document.getElementById("total-likes").textContent = data.total;
}