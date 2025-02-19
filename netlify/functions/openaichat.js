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
                { role: "system", content: "You are a friendly assistant that helps students build games in arcade.makecode.com." },
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
