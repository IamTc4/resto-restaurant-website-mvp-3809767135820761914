(function() {
    // 1. Inject CSS
    const styles = `
        #rb-chat-btn {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 60px;
            height: 60px;
            background: #D35400;
            color: white;
            border-radius: 50%;
            border: none;
            box-shadow: 0 4px 10px rgba(0,0,0,0.2);
            cursor: pointer;
            z-index: 1000;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            transition: transform 0.3s;
        }
        #rb-chat-btn:hover {
            transform: scale(1.1);
        }
        #rb-chat-window {
            position: fixed;
            bottom: 90px;
            right: 20px;
            width: 350px;
            max-width: 90%;
            height: 500px;
            max-height: 70vh;
            background: white;
            border-radius: 10px;
            box-shadow: 0 5px 20px rgba(0,0,0,0.15);
            display: none;
            flex-direction: column;
            z-index: 1000;
            overflow: hidden;
            font-family: 'Poppins', sans-serif;
        }
        #rb-chat-header {
            background: #D35400;
            color: white;
            padding: 15px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        #rb-chat-header h3 {
            margin: 0;
            font-size: 1rem;
        }
        #rb-chat-close {
            background: none;
            border: none;
            color: white;
            cursor: pointer;
            font-size: 1.2rem;
        }
        #rb-chat-messages {
            flex: 1;
            padding: 15px;
            overflow-y: auto;
            background: #f9f9f9;
        }
        .rb-msg {
            margin-bottom: 10px;
            max-width: 80%;
            padding: 10px 15px;
            border-radius: 15px;
            font-size: 0.9rem;
            line-height: 1.4;
        }
        .rb-msg-bot {
            background: #eee;
            color: #333;
            border-bottom-left-radius: 2px;
            align-self: flex-start;
            margin-right: auto;
        }
        .rb-msg-user {
            background: #D35400;
            color: white;
            border-bottom-right-radius: 2px;
            align-self: flex-end;
            margin-left: auto;
        }
        #rb-chat-input-area {
            padding: 15px;
            border-top: 1px solid #eee;
            display: flex;
            gap: 10px;
        }
        #rb-chat-input {
            flex: 1;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 20px;
            outline: none;
        }
        #rb-chat-send {
            background: #D35400;
            color: white;
            border: none;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
        }
    `;

    const styleSheet = document.createElement("style");
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);

    // 2. Inject HTML
    const widgetHTML = `
        <button id="rb-chat-btn"><i class="fas fa-comment-dots"></i></button>
        <div id="rb-chat-window">
            <div id="rb-chat-header">
                <div>
                    <h3>RestaurantBot AI</h3>
                    <span style="font-size: 0.7rem; opacity: 0.8;">Online</span>
                </div>
                <button id="rb-chat-close"><i class="fas fa-times"></i></button>
            </div>
            <div id="rb-chat-messages" style="display: flex; flex-direction: column;"></div>
            <div id="rb-chat-input-area">
                <input type="text" id="rb-chat-input" placeholder="Ask about menu, offers..." />
                <button id="rb-chat-send"><i class="fas fa-paper-plane"></i></button>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', widgetHTML);

    // 3. Logic & Bot Initialization
    const chatBtn = document.getElementById('rb-chat-btn');
    const chatWindow = document.getElementById('rb-chat-window');
    const closeBtn = document.getElementById('rb-chat-close');
    const messagesContainer = document.getElementById('rb-chat-messages');
    const inputField = document.getElementById('rb-chat-input');
    const sendBtn = document.getElementById('rb-chat-send');

    // Initialize Bot (assuming menuData is global from menu.js)
    const bot = new RestaurantBot(typeof menuData !== 'undefined' ? menuData : []);

    // Toggle Window
    function toggleChat() {
        const isVisible = chatWindow.style.display === 'flex';
        chatWindow.style.display = isVisible ? 'none' : 'flex';
        if (!isVisible && messagesContainer.children.length === 0) {
            // First open, send greeting
            addMessage(bot.greet(), 'bot');
        }
        if (!isVisible) {
            inputField.focus();
        }
    }

    chatBtn.addEventListener('click', toggleChat);
    closeBtn.addEventListener('click', toggleChat);

    // Send Message
    function sendMessage() {
        const text = inputField.value.trim();
        if (!text) return;

        addMessage(text, 'user');
        inputField.value = '';

        // Bot Response Simulation
        // Show typing indicator could go here
        setTimeout(() => {
            const response = bot.processMessage(text);
            addMessage(response, 'bot');
        }, 600);
    }

    sendBtn.addEventListener('click', sendMessage);
    inputField.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });

    function addMessage(text, sender) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `rb-msg rb-msg-${sender}`;

        // Allow basic bold markdown
        msgDiv.innerHTML = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>');

        messagesContainer.appendChild(msgDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

})();
