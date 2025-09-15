// /.netlify/functions/ai-chat.js
export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }
  try {
    const { prompt, goal } = JSON.parse(event.body || "{}");
    if (!prompt) {
      return { statusCode: 400, body: JSON.stringify({ reply: "Kérlek írj egy kérdést." }) };
    }

    const sys = `Magyar személyi edző és dietetikus asszisztens vagy.
Stílus: rövid, érthető, bátorító. Cél: ${goal||"fogyas"}.
Ha edzéstervet kérnek: sorozatok/körök, ismétlés, pihenő, forma-tanácsok.
Étel esetén: makrók, csereötletek, olcsó alternatívák.`;

    const resp = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: sys },
          { role: "user", content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 500
      })
    });

    if (!resp.ok) {
      const txt = await resp.text();
      return { statusCode: 500, body: JSON.stringify({ reply: "Chat hiba.", error: txt }) };
    }

    const data = await resp.json();
    const reply = data.choices?.[0]?.message?.content?.trim() || "Nincs válasz.";
    return { statusCode: 200, body: JSON.stringify({ reply }) };
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ reply: "Szerver hiba.", error: e.message }) };
  }
}
