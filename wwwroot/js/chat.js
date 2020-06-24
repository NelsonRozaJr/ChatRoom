const connection = new signalR.HubConnectionBuilder()
    .withUrl("/hub")
    .build();

//Disable buttons until connection is established
$("#sendButton").prop('disabled', true);
$("#exitButton").prop('disabled', true);
$("#messageInput").prop('disabled', true);

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
        divMessage.innerHTML += '<div class="message-author">' + fullName + '<span class="show-to"> is connected.</span></div>';
    }
    else if (isDisconnected) {
        divMessage.innerHTML += '<div class="message-author">' + fullName + '<span class="show-to"> is disconnected.</span></div>';
    }
    else {
        divMessage.innerHTML += '<div class="message-author">' + fullName + '<span class="show-to"> says to all:</span></div>' +
            '<div class="message">' + message + '</div>';
    }

    let divMessages = document.getElementById("messagesList");
    divMessages.appendChild(divMessage);
    divMessages.scrollTop = divMessages.scrollHeight;
});

connection.start()
    .then(() => {
        $("#sendButton").prop('disabled', false);
        $("#exitButton").prop('disabled', false);
        $("#messageInput").prop('disabled', false);
    })
    .catch(err => console.error(err.toString()));

$("#sendButton").click(event => {
    let message = $("#messageInput").val();
    if ($.trim(message) !== "") {
        connection.invoke("SendMessage", message, false, false)
            .catch(err => console.error(err));

        $("#messageInput").val("");
    }
    
    event.preventDefault();
});

$("#exitButton").click(function (event) {
    connection.stop()
        .catch(err => console.error(err));

    $("#sendButton").prop('disabled', true);
    $("#exitButton").prop('disabled', true);

    $("#messageInput").val("");
    $("#messageInput").prop('disabled', true);

    event.preventDefault();
});
