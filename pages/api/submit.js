import OpenAI from 'openai';

const deepseek = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: 'https://api.deepseek.com/v1',
});

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { topic, examples, userInput } = req.body;

    if (!topic || !examples || !userInput) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const isDebugMode = process.env.DEBUG_MODE === 'true';

    try {
      let polishedText;

      if (isDebugMode) {
        // Mock response for debug mode
        polishedText = `🔧 DEBUG MODE - Mock polished text:\n\n"${userInput}"\n\n✨ This text has been enhanced with:\n• Better sentence structure\n• Improved clarity\n• Enhanced flow\n• Professional tone\n\n[This is a mock response to save API calls during development]`;
      } else {
        // Real DeepSeek API call
        let completion;
        let retries = 3;
        
        while (retries > 0) {
          try {
            completion = await deepseek.chat.completions.create({
              model: "deepseek-chat",
              messages: [
                {
                  role: "system",
                  content: "You are a writing assistant that helps polish and improve text. Improve the user's paragraph while maintaining their original meaning and voice. Make it more clear, engaging, and well-structured."
                },
                {
                  role: "user",
                  content: `Topic: ${topic}\n\nExamples: ${examples}\n\nPlease polish and improve this paragraph:\n${userInput}`
                }
              ],
              max_tokens: 500,
              temperature: 0.7,
            });
            break; // Success, exit retry loop
          } catch (apiError) {
            if (apiError.status === 429 && retries > 1) {
              console.log(`Rate limited, retrying in ${4 - retries} seconds...`);
              await new Promise(resolve => setTimeout(resolve, (4 - retries) * 1000));
              retries--;
            } else {
              throw apiError; // Re-throw if not rate limit or no retries left
            }
          }
        }
        polishedText = completion.choices[0].message.content;
      }

      res.status(200).json({ 
        message: "Text polished successfully", 
        data: { topic, examples, userInput, polishedText, isDebugMode } 
      });
    } catch (error) {
      console.error("DeepSeek API error:", error);
      res.status(500).json({ error: "Failed to polish text" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
