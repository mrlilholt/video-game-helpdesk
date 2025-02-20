// Default to the video game help endpoint
let currentEndpoint = "/.netlify/functions/openaichat";

function setEndpoint(key) {
  if (key === "video") {
    currentEndpoint = "/.netlify/functions/openaichat";
  } else if (key === "robotics") {
    currentEndpoint = "/.netlify/functions/openaichatrobot";
  }
  // Optionally, clear previous messages or show a notification
  const chatBox = document.getElementById("chat-box");
  chatBox.innerHTML = "";
  appendMessage("System", "Switched to " + key + " help.");
}

function appendMessage(sender, message) {
  const chatBox = document.getElementById("chat-box");
  if (chatBox) {
    const messageElem = document.createElement("div");
    if (sender === "You") {
      messageElem.classList.add("user-message");
    } else if (sender === "System") {
      messageElem.classList.add("system-message");
    } else {
      messageElem.classList.add("api-message");
    }
    messageElem.textContent = sender + ": " + message;
    chatBox.appendChild(messageElem);
  }
}

async function sendMessage() {
  const userInputElem = document.getElementById("user-input");
  const userInput = userInputElem.value;
  if (!userInput) return;

  appendMessage("You", userInput);

  const response = await fetch(currentEndpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: userInput }),
  });
  const data = await response.json();
  appendMessage("Helpdesk", data.reply);
  userInputElem.value = "";
}
