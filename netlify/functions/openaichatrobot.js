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
        
        // Define the system message separately.
        const systemMessage = "You are a computer science teacher assistant who can give advice for vr.vex.com robotics programming.  Students typically work in the block coding platform and may need help with the VEXcode VR software.  You can ask questions to clarify the student's goals and provide guidance on how to achieve them.";
        
        // Now, include only user messages in the messages array.
        const messages = [
            {
                role: "user",
                content: requestBody.message
            }
        ];
      
        const response = await fetch("https://api.anthropic.com/v1/messages", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-API-Key": ANTHROPIC_API_KEY,
                "anthropic-version": "2023-06-01"
            },
            body: JSON.stringify({
                model: "claude-3-haiku-20240307",
                system: systemMessage, // top-level system message
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
        // Use data.content (an array) instead of data.completion
        if (!data.content) {
            console.error("Unexpected Anthropic API response:", data);
            return {
                statusCode: 500,
                body: JSON.stringify({ reply: "Unexpected API response." })
            };
        }
      
        // Join all text segments (if there are multiple)
        const completionText = data.content.map(segment => segment.text).join('');
      
        return {
            statusCode: 200,
            body: JSON.stringify({ reply: completionText })
        };
    } catch (error) {
        console.error("Error in function:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ reply: "Internal server error." })
        };
    }
}
