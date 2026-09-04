// ========================================
// M3NOVA AI - SCRIPT
// ========================================


// ========================================
// ELEMENTS
// ========================================

const authScreen = document.getElementById("authScreen");
const app = document.getElementById("app");

const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");

const loginUsername = document.getElementById("loginUsername");
const loginPassword = document.getElementById("loginPassword");

const signupUsername = document.getElementById("signupUsername");
const signupPassword = document.getElementById("signupPassword");

const loginButton = document.getElementById("loginButton");
const signupButton = document.getElementById("signupButton");

const showSignup = document.getElementById("showSignup");
const showLogin = document.getElementById("showLogin");

const authMessage = document.getElementById("authMessage");

const chat = document.getElementById("chat");
const input = document.getElementById("message");
const sendButton = document.getElementById("sendButton");
const micButton = document.getElementById("micButton");

const newChatButton = document.getElementById("newChatButton");
const historyButton = document.getElementById("historyButton");
const closeSidebar = document.getElementById("closeSidebar");

const sidebar = document.getElementById("sidebar");
const chatList = document.getElementById("chatList");

const userInfo = document.getElementById("userInfo");
const logoutButton = document.getElementById("logoutButton");

const adminPanel = document.getElementById("adminPanel");
const closeAdminPanel = document.getElementById("closeAdminPanel");


// ========================================
// SESSION
// ========================================

let userToken = localStorage.getItem("m3nova_user_token");
let ownerToken = localStorage.getItem("m3nova_owner_token");
let adminToken = localStorage.getItem("m3nova_admin_token");
let username = localStorage.getItem("m3nova_username");
let currentChatId = localStorage.getItem("m3nova_current_chat_id");


// ========================================
// VOICE MODE
// ========================================

let voiceMode = false;
let recognition = null;
let availableVoices = [];


// ========================================
// AUTH MESSAGE
// ========================================

function showAuthMessage(message, success = false) {

    if (!authMessage) {
        return;
    }

    authMessage.textContent = message;

    authMessage.classList.remove("success");

    if (success) {
        authMessage.classList.add("success");
    }
}


// ========================================
// SHOW LOGIN
// ========================================

function showLoginForm() {

    if (loginForm) {
        loginForm.classList.remove("hidden");
    }

    if (signupForm) {
        signupForm.classList.add("hidden");
    }

    showAuthMessage("");
}


// ========================================
// SHOW SIGNUP
// ========================================

function showSignupForm() {

    if (loginForm) {
        loginForm.classList.add("hidden");
    }

    if (signupForm) {
        signupForm.classList.remove("hidden");
    }

    showAuthMessage("");
}


// ========================================
// OPEN AUTH
// ========================================

function openAuth() {

    if (authScreen) {
        authScreen.classList.remove("hidden");
    }

    if (app) {
        app.classList.add("hidden");
    }
}


// ========================================
// OPEN APP
// ========================================

function openApp() {

    if (authScreen) {
        authScreen.classList.add("hidden");
    }

    if (app) {
        app.classList.remove("hidden");
    }

    if (userInfo) {
        userInfo.textContent = username || "User";
    }
}


// ========================================
// LOGIN
// ========================================

async function login() {
const usernameValue = loginUsername
        ? loginUsername.value.trim()
        : "";

    const passwordValue = loginPassword
        ? loginPassword.value
        : "";

    if (!usernameValue || !passwordValue) {

        showAuthMessage(
            "Username va parolni kiriting."
        );

        return;
    }

    if (loginButton) {
        loginButton.disabled = true;
    }

    showAuthMessage("Kirilmoqda...");

    try {

        const response = await fetch("/login", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                username: usernameValue,
                password: passwordValue
            })

        });

        const data = await response.json();

        if (!response.ok || !data.success) {

            showAuthMessage(
                data.message || "Login amalga oshmadi."
            );

            return;
        }

        userToken = data.user_token;
        username = data.username || usernameValue;

        localStorage.setItem(
            "m3nova_user_token",
            userToken
        );

        localStorage.setItem(
            "m3nova_username",
            username
        );

        currentChatId =
            data.chat_id ||
            localStorage.getItem(
                "m3nova_current_chat_id"
            );

        if (currentChatId) {

            localStorage.setItem(
                "m3nova_current_chat_id",
                currentChatId
            );
        }

        showAuthMessage(
            "Muvaffaqiyatli kirildi!",
            true
        );

        openApp();

        await loadChats();
        await loadCurrentChat();

    } catch (error) {

        console.error("LOGIN ERROR:", error);

        showAuthMessage(
            "Server bilan bog‘lanib bo‘lmadi."
        );

    } finally {

        if (loginButton) {
            loginButton.disabled = false;
        }
    }
}


