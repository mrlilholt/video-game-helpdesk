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

        // Anthropic API expects a prompt with conversation context.
        const prompt = `Human: ${requestBody.message}\nAssistant:`;

        // Call Anthropic's Claude API
        const response = await fetch("https://api.anthropic.com/v1/complete", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-API-Key": ANTHROPIC_API_KEY
            },
            body: JSON.stringify({
                prompt: prompt,
                model: "claude-v1", // update to the desired version per Anthropic documentation
                max_tokens_to_sample: 300,
                // add other parameters as needed
            })
        });
        
        // Check for non-OK responses
        if (!response.ok) {
            const errorText = await response.text();
            console.error("Error from Anthropic API:", errorText);
            return {
                statusCode: response.status,
                body: JSON.stringify({ reply: "Error calling Anthropic API." })
            };
        }

        const data = await response.json();
        // Anthropic's API returns a field called completion.
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
