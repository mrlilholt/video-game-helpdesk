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
        const prompt = `Human: ${requestBody.message}\nAssistant:`;

        const response = await fetch("https://api.anthropic.com/v1/complete", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-API-Key": ANTHROPIC_API_KEY,
                "anthropic-version": "2023-06-01" // update the version as needed per documentation
            },
            body: JSON.stringify({
                prompt: prompt,
                model: "claude-v1",
                max_tokens_to_sample: 300
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
