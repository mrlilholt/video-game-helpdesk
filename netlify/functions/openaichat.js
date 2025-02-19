export async function handler(event) {
    const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
    if (!ANTHROPIC_API_KEY) {
        return {
            statusCode: 500,
            body: JSON.stringify({ reply: "Server configuration error: Anthropic API key not set." })
        };
    }
  
    try {
        const requestBody = JSON.parse(event.body);
        
        // Build the messages array for the Messages API.
        const messages = [
            {
                role: "system",
                content: "You are a computer science teacher assistant who will give me (your student) advice on how to build a video game using arcade.makecode.com. I will be using the block-based system, so as you give code recommendations/suggestions, you should cater them to the blocks needed and tell me where they can be found in each category. I want to start with an idea and explain the basics of what I hope to create. I'd like you to give me ideas along the way. Can you ask me questions (one at a time) so that we are both on the same page moving forward? Then we can begin coding."
            },
            {
                role: "user",
                content: requestBody.message
            }
        ];
      
        const response = await fetch("https://api.anthropic.com/v1/beta/messages", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-API-Key": ANTHROPIC_API_KEY,
                "anthropic-version": "2023-06-01" // confirm this version per current docs
            },
            body: JSON.stringify({
                model: "claude-3-5-haiku-20241022", // the model to use
                messages: messages,
                max_tokens: 300
            })
        });
      
        if (!response.ok) {
            const errorText = await response.text();
            console.error("Error from Anthropic API:", errorText);
            return {
                statusCode: response.status,
                body: JSON.stringify({ reply: "Error calling Anthropic API." })
            };
        }
      
        const data = await response.json();
        if (!data.completion) {
            console.error("Unexpected Anthropic API response:", data);
            return {
                statusCode: 500,
                body: JSON.stringify({ reply: "Unexpected API response." })
            };
        }
      
        return {
            statusCode: 200,
            body: JSON.stringify({ reply: data.completion })
        };
    } catch (error) {
        console.error("Error in function:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ reply: "Internal server error." })
        };
    }
}
