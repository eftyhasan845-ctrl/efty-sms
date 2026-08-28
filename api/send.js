export default async function handler(req, res) {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "GET") {
    return res.status(405).json({
      error: true,
      message: "Only GET method is allowed"
    });
  }

  const { number, message } = req.query;

  if (!number || !message) {
    return res.status(400).json({
      error: true,
      message: "number and message are required"
    });
  }

  try {
    const apiUrl = new URL("https://api.g-sheba.top/csms/haf.php");

    apiUrl.searchParams.set("number", number);
    apiUrl.searchParams.set("sms", message);

    const response = await fetch(apiUrl.toString());

    const text = await response.text();

    let data;

    try {
      data = JSON.parse(text);
    } catch {
      data = {
        raw: text
      };
    }

    return res.status(response.status).json({
      success: response.ok,
      developer: "Efty",
      data
    });

  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Failed to call SMS API",
      details: error.message
    });
  }
}
