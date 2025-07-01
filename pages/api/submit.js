import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { topic, examples, userInput } = req.body;

    if (!topic || !examples || !userInput) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    try {
      await client.connect();
      const database = client.db("flashpitch");
      const collection = database.collection("submissions");

      const result = await collection.insertOne({
        topic,
        examples,
        userInput,
        createdAt: new Date(),
      });

      res.status(200).json({ message: "Submission successful", id: result.insertedId });
    } catch (error) {
      console.error("Error saving to database:", error);
      res.status(500).json({ error: "Internal Server Error" });
    } finally {
      await client.close();
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
