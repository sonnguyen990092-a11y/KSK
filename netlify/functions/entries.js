import { getStore } from "@netlify/blobs";

export default async (req) => {
  const store = getStore({ name: "health-entries", consistency: "strong" });
  const headers = { "Content-Type": "application/json" };

  try {
    if (req.method === "GET") {
      const { blobs } = await store.list();
      const entries = [];
      for (const b of blobs) {
        const val = await store.get(b.key, { type: "json" });
        if (val) entries.push(val);
      }
      entries.sort((a, b) => b.ts - a.ts);
      return new Response(JSON.stringify(entries), { status: 200, headers });
    }

    if (req.method === "POST") {
      const entry = await req.json();
      if (!entry.ts || !entry.code) {
        return new Response(JSON.stringify({ error: "Thiếu dữ liệu bắt buộc" }), {
          status: 400,
          headers,
        });
      }
      await store.setJSON(`entry:${entry.ts}`, entry);
      return new Response(JSON.stringify({ ok: true }), { status: 200, headers });
    }

    if (req.method === "DELETE") {
      const url = new URL(req.url);
      const ts = url.searchParams.get("ts");
      if (!ts) {
        return new Response(JSON.stringify({ error: "Thiếu ts" }), {
          status: 400,
          headers,
        });
      }
      await store.delete(`entry:${ts}`);
      return new Response(JSON.stringify({ ok: true }), { status: 200, headers });
    }

    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers,
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers,
    });
  }
};