// ========================================
// SIGNUP
// ========================================

async function signup() {

    const usernameValue = signupUsername
        ? signupUsername.value.trim()
        : "";

    const passwordValue = signupPassword
        ? signupPassword.value
        : "";

    if (!usernameValue || !passwordValue) {

        showAuthMessage(
            "Username va parolni kiriting."
        );

        return;
    }

    if (signupButton) {
        signupButton.disabled = true;
    }

    showAuthMessage("Akkaunt yaratilmoqda...");

    try {

        const response = await fetch("/signup", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                username: usernameValue,
                password: passwordValue
            })

        });

        const data = await response.json();

        if (!response.ok || !data.success) {

            showAuthMessage(
                data.message || "Ro‘yxatdan o‘tishda xatolik."
            );

            return;
        }

        showAuthMessage(
            "Akkaunt yaratildi! Endi login qiling.",
            true
        );

        if (signupPassword) {
            signupPassword.value = "";
        }

        showLoginForm();

        if (loginUsername) {
            loginUsername.value = usernameValue;
        }

        if (loginPassword) {
            loginPassword.focus();
        }

    } catch (error) {

        console.error("SIGNUP ERROR:", error);

        showAuthMessage(
            "Server bilan bog‘lanib bo‘lmadi."
        );

    } finally {

        if (signupButton) {
            signupButton.disabled = false;
        }
    }
}


// ========================================
// AUTH EVENTS
// ========================================

if (showSignup) {

    showSignup.addEventListener("click", function (event) {

        event.preventDefault();

        showSignupForm();

    });
}


if (showLogin) {
showLogin.addEventListener("click", function (event) {

        event.preventDefault();

        showLoginForm();

    });
}


if (loginForm) {

    loginForm.addEventListener("submit", function (event) {

        event.preventDefault();

        login();

    });
}


if (signupForm) {

    signupForm.addEventListener("submit", function (event) {

        event.preventDefault();

        signup();

    });
}


// ========================================
// ADD MESSAGE
// ========================================

function addMessage(text, type) {

    if (!chat) {
        return;
    }

    const messageElement =
        document.createElement("div");

    messageElement.className =
        "message " + type;

    const content =
        document.createElement("div");

    content.className =
        "message-content";

    content.textContent =
        text || "";

    messageElement.appendChild(content);

    chat.appendChild(messageElement);

    chat.scrollTop =
        chat.scrollHeight;

    return messageElement;
}


// ========================================
// CLEAR CHAT
// ========================================

function clearChat() {

    if (!chat) {
        return;
    }

    chat.innerHTML = 
        <div class="welcome">

            <div class="welcome-logo">
                M3
            </div>

            <h1>
                Salom, men
                <span>M3NOVA</span>
            </h1>

            <p>
                Sizning premium sunʼiy intellekt yordamchingiz.
            </p>

            <div class="welcome-line"></div>

        </div>
    ;
}


// ========================================
// TYPING MESSAGE
// ========================================

function addTypingMessage() {

    if (!chat) {
        return null;
    }

    const element =
        document.createElement("div");

    element.className =
        "message ai";

    const content =
        document.createElement("div");

    content.className =
        "message-content";

    content.textContent =
        "M3NOVA yozmoqda...";

    element.appendChild(content);

    chat.appendChild(element);

    chat.scrollTop =
        chat.scrollHeight;

    return element;
}


// ========================================
// SEND MESSAGE
// ========================================

