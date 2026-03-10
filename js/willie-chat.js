(function () {
  var launcher = document.getElementById("willie-launcher");
  var widget = document.getElementById("willie-chat-widget");
  var closeBtn = document.getElementById("close-widget");
  var sendBtn = document.getElementById("widget-send");
  var input = document.getElementById("widget-text");
  var messages = document.getElementById("widget-messages");

  if (!launcher || !widget || !closeBtn || !sendBtn || !input || !messages) {
    return;
  }

  launcher.onclick = function () { widget.style.display = "flex"; };
  closeBtn.onclick = function () { widget.style.display = "none"; };

  async function sendMessage() {
    var text = input.value.trim();
    if (!text) return;

    var userMsg = document.createElement("div");
    userMsg.textContent = "You: " + text;
    userMsg.style.margin = "10px 0";
    messages.appendChild(userMsg);
    messages.scrollTop = messages.scrollHeight;
    input.value = "";

    try {
      var response = await fetch("https://tc1tdu56jh.execute-api.us-east-1.amazonaws.com/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [{ content: text }] })
      });

      var data = await response.json();
      var botMsg = document.createElement("div");
      botMsg.textContent = "Willie: " + (data.reply || "I could not generate a response.");
      botMsg.style.margin = "10px 0";
      botMsg.style.color = "#00f0ff";
      messages.appendChild(botMsg);
    } catch (error) {
      var errMsg = document.createElement("div");
      errMsg.textContent = "Willie: Chat service is unavailable right now.";
      errMsg.style.margin = "10px 0";
      errMsg.style.color = "#ff9aa2";
      messages.appendChild(errMsg);
    }

    messages.scrollTop = messages.scrollHeight;
  }

  sendBtn.onclick = sendMessage;
  input.addEventListener("keypress", function (e) {
    if (e.key === "Enter") sendMessage();
  });
})();
