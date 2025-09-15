exports.handler = async () => {
  try {
    const hasKey = !!process.env.OPENAI_API_KEY;
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({
        ok: true,
        env: { OPENAI_API_KEY: hasKey }
      })
    };
  } catch (e) {
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ ok: false, error: e.message })
    };
  }
};
