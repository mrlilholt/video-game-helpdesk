async function sendMessage() {
    const userInput = document.getElementById("user-input").value;
    if (!userInput) return;

    appendMessage("You", userInput);

    const response = await fetch("/.netlify/functions/openaiChat", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ message: userInput })
    });

    const data = await response.json();
    appendMessage("Mr. Lilholt", data.reply);
    document.getElementById("user-input").value = "";
}
