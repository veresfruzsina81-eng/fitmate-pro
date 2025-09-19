const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

exports.handler = async (event) => {
  // CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type"
      },
      body: ""
    };
  }

  try {
    if (!OPENAI_API_KEY) {
      return {
        statusCode: 500,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({ error: "Missing OPENAI_API_KEY" })
      };
    }

    const { prompt, goal, lang } = JSON.parse(event.body || "{}");
    if (!prompt) {
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({ error: "Hiányzik a prompt" })
      };
    }

    // nyelv normalizálása (pl. en-US -> en)
    const userLang = (lang || "hu").slice(0,2);

    const system = `You are a fitness and nutrition assistant. 
Always answer in ${userLang}.
Be rövid, konkrét és barátságos. User goal: ${goal || "not specified"}.
If health risk comes up, advise to consult a professional.`;

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: system },
          { role: "user", content: prompt }
        ],
        temperature: 0.5,
        max_tokens: 400
      })
    });

    if (!res.ok) {
      const txt = await res.text();
      return {
        statusCode: 502,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({ error: "OpenAI hiba", details: txt })
      };
    }

    const data = await res.json();
    const reply = data?.choices?.[0]?.message?.content?.trim() || "Nincs válasz.";

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ reply })
    };
  } catch (e) {
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ error: e.message })
    };
  }
};
