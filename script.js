const API_KEY = "YOUR_OPENAI_API_KEY";  // Replace with your actual API key

async function sendMessage() {
    const userInput = document.getElementById("user-input").value;
    if (!userInput) return;

    appendMessage("You", userInput);

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
            model: "gpt-4",
            messages: [{ role: "system", content: "You are a friendly assistant that helps students build games in arcade.makecode.com." },
                       { role: "user", content: userInput }]
        })
    });

    const data = await response.json();
    const botReply = data.choices[0].message.content;

    appendMessage("Mr. Lilholt", botReply);
    document.getElementById("user-input").value = "";
}

function appendMessage(sender, text) {
    const chatBox = document.getElementById("chat-box");
    const message = document.createElement("p");
    message.innerHTML = `<strong>${sender}:</strong> ${text}`;
    chatBox.appendChild(message);
    chatBox.scrollTop = chatBox.scrollHeight;
}
