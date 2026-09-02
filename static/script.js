// ========================================
// ADMIN PANEL
// ========================================

let adminToken = localStorage.getItem("m3nova_admin_token");

const adminPanel = document.getElementById("adminPanel");
const closeAdminPanel = document.getElementById("closeAdminPanel");

// ========================================
// ELEMENTS
// ========================================

const chat = document.getElementById("chat");
const input = document.getElementById("message");
const sendButton = document.getElementById("sendButton");
const micButton = document.getElementById("micButton");

// AUTH
const authScreen = document.getElementById("authScreen");
const app = document.getElementById("app");

const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");

const showSignup = document.getElementById("showSignup");
const showLogin = document.getElementById("showLogin");

const loginUsername = document.getElementById("loginUsername");
const loginPassword = document.getElementById("loginPassword");

const signupUsername = document.getElementById("signupUsername");
const signupPassword = document.getElementById("signupPassword");

const loginButton = document.getElementById("loginButton");
const signupButton = document.getElementById("signupButton");

const authMessage = document.getElementById("authMessage");
const userInfo = document.getElementById("userInfo");

// CHAT MANAGEMENT
const newChatButton = document.getElementById("newChatButton");
const historyButton = document.getElementById("historyButton");
const logoutButton = document.getElementById("logoutButton");

const sidebar = document.getElementById("sidebar");
const closeSidebar = document.getElementById("closeSidebar");
const chatList = document.getElementById("chatList");


// ========================================
// TOKENS & STATE
// ========================================

let userToken = localStorage.getItem("m3nova_user_token");
let ownerToken = localStorage.getItem("m3nova_owner_token");
let username = localStorage.getItem("m3nova_username");
let currentChatId = localStorage.getItem("m3nova_current_chat_id");


// ========================================
// AUTH SCREEN
// ========================================

function openApp() {

    authScreen.classList.add("hidden");
    app.classList.remove("hidden");

    userInfo.textContent = username || "User";
}


function openAuth() {

    app.classList.add("hidden");
    authScreen.classList.remove("hidden");

}


// ========================================
// AUTH MESSAGE
// ========================================

function showAuthMessage(text) {

    authMessage.textContent = text || "";

}


// ========================================
// SWITCH LOGIN / SIGNUP
// ========================================

showSignup.addEventListener("click", function () {

    loginForm.classList.add("hidden");
    signupForm.classList.remove("hidden");
    authMessage.textContent = "";

});


showLogin.addEventListener("click", function () {

    signupForm.classList.add("hidden");
    loginForm.classList.remove("hidden");
    authMessage.textContent = "";

});


// ========================================
// SIGNUP
// ========================================

async function signup() {

    const newUsername = signupUsername.value.trim();
    const newPassword = signupPassword.value.trim();

    if (newUsername === "" || newPassword === "") {

        showAuthMessage("Barcha maydonlarni to‘ldiring.");
        return;

    }

    signupButton.disabled = true;
    signupButton.textContent = "Creating...";

    try {

        const response = await fetch("/signup", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                username: newUsername,
                password: newPassword
            })

        });


        const data = await response.json();

        showAuthMessage(data.message);


        if (data.success) {

            userToken = data.user_token;
            username = data.username;

            localStorage.setItem(
                "m3nova_user_token",
                userToken
            );

            localStorage.setItem(
                "m3nova_username",
                username
            );

            setTimeout(function () {
openApp();
                loadChats();

            }, 500);

        }


    } catch (error) {

        console.error(error);

        showAuthMessage(
            "Server bilan bog‘lanib bo‘lmadi."
        );

    } finally {

        signupButton.disabled = false;
        signupButton.textContent = "Create Account";

    }

}


// ========================================
// LOGIN
// ========================================

