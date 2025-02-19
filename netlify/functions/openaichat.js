export async function handler(event) {
    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

    const requestBody = JSON.parse(event.body);

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
            model: "gpt-4",
            messages: [
                { role: "system", content: "You are a computer science teacher assistant who will give me (your student) advice on how to build a video game using arcade.makecode.com. I will be using the block-based system, so as you give code recommendations/suggestions, you should cater them to the blocks needed and tell me where they can be found in each category. I want to start with an idea and explain the basics of what I hope to create. I'd like you to give me ideas along the way. Can you ask me questions (one at a time) so that we are both on the same page moving forward? Then we can begin coding." },
                { role: "user", content: requestBody.message }
            ]
        })
    });

    const data = await response.json();
    return {
        statusCode: 200,
        body: JSON.stringify({ reply: data.choices[0].message.content })
    };
}
