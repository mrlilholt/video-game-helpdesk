function appendMessage(sender, message) {
    const chatBox = document.getElementById("chat-box");
    if (chatBox) {
        const messageElem = document.createElement("div");
        messageElem.textContent = sender + ": " + message;
        chatBox.appendChild(messageElem);
    }
}

async function sendMessage() {
    const userInput = document.getElementById("user-input").value;
    if (!userInput) return;

    appendMessage("You", userInput);

    const response = await fetch("/.netlify/functions/openaichat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userInput })
    });

    const data = await response.json();
    appendMessage("Mr. Lilholt", data.reply);
    document.getElementById("user-input").value = "";
}
