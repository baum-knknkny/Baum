export default {
  async fetch(request, env) {

    const corsHeaders = {
      "Access-Control-Allow-Origin": "https://baum-knknkny.com",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    if (request.method !== "POST") {
      return new Response("POST Only", {
        status: 405,
        headers: corsHeaders
      });
    }

    try {

      const data = await request.json();

      // ---------- Markdown保存 ----------
      if (data.action === "saveMarkdown") {

        const markdown = `---
title: ${data.title}
---

${data.body}`;

        const bytes = new TextEncoder().encode(markdown);

        let binary = "";
        for (const byte of bytes) {
          binary += String.fromCharCode(byte);
        }

        const githubContent = btoa(binary);

        const url =
          `https://api.github.com/repos/${env.OWNER}/${env.REPO}/contents/${data.path}`;

        const response = await fetch(url, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${env.GITHUB_TOKEN}`,
            Accept: "application/vnd.github+json",
            "Content-Type": "application/json",
            "User-Agent": "BaumCMS"
          },
          body: JSON.stringify({
            message: `Create ${data.path}`,
            content: githubContent
          })
        });

        return Response.json(await response.json(), {
          headers: corsHeaders
        });
      }

      return Response.json({
        error: "Unknown action"
      }, {
        status: 400,
        headers: corsHeaders
      });

    } catch (e) {

      return Response.json({
        error: e.message,
        stack: e.stack
      }, {
        status: 500,
        headers: corsHeaders
      });

    }

  }
}