async function login() {

    const loginUser = loginUsername.value.trim();
    const loginPass = loginPassword.value.trim();

    if (loginUser === "" || loginPass === "") {

        showAuthMessage(
            "Username va parolni kiriting."
        );

        return;

    }

    loginButton.disabled = true;
    loginButton.textContent = "Signing in...";


    try {

        const response = await fetch("/login", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                username: loginUser,
                password: loginPass

            })

        });


        const data = await response.json();

        showAuthMessage(data.message);


        if (data.success) {

            userToken = data.user_token;
            username = data.username;

            localStorage.setItem(
                "m3nova_user_token",
                userToken
            );

            localStorage.setItem(
                "m3nova_username",
                username
            );


            setTimeout(function () {

                openApp();
                loadChats();
                loadCurrentChat();

            }, 300);

        }


    } catch (error) {

        console.error(error);

        showAuthMessage(
            "Server bilan bog‘lanib bo‘lmadi."
        );

    } finally {

        loginButton.disabled = false;
        loginButton.textContent = "Sign In";

    }

}


// ========================================
// AUTH BUTTONS
// ========================================

loginButton.addEventListener("click", login);
signupButton.addEventListener("click", signup);


// ========================================
// ENTER LOGIN
// ========================================

loginPassword.addEventListener("keydown", function (event) {

    if (event.key === "Enter") {

        event.preventDefault();
        login();

    }

});


signupPassword.addEventListener("keydown", function (event) {

    if (event.key === "Enter") {

        event.preventDefault();
        signup();

    }

});


// ========================================
// CLEAR CHAT SCREEN
// ========================================

function clearChat() {

    chat.innerHTML = "";

    const welcome = document.createElement("div");

    welcome.className = "welcome";

    welcome.innerHTML =
        '<div class="welcome-logo">M3</div>' +
        '<h1>Salom, men <span>M3NOVA</span></h1>' +
        '<p>Sizning premium sunʼiy intellekt yordamchingiz.</p>' +
        '<div class="welcome-line"></div>';

    chat.appendChild(welcome);

}


// ========================================
// ADD MESSAGE
// ========================================

function addMessage(text, type) {

    const message = document.createElement("div");

    message.className =
        "message " +
        type +
        " message-enter";


    const name = document.createElement("div");

    name.className = "name";

    name.textContent =
        type === "user"
            ? (username || "Siz")
            : "M3NOVA";


    const content = document.createElement("div");

    content.className = "message-text";

    content.textContent = text || "";


    message.appendChild(name);
    message.appendChild(content);

    chat.appendChild(message);


    requestAnimationFrame(function () {

        message.classList.add("show");

    });


    chat.scrollTop = chat.scrollHeight;

    if (type === "ai") {

    speakM3NOVA(text);

}

    return content;

}


// ========================================
// TYPING
// ========================================

function showTyping() {
const message = document.createElement("div");

    message.className =
        "message ai typing-message";


    const name = document.createElement("div");

    name.className = "name";
    name.textContent = "M3NOVA";


    const typing = document.createElement("div");

    typing.className = "typing";

    typing.innerHTML =
        "<span></span><span></span><span></span>";


    message.appendChild(name);
    message.appendChild(typing);

    chat.appendChild(message);

    chat.scrollTop = chat.scrollHeight;

    return message;

}


// ========================================
// CREATE NEW CHAT
// ========================================

async function createNewChat() {

    if (!userToken) {

        openAuth();
        return;

    }


    try {

        const response = await fetch(
            "/new-chat?user_token=" +
            encodeURIComponent(userToken),
            {
                method: "POST"
            }
        );


        const data = await response.json();

        // ========================================
// ADMIN AUTHENTICATION
// ========================================

if (data.admin_authenticated) {

    adminToken = data.admin_token;

    localStorage.setItem(
        "m3nova_admin_token",
        adminToken
    );

    if (adminPanel) {
        adminPanel.classList.remove("hidden");
    }

    loadAdminStats();

    return;
}


        if (!data.success) {

            alert(
                data.message ||
                "Yangi chat yaratib bo‘lmadi."
            );

            return;

        }


        currentChatId = data.chat_id;


        localStorage.setItem(
            "m3nova_current_chat_id",
            currentChatId
        );


        clearChat();

        sidebar.classList.remove("show");

        input.focus();

        await loadChats();


    } catch (error) {

        console.error(
            "NEW CHAT ERROR:",
            error
        );

        alert(
            "Server bilan bog‘lanib bo‘lmadi."
        );

    }

}


