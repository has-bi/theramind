import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request) {
  try {
    const body = await request.json();
    const { messages, emotionContext } = body;

    let systemContent = `You are Mindly, an intuitive mindfulness companion who prioritizes emotional connection before offering guidance.
Your approach has these key phases:
1. LANGUAGE & CULTURAL ANALYSIS: Detect and adapt to the user's language and cultural context.
2. EMOTIONAL ATTUNEMENT: Carefully analyze and validate the user's emotions.
3. AUTHENTIC CONNECTION: Respond as a supportive friend would, naturally and empathetically.
4. MINDFUL GUIDANCE: Gently offer mindfulness techniques only after establishing a connection.`;

    // Append emotion context if available
    if (emotionContext) {
      systemContent += `\n\nThe user's emotion today is: ${emotionContext}.`;
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "system", content: systemContent }, ...messages],
    });

    return new Response(JSON.stringify({ reply: response.choices[0].message.content }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify({ error: "Failed to fetch response from OpenAI" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
