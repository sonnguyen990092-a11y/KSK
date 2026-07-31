const { getStore } = require('@netlify/blobs');

exports.handler = async (event) => {
  const store = getStore({ name: 'health-entries', consistency: 'strong' });
  const headers = { 'Content-Type': 'application/json' };

  try {
    if (event.httpMethod === 'GET') {
      const { blobs } = await store.list();
      const entries = [];
      for (const b of blobs) {
        const val = await store.get(b.key, { type: 'json' });
        if (val) entries.push(val);
      }
      entries.sort((a, b) => b.ts - a.ts);
      return { statusCode: 200, headers, body: JSON.stringify(entries) };
    }

    if (event.httpMethod === 'POST') {
      const entry = JSON.parse(event.body || '{}');
      if (!entry.ts || !entry.code) {
        return { statusCode: 400, headers, body: JSON.stringify({ error: 'Thiếu dữ liệu bắt buộc' }) };
      }
      await store.setJSON(`entry:${entry.ts}`, entry);
      return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };
    }

    if (event.httpMethod === 'DELETE') {
      const ts = event.queryStringParameters && event.queryStringParameters.ts;
      if (!ts) {
        return { statusCode: 400, headers, body: JSON.stringify({ error: 'Thiếu ts' }) };
      }
      await store.delete(`entry:${ts}`);
      return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };
    }

    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  } catch (err) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
  }
};