async function sendMessage() {

    if (!input) {
        return;
    }

    const message =
        input.value.trim();

    if (!message) {
        return;
    }

    if (!userToken) {

        openAuth();

        return;
    }

    // ====================================
    // ADMIN CODE
    // ====================================

    if (message.toUpperCase() === "SUNA") {

        input.value = "";

        await sendSpecialMessage(message);

        return;
    }

    // ====================================
    // NORMAL MESSAGE
    // ====================================

    input.value = "";

    input.style.height = "auto";

    if (sendButton) {
        sendButton.disabled = true;
    }

    const typingMessage =
        voiceMode
            ? null
            : addTypingMessage();

    try {

        const response =
            await fetch("/chat", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    message: message,

                    user_token: userToken,

                    owner_token: ownerToken,

                    chat_id: currentChatId

                })

            });


        const data =
            await response.json();


        if (data.login_required) {

            clearLocalSession();

            openAuth();

            return;
        }


        if (data.chat_id) {

            currentChatId =
                data.chat_id;

            localStorage.setItem(
                "m3nova_current_chat_id",
                currentChatId
            );
        }


        if (typingMessage) {
            typingMessage.remove();
        }


        if (voiceMode) {
if (data.reply) {

                speakM3NOVA(
                    data.reply
                );
            }

        } else {

            addMessage(
                data.reply ||
                "M3NOVA javob bermadi.",
                "ai"
            );
        }


        await loadChats();


    } catch (error) {

        console.error(
            "M3NOVA ERROR:",
            error
        );


        if (typingMessage) {
            typingMessage.remove();
        }


        if (!voiceMode) {

            addMessage(
                "Server bilan bog‘lanib bo‘lmadi.",
                "ai"
            );

        } else {

            speakM3NOVA(
                "Server bilan bog‘lanib bo‘lmadi."
            );
        }


    } finally {

        if (sendButton) {
            sendButton.disabled = false;
        }

        if (input) {
            input.focus();
        }
    }
}


// ========================================
// SPECIAL MESSAGE
// ========================================

async function sendSpecialMessage(message) {

    try {

        const response =
            await fetch("/chat", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    message: message,

                    user_token: userToken,

                    owner_token: ownerToken,

                    chat_id: currentChatId

                })

            });


        const data =
            await response.json();


        if (data.chat_id) {

            currentChatId =
                data.chat_id;

            localStorage.setItem(
                "m3nova_current_chat_id",
                currentChatId
            );
        }


        // ====================================
        // ADMIN AUTH
        // ====================================

        if (data.admin_authenticated) {

            adminToken =
                data.admin_token;

            localStorage.setItem(
                "m3nova_admin_token",
                adminToken
            );


            if (adminPanel) {

                adminPanel.classList.remove(
                    "hidden"
                );
            }


            await loadAdminStats();

            return;
        }


        // ====================================
        // OWNER AUTH
        // ====================================

        if (data.owner_authenticated) {

            ownerToken =
                data.owner_token;

            localStorage.setItem(
                "m3nova_owner_token",
                ownerToken
            );

            return;
        }


        if (data.reply) {

            if (voiceMode) {

                speakM3NOVA(
                    data.reply
                );

            } else {

                addMessage(
                    data.reply,
                    "ai"
                );
            }
        }


    } catch (error) {

        console.error(
            "SPECIAL MESSAGE ERROR:",
            error
        );
    }
}


// ========================================
// SEND BUTTON
// ========================================

if (sendButton) {

    sendButton.addEventListener(
        "click",
        function () {

            voiceMode = false;

            sendMessage();

        }
    );
}


// ========================================
// ENTER KEY
// ========================================

if (input) {

    input.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Enter" &&
                !event.shiftKey
            ) {

                event.preventDefault();

                voiceMode = false;

                sendMessage();
            }
        }
    );


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
}


// ========================================
// NEW CHAT
// ========================================

async function createNewChat() {

    if (!userToken) {
        return;
    }

    try {

        const response =
            await fetch("/new-chat", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    user_token: userToken

                })

            });


        const data =
            await response.json();


        if (!data.success) {
            return;
        }


        currentChatId =
            data.chat_id;


        localStorage.setItem(
            "m3nova_current_chat_id",
            currentChatId
        );


        clearChat();


        if (sidebar) {

            sidebar.classList.remove(
                "show"
            );
        }


        await loadChats();

    } catch (error) {

        console.error(
            "NEW CHAT ERROR:",
            error
        );
    }
}


if (newChatButton) {

    newChatButton.addEventListener(
        "click",
        createNewChat
    );
}


