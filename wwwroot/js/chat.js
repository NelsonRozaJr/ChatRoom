const connection = new signalR.HubConnectionBuilder()
    .withUrl("/hub")
    .build();

//Disable buttons until connection is established
$("#sendButton").prop('disabled', true);
$("#exitButton").prop('disabled', true);
$("#messageInput").prop('disabled', true);

connection.on("ReceiveMessage", (firstName, lastName, userName, message, isAutomaticMessage) => {
    message = message.replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

    let divMessage = document.createElement("div");
    divMessage.className = "col-12 mb-2 bg-light";

    let messageStyle = "";
    if (currentUserName === userName) {
        divMessage.className += " text-right";
        messageStyle = "message-author-blue";
    }
    else {
        divMessage.className += " text-left";
        messageStyle = "message-author-red";
    }

    let localDate = new Date().toLocaleString();
    let fullName = `${firstName} ${lastName}`;

    divMessage.innerHTML = '<div class="show-date">' + localDate + '</div>';

    if (isAutomaticMessage) {
        if (currentUserName === userName) {
            message = `You are ${message}!`;
        }
        else {
            message = `${fullName} is ${message}!`
        }

        divMessage.innerHTML += '<div class="' + messageStyle + '">' + message + '</div>';
    }
    else {
        divMessage.innerHTML += '<div class="' + messageStyle + '">' + fullName + '<span class="show-to"> says to all:</span></div>' +
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
        connection.invoke("SendMessage", message, false)
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
