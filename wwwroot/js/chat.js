"use strict";

var connection = new signalR.HubConnectionBuilder()
    .withUrl("/hub")
    .build();

//Disable send button until connection is established
$("#sendButton").prop('disabled', true);

connection.on("ReceiveMessage", function (fullName, userName, message) {
    var divMessages = document.getElementById("messagesList");

    var divMessage = document.createElement("div");
    divMessage.className = "col-12 mb-2 bg-light text-dark";

    var messageStyle = "message-author-red";
    if (currentUserName === userName) {
        divMessage.className += " text-right";
        messageStyle = "message-author-blue";
    }
    
    message = message.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

    divMessage.innerHTML = '<div class="dateStyle">' + new Date().toLocaleString() + '</div>' +
        '<div class="' + messageStyle + '">' + fullName + '</div>' +
        '<div class="message">' + message + '</div>';

    divMessages.appendChild(divMessage);
    divMessages.scrollTop = divMessages.scrollHeight;
});

connection.start().then(function () {
    $("#sendButton").prop('disabled', false);
}).catch(function (err) {
    return console.error(err.toString());
});

document.getElementById("sendButton").addEventListener("click", function (event) {
    var message = $("#messageInput").val();
    if ($.trim(message) !== "") {
        connection.invoke("SendMessage", message).catch(function (err) {
            return console.error(err.toString());
        });

        $("#messageInput").val("");
    }
    
    event.preventDefault();
});