// ========================================
// LOAD CHATS
// ========================================

async function loadChats() {

    if (!userToken) {
        return;
    }


    try {

        const response = await fetch(
            "/chats?user_token=" +
            encodeURIComponent(userToken)
        );


        const data = await response.json();


        if (!data.success) {
            return;
        }


        chatList.innerHTML = "";


        if (
            !data.chats ||
            data.chats.length === 0
        ) {

            chatList.innerHTML =
                '<div class="empty-chats">' +
                'Hozircha chatlar yo‘q' +
                '</div>';

            return;

        }


        data.chats.forEach(function (item) {

            const button =
                document.createElement("button");

            button.className = "chat-item";


            if (item.chat_id === currentChatId) {

                button.classList.add("active");

            }


            const title =
                document.createElement("div");

            title.className =
                "chat-item-title";

            title.textContent =
                item.title || "Yangi suhbat";


            const date =
                document.createElement("div");

            date.className =
                "chat-item-date";


            if (item.created_at) {

                try {

                    const chatDate =
                        new Date(item.created_at);

                    date.textContent =
                        chatDate.toLocaleString();

                } catch (error) {

                    date.textContent = "";

                }

            }


            button.appendChild(title);
            button.appendChild(date);


            button.addEventListener(
                "click",
                function () {

                    openChat(item.chat_id);

                }
            );


            chatList.appendChild(button);

        });


    } catch (error) {

        console.error(
            "LOAD CHATS ERROR:",
            error
        );

    }

}


// ========================================
// OPEN OLD CHAT
// ========================================

async function openChat(chatId) {

    if (!userToken) {
        return;
    }


    try {
const response = await fetch(
            "/history?user_token=" +
            encodeURIComponent(userToken) +
            "&chat_id=" +
            encodeURIComponent(chatId)
        );


        const data = await response.json();


        if (!data.success) {
            return;
        }


        currentChatId = chatId;


        localStorage.setItem(
            "m3nova_current_chat_id",
            currentChatId
        );


        chat.innerHTML = "";


        if (
            !data.messages ||
            data.messages.length === 0
        ) {

            clearChat();

        } else {

            data.messages.forEach(
                function (item) {

                    const type =
                        item.role === "user"
                            ? "user"
                            : "ai";

                    addMessage(
                        item.content,
                        type
                    );

                }
            );

        }


        sidebar.classList.remove("show");

        await loadChats();

        input.focus();


    } catch (error) {

        console.error(
            "OPEN CHAT ERROR:",
            error
        );

    }

}


// ========================================
// SIDEBAR
// ========================================

historyButton.addEventListener(
    "click",
    async function () {

        sidebar.classList.toggle("show");


        if (
            sidebar.classList.contains("show")
        ) {

            await loadChats();

        }

    }
);


closeSidebar.addEventListener(
    "click",
    function () {

        sidebar.classList.remove("show");

    }
);


// ========================================
// SEND MESSAGE
// ========================================

