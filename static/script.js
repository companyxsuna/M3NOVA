// ========================================
// LOAD CURRENT CHAT
// ========================================

async function loadCurrentChat() {

    if (!userToken || !currentChatId) {

        clearChat();

        return;
    }

    try {

        const response = await fetch(
            "/history?user_token=" +
            encodeURIComponent(userToken) +
            "&chat_id=" +
            encodeURIComponent(currentChatId)
        );

        const data = await response.json();

        if (
            data.success &&
            data.messages &&
            data.messages.length > 0
        ) {

            chat.innerHTML = "";

            data.messages.forEach(function (item) {

                const type =
                    item.role === "user"
                        ? "user"
                        : "ai";

                addMessage(
                    item.content,
                    type
                );

            });

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


        // ========================================
        // TOTAL VISITORS
        // ========================================

        const totalVisitors =
            document.getElementById(
                "totalVisitors"
            );


        if (totalVisitors) {

            totalVisitors.textContent =
                data.total_visitors ?? 0;

        }


        // ========================================
        // ONLINE NOW
        // ========================================

        const onlineNow =
            document.getElementById(
                "onlineNow"
            );


        if (onlineNow) {

            onlineNow.textContent =
                data.online_now ?? 0;

        }


        // ========================================
        // REGISTERED USERS
        // ========================================

        const totalUsers =
            document.getElementById(
                "totalUsers"
            );


        if (totalUsers) {

            totalUsers.textContent =
                data.total_users ?? 0;

        }


        // ========================================
        // COUNTRIES
        // ========================================

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

                            return (
                                <div>${item.country} — ${item.count}</div>
                            );

                        })
                        .join("");

            }

        }


        // ========================================
        // DEVICES
        // ========================================

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

                            return (
                                <div>${item.device} — ${item.count}</div>
                            );

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
        function () {

            if (adminPanel) {

                adminPanel.classList.add(
                    "hidden"
                );

            }

        }
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

    const recognition =
        new SpeechRecognition();


    recognition.lang =
        "uz-UZ";


    recognition.continuous =
        false;


    recognition.interimResults =
        false;


    micButton.addEventListener(
        "click",
        function () {

            try {

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
                event.results[0][0]
                    .transcript;


            if (input) {

                input.value =
                    voiceText;


                input.dispatchEvent(
                    new Event("input")
                );


                sendMessage();

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