// ========================================
// LOAD CHATS
// ========================================

async function loadChats() {

    if (!userToken || !chatList) {
        return;
    }

    try {

        const response = await fetch("/chats", {
            headers: {
                "Authorization": "Bearer " + userToken
            }
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("LOAD CHATS ERROR:", data);
            return;
        }

        chatList.innerHTML = "";

        const chats = Array.isArray(data.chats)
            ? data.chats
            : [];

        if (chats.length === 0) {

            chatList.innerHTML =
                '<div class="empty-chats">Hali chatlar mavjud emas</div>';

            return;
        }

        chats.forEach(function(chat) {

            const item = document.createElement("div");

            item.className = "chat-item";

            item.innerHTML =
                '<div class="chat-item-title">' +
                (chat.title || "Yangi chat") +
                '</div>';

            item.addEventListener("click", function() {

                if (chat.id) {
                    currentChatId = chat.id;
                    loadCurrentChat();
                }

            });

            chatList.appendChild(item);

        });

    } catch (error) {

        console.error("LOAD CHATS ERROR:", error);

    }
}


// ========================================
// CLOSE SIDEBAR
// ========================================

if (closeSidebar) {

    closeSidebar.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            if (sidebar) {

                sidebar.classList.remove(
                    "show"
                );

            }

        }
    );

}


// ========================================
// LOGOUT
// ========================================

async function logout() {

    if (userToken) {

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

    }

    clearLocalSession();

    clearChat();

    openAuth();

}


// ========================================
// CLEAR SESSION
// ========================================

function clearLocalSession() {

    localStorage.removeItem(
        "m3nova_user_token"
    );

    localStorage.removeItem(
        "m3nova_owner_token"
    );

    localStorage.removeItem(
        "m3nova_admin_token"
    );

    localStorage.removeItem(
        "m3nova_username"
    );

    localStorage.removeItem(
        "m3nova_current_chat_id"
    );

    userToken = null;

    ownerToken = null;

    adminToken = null;

    username = null;

    currentChatId = null;

}


// ========================================
// LOGOUT BUTTON
// ========================================

if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            logout();

        }
    );

}


// ========================================
// ADMIN STATISTICS
// ========================================