async function sendMessage() {

    const message = input.value.trim();


    if (message === "") {
        return;
    }


    if (!userToken) {

        openAuth();
        return;

    }


    // CREATE CHAT AUTOMATICALLY

    if (!currentChatId) {

        try {

            const response = await fetch(
                "/new-chat?user_token=" +
                encodeURIComponent(userToken),
                {
                    method: "POST"
                }
            );


            const data =
                await response.json();


            if (
                data.success &&
                data.chat_id
            ) {

                currentChatId =
                    data.chat_id;


                localStorage.setItem(
                    "m3nova_current_chat_id",
                    currentChatId
                );

            }

        } catch (error) {

            console.error(
                "AUTO NEW CHAT ERROR:",
                error
            );

        }

    }


    const welcome =
        chat.querySelector(".welcome");


    if (welcome) {
        welcome.remove();
    }


    addMessage(message, "user");


    input.value = "";

    input.style.height = "auto";

    sendButton.disabled = true;


    const typingMessage =
        showTyping();


    try {

        const response =
            await fetch("/chat", {

                method: "POST",

                headers: {

                    "Content-Type":
                        "application/json"

                },

                body: JSON.stringify({

                    message: message,

                    user_token:
                        userToken,

                    owner_token:
                        ownerToken,

                    chat_id:
                        currentChatId

                })

            });


        const data =
            await response.json();


        typingMessage.remove();


        if (data.login_required) {

            clearLocalSession();

            openAuth();

            return;

        }


        // OWNER AUTH

        if (data.owner_token) {

            ownerToken =
                data.owner_token;
localStorage.setItem(
                "m3nova_owner_token",
                ownerToken
            );

        }


        // UPDATE CHAT ID

        if (data.chat_id) {

            currentChatId =
                data.chat_id;


            localStorage.setItem(
                "m3nova_current_chat_id",
                currentChatId
            );

        }


        addMessage(
            data.reply ||
            "M3NOVA javob bermadi.",
            "ai"
        );


        loadChats();


    } catch (error) {

        console.error(
            "M3NOVA ERROR:",
            error
        );


        typingMessage.remove();


        addMessage(
            "Server bilan bog‘lanib bo‘lmadi.",
            "ai"
        );


    } finally {

        sendButton.disabled = false;

        input.focus();

    }

}


// ========================================
// NEW CHAT BUTTON
// ========================================

newChatButton.addEventListener(
    "click",
    createNewChat
);

// ========================================
// SEND BUTTON
// ========================================

sendButton.addEventListener(
    "click",
    sendMessage
);


// ========================================
// LOGOUT
// ========================================

async function logout() {

    if (!userToken) {

        clearLocalSession();

        openAuth();

        return;

    }


    try {

        await fetch(
            "/logout?user_token=" +
            encodeURIComponent(userToken),
            {
                method: "POST"
            }
        );

    } catch (error) {

        console.error(
            "LOGOUT ERROR:",
            error
        );

    }


    clearLocalSession();

    clearChat();

    sidebar.classList.remove("show");

    openAuth();

}


// ========================================
// CLEAR LOCAL SESSION
// ========================================

function clearLocalSession() {

    localStorage.removeItem(
        "m3nova_user_token"
    );

    localStorage.removeItem(
        "m3nova_owner_token"
    );

    localStorage.removeItem(
        "m3nova_username"
    );

    localStorage.removeItem(
        "m3nova_current_chat_id"
    );


    userToken = null;
    ownerToken = null;
    username = null;
    currentChatId = null;

}


// ========================================
// LOGOUT BUTTON
// ========================================

logoutButton.addEventListener(
    "click",
    logout
);


// ========================================
// ENTER CHAT
// ========================================

input.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Enter" &&
            !event.shiftKey
        ) {

            event.preventDefault();

            sendMessage();

        }

    }
);


// ========================================
// AUTO HEIGHT
// ========================================

input.addEventListener(
    "input",
    function () {

        this.style.height = "auto";

        this.style.height =
            Math.min(
                this.scrollHeight,
                150
            ) + "px";

    }
);


// ========================================
// LOAD CURRENT CHAT
// ========================================

async function loadCurrentChat() {

    if (
        !userToken ||
        !currentChatId
    ) {

        clearChat();

        return;

    }


    try {

        const response =
            await fetch(
                "/history?user_token=" +
                encodeURIComponent(userToken) +
                "&chat_id=" +
                encodeURIComponent(currentChatId)
            );


        const data =
            await response.json();


        if (
            data.success &&
            data.messages &&
            data.messages.length > 0
        ) {

            chat.innerHTML = "";


            data.messages.forEach(
                function (item) {

                    const type =
                        item.role === "user"
                        ? "user"
                            : "ai";

                    addMessage(
                        item.content,
                        type
                    );

                }
            );

        } else {

            clearChat();

        }


    } catch (error) {

        console.error(
            "LOAD CURRENT CHAT ERROR:",
            error
        );

        clearChat();

    }

}


// ========================================
// APP START
// ========================================

async function initializeApp() {

    if (
        userToken &&
        username
    ) {

        openApp();

        await loadChats();

        await loadCurrentChat();

    } else {

        openAuth();

    }

}


