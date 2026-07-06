const WORKER_URL = "https://baum-cms.hutuuneko-mukiryoku.workers.dev";

const DRAFT_KEY = "adminDraft";
const FIELDS_BY_TAB = {
  story: ["story-series", "story-chapter", "story-episode", "story-chapterName", "story-title", "story-summary", "story-body"],
  update: ["update-title", "update-date", "update-body"],
  reply: ["reply-title", "reply-date", "reply-question", "reply-answer"]
};

let currentTab = "story";

// ---------- 初期化 ----------

function init() {
  document.getElementById("adminKey").value =
    localStorage.getItem("adminKey") || "";

  document.getElementById("adminKey").addEventListener("input", (e) => {
    localStorage.setItem("adminKey", e.target.value);
  });

  document.querySelectorAll(".tab-btn").forEach(btn => {
    btn.addEventListener("click", () => switchTab(btn.dataset.tab));
  });

  document.getElementById("saveBtn").addEventListener("click", handleSave);

  restoreDraft();
  attachDraftListeners();

  if (!document.getElementById("update-date").value) {
    const today = new Date().toISOString().slice(0, 10);
    document.getElementById("update-date").value = today;
    document.getElementById("reply-date").value = today;
  }
}

function switchTab(tab) {
  currentTab = tab;

  document.querySelectorAll(".tab-btn").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.tab === tab);
  });

  document.querySelectorAll(".panel").forEach(panel => {
    panel.classList.toggle("active", panel.id === `panel-${tab}`);
  });

  setStatus("", "");
}

// ---------- 下書き自動保存 ----------

function attachDraftListeners() {
  const allIds = Object.values(FIELDS_BY_TAB).flat();
  allIds.forEach(id => {
    const el = document.getElementById(id);
    el.addEventListener("input", saveDraft);
  });
}

function saveDraft() {
  const draft = {};
  const allIds = Object.values(FIELDS_BY_TAB).flat();
  allIds.forEach(id => {
    draft[id] = document.getElementById(id).value;
  });
  localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
}

function restoreDraft() {
  const raw = localStorage.getItem(DRAFT_KEY);
  if (!raw) return;

  try {
    const draft = JSON.parse(raw);
    Object.entries(draft).forEach(([id, value]) => {
      const el = document.getElementById(id);
      if (el) el.value = value;
    });
  } catch (e) {
    console.error("下書きの復元に失敗しました", e);
  }
}

function clearDraftForTab(tab) {
  FIELDS_BY_TAB[tab].forEach(id => {
    const el = document.getElementById(id);
    if (el.tagName === "SELECT") return;
    el.value = "";
  });
  saveDraft();
}

// ---------- 保存処理 ----------

async function handleSave() {
  const adminKey = document.getElementById("adminKey").value.trim();
  if (!adminKey) {
    setStatus("管理者キーを入力してください", "error");
    return;
  }

  let endpoint, payload, validation;

  if (currentTab === "story") {
    payload = {
      series: value("story-series"),
      chapter: Number(value("story-chapter")),
      chapterName: value("story-chapterName"),
      episode: Number(value("story-episode")),
      title: value("story-title"),
      summary: value("story-summary"),
      body: value("story-body")
    };
    endpoint = "/story";
    validation = payload.chapterName && payload.title && payload.body;

  } else if (currentTab === "update") {
    payload = {
      title: value("update-title"),
      date: value("update-date"),
      body: value("update-body")
    };
    endpoint = "/update";
    validation = payload.title && payload.date && payload.body;

  } else if (currentTab === "reply") {
    payload = {
      title: value("reply-title"),
      date: value("reply-date"),
      question: value("reply-question"),
      answer: value("reply-answer")
    };
    endpoint = "/reply";
    validation = payload.title && payload.answer;
  }

  if (!validation) {
    setStatus("入力に不足があります", "error");
    return;
  }

  const btn = document.getElementById("saveBtn");
  btn.disabled = true;
  btn.textContent = "保存中...";
  setStatus("", "");

  try {
    const res = await fetch(WORKER_URL + endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-admin-key": adminKey
      },
      body: JSON.stringify(payload)
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "保存に失敗しました");
    }

    setStatus(`保存しました (${data.fileName})`, "success");
    clearDraftForTab(currentTab);

  } catch (err) {
    console.error(err);
    setStatus("エラー: " + err.message, "error");

  } finally {
    btn.disabled = false;
    btn.textContent = "保存する";
  }
}

function value(id) {
  return document.getElementById(id).value.trim();
}

function setStatus(message, type) {
  const el = document.getElementById("status");
  el.textContent = message;
  el.className = "status" + (type ? " " + type : "");
}

init();