async function loadAdminStats() {

    if (!adminToken) {
        return;
    }

    try {

        const response =
            await fetch(
                "/admin/stats?admin_token=" +
                encodeURIComponent(adminToken)
            );

        const data =
            await response.json();


        if (data.error) {

            console.error(
                "ADMIN ERROR:",
                data.error
            );
return;
        }


        const totalVisitors =
            document.getElementById(
                "totalVisitors"
            );

        if (totalVisitors) {

            totalVisitors.textContent =
                data.total_visitors ?? 0;

        }


        const onlineNow =
            document.getElementById(
                "onlineNow"
            );

        if (onlineNow) {

            onlineNow.textContent =
                data.online_now ?? 0;

        }


        const totalUsers =
            document.getElementById(
                "totalUsers"
            );

        if (totalUsers) {

            totalUsers.textContent =
                data.total_users ?? 0;

        }


        const countriesList =
            document.getElementById(
                "countriesList"
            );

        if (countriesList) {

            if (
                !data.countries ||
                data.countries.length === 0
            ) {

                countriesList.textContent =
                    "Hozircha ma'lumot yo‘q.";

            } else {

                countriesList.innerHTML =
                    data.countries
                        .map(function (item) {

                            return 
                                <div>
                                    ${item.country} — ${item.count}
                                </div>
                            ;

                        })
                        .join("");

            }

        }


        const devicesList =
            document.getElementById(
                "devicesList"
            );

        if (devicesList) {

            if (
                !data.devices ||
                data.devices.length === 0
            ) {

                devicesList.textContent =
                    "Hozircha ma'lumot yo‘q.";

            } else {

                devicesList.innerHTML =
                    data.devices
                        .map(function (item) {

                            return 
                                <div>
                                    ${item.device} — ${item.count}
                                </div>
                            ;

                        })
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


// ========================================
// CLOSE ADMIN PANEL
// ========================================

if (closeAdminPanel) {

    closeAdminPanel.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            if (adminPanel) {

                adminPanel.classList.add(
                    "hidden"
                );

            }

        }
    );

}


// ========================================
// VOICE SYSTEM
// ========================================

function loadVoices() {

    if (
        typeof speechSynthesis ===
        "undefined"
    ) {

        return;
    }

    availableVoices =
        speechSynthesis.getVoices();

}


if (
    typeof speechSynthesis !==
    "undefined"
) {

    loadVoices();

    speechSynthesis.onvoiceschanged =
        loadVoices;

}


// ========================================
// FIND UZBEK VOICE
// ========================================

function getUzbekVoice() {

    if (
        !availableVoices ||
        availableVoices.length === 0
    ) {

        return null;

    }


    const voice =
        availableVoices.find(
            function (item) {

                return (
                    item.lang &&
                    item.lang
                        .toLowerCase()
                        .startsWith("uz")
                );

            }
        );


    return voice || null;

}


// ========================================
// M3NOVA SPEAK
// ========================================

function speakM3NOVA(text) {

    if (
        typeof speechSynthesis ===
        "undefined"
    ) {

        return;

    }
if (!text) {
        return;
    }


    speechSynthesis.cancel();


    const utterance =
        new SpeechSynthesisUtterance(
            text
        );


    const uzbekVoice =
        getUzbekVoice();


    if (uzbekVoice) {

        utterance.voice =
            uzbekVoice;

        utterance.lang =
            uzbekVoice.lang;

    } else {

        utterance.lang =
            "uz-UZ";

    }


    utterance.rate =
        0.92;

    utterance.pitch =
        1.0;

    utterance.volume =
        1.0;


    speechSynthesis.speak(
        utterance
    );

}


// ========================================
// VOICE RECOGNITION
// ========================================

const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;


if (
    SpeechRecognition &&
    micButton
) {

    recognition =
        new SpeechRecognition();


    recognition.lang =
        "uz-UZ";


    recognition.continuous =
        false;


    recognition.interimResults =
        false;


    recognition.maxAlternatives =
        1;


    micButton.addEventListener(
        "click",
        function (event) {

            event.preventDefault();


            if (!userToken) {

                openAuth();

                return;

            }


            try {

                if (
                    typeof speechSynthesis !==
                    "undefined"
                ) {

                    speechSynthesis.cancel();

                }


                voiceMode = true;

                recognition.start();

            } catch (error) {

                console.error(
                    "VOICE START ERROR:",
                    error
                );

            }

        }
    );


    recognition.onstart =
        function () {

            voiceMode = true;


            micButton.classList.add(
                "listening"
            );


            micButton.setAttribute(
                "title",
                "Tinglayapman..."
            );

        };


    recognition.onend =
        function () {

            micButton.classList.remove(
                "listening"
            );


            micButton.setAttribute(
                "title",
                "Gapirish"
            );

        };


    recognition.onresult =
        async function (event) {

            const voiceText =
                event.results[0][0]
                    .transcript
                    .trim();


            if (!voiceText) {
                return;
            }


            try {

                const response =
                    await fetch(
                        "/chat",
                        {

                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify({

                                    message:
                                        voiceText,

                                    user_token:
                                        userToken,

                                    owner_token:
                                        ownerToken,

                                    chat_id:
                                        currentChatId

                                })

                        }
                    );


                const data =
                    await response.json();


                if (
                    data.login_required
                ) {

                    clearLocalSession();

                    openAuth();

                    return;

                }


                if (data.chat_id) {

                    currentChatId =
                        data.chat_id;


                    localStorage.setItem(
                        "m3nova_current_chat_id",
                        currentChatId
                    );

                }
// ====================================
                // FAQAT OVOZLI JAVOB
                // ====================================

                if (data.reply) {

                    speakM3NOVA(
                        data.reply
                    );

                }


                await loadChats();


            } catch (error) {

                console.error(
                    "VOICE CHAT ERROR:",
                    error
                );


                speakM3NOVA(
                    "Kechirasiz, server bilan bog‘lanishda xatolik yuz berdi."
                );

            }

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


            if (
                event.error ===
                "not-allowed"
            ) {

                speakM3NOVA(
                    "Mikrofondan foydalanishga ruxsat berilmagan."
                );

            }

        };


} else {

    console.log(
        "Speech Recognition qo‘llab-quvvatlanmaydi."
    );

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


initializeApp();