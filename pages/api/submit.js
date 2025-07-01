export default async function handler(req, res) {
  if (req.method === "POST") {
    const { topic, examples, userInput } = req.body;

    if (!topic || !examples || !userInput) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Core logic: Respond with the received data
    res.status(200).json({ message: "Submission received", data: { topic, examples, userInput } });
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