// ========================================
// START
// ========================================

initializeApp();

// ========================================
// VOICE RECOGNITION
// ========================================

const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;


if (SpeechRecognition) {

    const recognition =
        new SpeechRecognition();

    recognition.lang = "uz-UZ";

    recognition.continuous = false;

    recognition.interimResults = false;


    micButton.addEventListener(
        "click",
        function () {

            recognition.start();

        }
    );


    recognition.onstart =
        function () {

            micButton.classList.add(
                "listening"
            );

        };


    recognition.onend =
        function () {

            micButton.classList.remove(
                "listening"
            );

        };


    recognition.onresult =
        function (event) {

            const voiceText =
                event.results[0][0].transcript;


            input.value =
                voiceText;


            // AUTOMATIC SEND

            sendMessage();

        };


    recognition.onerror =
        function (event) {

            console.error(
                "VOICE ERROR:",
                event.error
            );

            micButton.classList.remove(
                "listening"
            );

        };

} else {

    console.log(
        "Speech Recognition qo'llab-quvvatlanmaydi."
    );

}

// ========================================
// M3NOVA VOICE
// ========================================

function speakM3NOVA(text) {

    if (!("speechSynthesis" in window)) {
        return;
    }

    window.speechSynthesis.cancel();

    const speech =
        new SpeechSynthesisUtterance(text);

    speech.lang = "uz-UZ";
    speech.rate = 1;
    speech.pitch = 1.15;

    const voices =
        window.speechSynthesis.getVoices();

    const femaleVoice =
        voices.find(
            voice =>
                voice.name.toLowerCase().includes("female") ||
                voice.name.toLowerCase().includes("zira") ||
                voice.name.toLowerCase().includes("samantha") ||
                voice.name.toLowerCase().includes("google uk english female")
        );

    if (femaleVoice) {
        speech.voice = femaleVoice;
    }

    window.speechSynthesis.speak(speech);
}


window.speechSynthesis.onvoiceschanged =
    function () {
        window.speechSynthesis.getVoices();
    };

    // ========================================
// LOAD ADMIN STATS
// ========================================

async function loadAdminStats() {

    if (!adminToken) {
        return;
    }

    try {

       const response = await fetch(
    "/admin/stats?admin_token=" + adminToken
);

        const data = await response.json();

        if (data.error) {
            console.error("ADMIN ERROR:", data.error);
            return;
        }


        // TOTAL VISITORS

        const totalVisitors =
            document.getElementById("totalVisitors");

        if (totalVisitors) {
            totalVisitors.textContent =
                data.total_visitors ?? 0;
        }


        // ONLINE USERS

        const onlineNow =
            document.getElementById("onlineNow");

        if (onlineNow) {
            onlineNow.textContent =
                data.online_now ?? 0;
        }


        // REGISTERED USERS

        const totalUsers =
            document.getElementById("totalUsers");

        if (totalUsers) {
            totalUsers.textContent =
                data.total_users ?? 0;
        }


        // COUNTRIES

        const countriesList =
            document.getElementById("countriesList");

        if (countriesList) {

            if (!data.countries?.length) {

                countriesList.textContent =
                    "Hozircha ma'lumot yo'q.";

            } else {

                countriesList.innerHTML =
                    data.countries
                        .map(item =>
                            <div>${item.country} — ${item.count}</div>
                        )
                        .join("");

            }
        }


        // DEVICES

        const devicesList =
            document.getElementById("devicesList");

        if (devicesList) {

            if (!data.devices?.length) {

                devicesList.textContent =
                    "Hozircha ma'lumot yo'q.";

            } else {

                devicesList.innerHTML =
                    data.devices
                        .map(item =>
                            <div>${item.device} — ${item.count}</div>
                        )
                        .join("");

            }
        }

    } catch (error) {

        console.error(
            "ADMIN STATS ERROR:",
            error
        );

    }
}

if (closeAdminPanel) {

    closeAdminPanel.addEventListener(
        "click",
        () => {

            adminPanel.classList.add(
                "hidden"
            );

        }
    );

}