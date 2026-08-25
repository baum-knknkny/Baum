const ALLOWED_ORIGINS = [
  "https://baum-knknkny.com",
  "http://127.0.0.1:5500",
  "http://localhost:5500"
];

const SERIES_JSON_PATH = {
  "novel-a": "js/content/storyA.json",
  "novel-b": "js/content/storyB.json",
  "short": "js/content/storyShort.json"
};

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";
    const cors = corsHeaders(origin);

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: cors });
    }

    if (request.headers.get("x-admin-key") !== env.ADMIN_KEY) {
      return json({ error: "Unauthorized" }, 401, cors);
    }

    const url = new URL(request.url);

    try {
      if (request.method === "POST" && url.pathname === "/story") {
        return await handleStory(request, env, cors);
      }
      if (request.method === "POST" && url.pathname === "/update") {
        return await handleUpdate(request, env, cors);
      }
      if (request.method === "POST" && url.pathname === "/reply") {
        return await handleReply(request, env, cors);
      }
      return json({ error: "Not found" }, 404, cors);

    } catch (err) {
      return json({ error: err.message || "Internal Error" }, 500, cors);
    }
  }
};

async function handleStory(request, env, cors) {
  const { series, chapter, chapterName, episode, title, summary, body } =
    await request.json();

  const jsonPath = SERIES_JSON_PATH[series];
  if (!jsonPath) return json({ error: "不明なシリーズです" }, 400, cors);

  const gh = githubContext(env);
  const dirPath = `content/novel/${series}`;

  const id = await getNextId(gh, dirPath);
  const fileName = `${id}.md`;
  const filePath = `${dirPath}/${fileName}`;
  const published = todayJST();

  const md =
`---
title: ${title}
chapter: ${chapter}
chapterName: ${chapterName}
episode: ${episode}
published: ${published}
summary: ${summary}
---

${body}
`;

  await putFile(gh, filePath, md, `add: ${filePath}`);
  await appendToJsonArray(gh, jsonPath, { id, title, chapter, chapterName });

  return json({ ok: true, fileName, id }, 200, cors);
}

async function handleUpdate(request, env, cors) {
  const { title, date, body } = await request.json();

  const gh = githubContext(env);
  const dirPath = "content/new";
  const jsonPath = "js/content/newList.json";

  const id = await getNextId(gh, dirPath);
  const fileName = `${id}.md`;
  const filePath = `${dirPath}/${fileName}`;

  const md =
`---
title: ${title}
date: ${date}
---

${body}
`;

  await putFile(gh, filePath, md, `add: ${filePath}`);
  await appendToJsonArray(gh, jsonPath, { id, title, date });

  return json({ ok: true, fileName, id }, 200, cors);
}

async function handleReply(request, env, cors) {
  const { title, date, question, answer } = await request.json();

  const gh = githubContext(env);
  const dirPath = "content/res";
  const jsonPath = "js/content/resList.json";

  const id = await getNextId(gh, dirPath);
  const fileName = `${id}.md`;
  const filePath = `${dirPath}/${fileName}`;

  const md =
`---
title: ${title}
commentdate: ${commentdate}
resdate: ${resdate}
---

コメント:
${question || "（本文のみ）"}

返信:
${answer}
`;

  await putFile(gh, filePath, md, `add: ${filePath}`);
  await appendToJsonArray(gh, jsonPath, { id, title, commentdate, resdate });

  return json({ ok: true, fileName, id }, 200, cors);
}

function githubContext(env) {
  return {
    owner: env.GITHUB_OWNER,
    repo: env.GITHUB_REPO,
    branch: env.GITHUB_BRANCH || "main",
    headers: {
      Authorization: `token ${env.GITHUB_TOKEN}`,
      "User-Agent": "novel-admin-worker",
      Accept: "application/vnd.github+json"
    }
  };
}

async function getNextId(gh, dirPath) {
  const res = await fetch(
    `https://api.github.com/repos/${gh.owner}/${gh.repo}/contents/${dirPath}?ref=${gh.branch}`,
    { headers: gh.headers }
  );

  let next = 1;

  if (res.ok) {
    const files = await res.json();
    const nums = files
      .map(f => f.name.match(/^(\d{5})\.md$/))
      .filter(Boolean)
      .map(m => parseInt(m[1], 10));
    if (nums.length) next = Math.max(...nums) + 1;
  } else if (res.status !== 404) {
    const errText = await res.text();
    throw new Error(`ディレクトリ取得に失敗しました: ${dirPath} / ${errText}`);
  }

  return String(next).padStart(5, "0");
}

async function putFile(gh, path, content, message) {
  const res = await fetch(
    `https://api.github.com/repos/${gh.owner}/${gh.repo}/contents/${path}`,
    {
      method: "PUT",
      headers: gh.headers,
      body: JSON.stringify({
        message,
        content: toBase64(content),
        branch: gh.branch
      })
    }
  );

  if (!res.ok) {
    throw new Error("ファイル保存失敗: " + path + " / " + await res.text());
  }
}

async function appendToJsonArray(gh, path, entry) {
  const getRes = await fetch(
    `https://api.github.com/repos/${gh.owner}/${gh.repo}/contents/${path}?ref=${gh.branch}`,
    { headers: gh.headers }
  );

  if (!getRes.ok) {
    throw new Error("JSON取得失敗: " + path);
  }

  const fileData = await getRes.json();

  let list;
  try {
    list = JSON.parse(fromBase64(fileData.content));
  } catch (e) {
    throw new Error("JSONのパースに失敗しました: " + path);
  }

  list.push(entry);

  const updated = JSON.stringify(list, null, 2) + "\n";

  const putRes = await fetch(
    `https://api.github.com/repos/${gh.owner}/${gh.repo}/contents/${path}`,
    {
      method: "PUT",
      headers: gh.headers,
      body: JSON.stringify({
        message: `update: ${path} (${entry.id})`,
        content: toBase64(updated),
        sha: fileData.sha,
        branch: gh.branch
      })
    }
  );

  if (!putRes.ok) {
    throw new Error("JSON更新失敗: " + path + " / " + await putRes.text());
  }
}

function toBase64(str) {
  return btoa(unescape(encodeURIComponent(str)));
}
function fromBase64(b64) {
  return decodeURIComponent(escape(atob(b64)));
}
function todayJST() {
  const d = new Date(Date.now() + 9 * 60 * 60 * 1000);
  return d.toISOString().slice(0, 10);
}
function corsHeaders(origin) {
  const allow = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": allow,
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, x-admin-key"
  };
}
function json(obj, status, cors) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "Content-Type": "application/json", ...cors }
  });
}