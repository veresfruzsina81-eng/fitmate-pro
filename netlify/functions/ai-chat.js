// Netlify Functions (Node 18+) – natív fetch használat
exports.handler = async (event) => {
  const cors = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
  };
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers: cors, body: "" };
  }
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, headers: cors, body: "Method Not Allowed" };
  }

  try {
    const { prompt, goal } = JSON.parse(event.body || "{}");
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("Hiányzik az OPENAI_API_KEY környezeti változó.");
    }
    if (!prompt) {
      return { statusCode: 200, headers: cors, body: JSON.stringify({ reply: "Írj valamit a mezőbe ✍️" }) };
    }

    const system = `Magyar személyi edző és dietetikus asszisztens vagy.
Válaszolj röviden, érthetően, pontokba szedve.
Felhasználó célja: ${goal || "ismeretlen"}.`;

    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: system },
          { role: "user", content: prompt }
        ],
        temperature: 0.6,
        max_tokens: 500
      })
    });

    if (!r.ok) {
      const e = await r.text();
      return { statusCode: 200, headers: cors, body: JSON.stringify({ reply: "Chat hiba. Nézd meg a Netlify logot.", error: e }) };
    }

    const j = await r.json();
    const reply = j.choices?.[0]?.message?.content?.trim() || "—";
    return { statusCode: 200, headers: cors, body: JSON.stringify({ reply }) };

  } catch (err) {
    return { statusCode: 200, headers: cors, body: JSON.stringify({ reply: `Hiba: ${err.message}` }) };
  }
};
