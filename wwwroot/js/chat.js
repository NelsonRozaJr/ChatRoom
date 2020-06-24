const connection = new signalR.HubConnectionBuilder()
    .withUrl("/hub")
    .build();

//Disable buttons until connection is established
changeDisableButtons(true);

connection.on("ReceiveMessage", (firstName, lastName, userName, message, isConnected, isDisconnected) => {
    message = message.replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

    let divMessage = document.createElement("div");
    divMessage.className = "col-12 mb-2";
    divMessage.className += currentUserName === userName ? " text-right" : " text-left";

    if (isConnected) {
        divMessage.className += " bg-connected";
    }
    else if (isDisconnected) {
        divMessage.className += " bg-disconnected";
    }
    else {
        divMessage.className += currentUserName === userName ? " bg-light" : " bg-message";
    }

    let localDate = new Date().toLocaleString();
    let fullName = `${firstName} ${lastName}`;

    divMessage.innerHTML = '<div class="show-date">' + localDate + '</div>';

    if (isConnected) {
        divMessage.innerHTML += '<div class="message-author">' + fullName + '<span class="is-connected"> is connected.</span></div>';
    }
    else if (isDisconnected) {
        divMessage.innerHTML += '<div class="message-author">' + fullName + '<span class="is-disconnected"> is disconnected.</span></div>';
    }
    else {
        divMessage.innerHTML += '<div class="message-author">' + fullName + '<span class="says-to"> says to all:</span></div>' +
            '<div class="message">' + message + '</div>';
    }

    let divMessages = document.getElementById("messagesList");
    divMessages.appendChild(divMessage);
    divMessages.scrollTop = divMessages.scrollHeight;
});

connectionStart();

$("#sendButton").click(event => {
    sendMessage();
    event.preventDefault();
});

$("#exitButton").click(function (event) {
    connectionStop();

    changeDisableButtons(true);

    $("#messageInput").val("");
    $("#startButton").show();
    $("#exitButton").hide();

    event.preventDefault();
});

$("#startButton").click(event => {
    connectionStart();
    $("#exitButton").show();
    event.preventDefault();
});

$("#messageInput").keypress(event => {
    if (event.which === 13 && !event.shiftKey) {
        sendMessage();
        event.preventDefault();
    }
});

function connectionStart() {
    connection.start()
        .then(() => {
            changeDisableButtons(false);
            $("#startButton").hide();
        })
        .catch(err => console.error(err.toString()));
}

function connectionStop() {
    connection.stop()
        .catch(err => console.error(err));
}

function changeDisableButtons(flag) {
    $("#sendButton").prop('disabled', flag);
    $("#exitButton").prop('disabled', flag);
    $("#messageInput").prop('disabled', flag);
}


function sendMessage() {
    let message = $("#messageInput").val();
    if ($.trim(message) !== "") {
        connection.invoke("SendMessage", message, false, false)
            .catch(err => console.error(err));

        $("#messageInput").val("");
    }
}
