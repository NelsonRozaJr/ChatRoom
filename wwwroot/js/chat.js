const connection = new signalR.HubConnectionBuilder()
    .withUrl("/hub")
    .build();

var changeDisableButtons = function (flag) {
    $("#btnSendMessage").prop('disabled', flag);
    $("#btnExit").prop('disabled', flag);
    $("#txtMessage").prop('disabled', flag);
    $("#selUsers").prop('disabled', flag);
};

var connectionStart = function () {
    connection.start()
        .then(() => {
            changeDisableButtons(false);
            $("#btnStart").hide();
            $("#txtMessage").focus();
        })
        .catch(err => console.error(err.toString()));
};

var connectionStop = function () {
    connection.stop()
        .catch(err => console.error(err));
};

var sendMessage = function () {
    let message = $("#txtMessage").val();
    let userId = $("#selUsers").val();

    if ($.trim(userId) !== "" && $.trim(message) !== "") {
        if (userId === "all") {
            connection.invoke("SendMessage", message, false, false)
                .catch(err => console.error(err));
        }
        else {
            connection.invoke("SendPrivateMessage", userId, $("#selUsers option:selected").html(), message)
                .catch(err => console.error(err));
        }

        $("#txtMessage").val("").focus();
    }
};

//Disable buttons until connection is established
changeDisableButtons(true);

connection.on("CountUsers", countUsers => {
    let messageCount = countUsers === 1 ? `There is ${countUsers} user connected` : `There are ${countUsers} users connected`;
    $("#countUsers").html(messageCount);
});

connection.on("ConnectedUsers", connectedUsers => {
    let currentUserName = $("#userName").val();
    let currentUserSelected = $("#selUsers").val() === null ? "all" : $("#selUsers").val();
    let options = '<option value="all">All</option>';

    $.each(connectedUsers, (index, user) => {
        let isCurrentUser = user.userName === currentUserName;
        if (!isCurrentUser) {
            options += '<option value="' + user.userId + '">' + user.fullName + '</option>';
        }
    });

    $("#selUsers").empty().append(options).val(currentUserSelected);
});

connection.on("ReceiveMessage", (senderFullName, senderUserName, receiverFullName, message, isConnected, isDisconnected) => {
    let currentUserName = $("#userName").val();

    message = message.replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

    let divMessage = document.createElement("div");
    divMessage.className = "col-12 mb-2";
    divMessage.className += currentUserName === senderUserName ? " text-right" : " text-left";

    let localDate = new Date().toLocaleString();
    divMessage.innerHTML = '<div class="show-date">' + localDate + '</div>';

    if (isConnected) {
        divMessage.className += " bg-connected";
        divMessage.innerHTML += '<div class="message-author">' + senderFullName + '<span class="is-connected"> is connected.</span></div>';
    }
    else if (isDisconnected) {
        divMessage.className += " bg-disconnected";
        divMessage.innerHTML += '<div class="message-author">' + senderFullName + '<span class="is-disconnected"> is disconnected.</span></div>';
    }
    else {
        let fontColorMessage = currentUserName === senderUserName ? " self-message" : (receiverFullName === "all" ? " all-message" : " p-message");
        let backgroundMessage = receiverFullName === "all" ? " bg-message" : " bg-p-message";
        let saysTo = receiverFullName === "all" ? "says to" : "privately says to";

        divMessage.className += currentUserName === senderUserName ? " bg-light" : backgroundMessage;

        divMessage.innerHTML += '<div class="message-author">' + senderFullName +
            '<span class="says-to"> ' + saysTo + ' </span>' + receiverFullName + ':</div>' +
            '<div class="' + fontColorMessage +'">' + message + '</div>';
    }

    let divMessages = document.getElementById("messagesList");

    divMessages.appendChild(divMessage);
    divMessages.scrollTop = divMessages.scrollHeight;
});

connectionStart();

$("#btnSendMessage").click(event => {
    sendMessage();
    event.preventDefault();
});

$("#btnExit").click(function (event) {
    connectionStop();

    changeDisableButtons(true);

    $("#txtMessage").val("");
    $("#btnStart").show();
    $("#btnExit").hide();
    $("#selUsers").val("");
    $("#countUsers").html("");

    event.preventDefault();
});

$("#btnStart").click(event => {
    connectionStart();
    $("#btnExit").show();
    event.preventDefault();
});

$("#txtMessage").keypress(event => {
    if (event.which === 13 && !event.shiftKey) {
        sendMessage();
        event.preventDefault();
    }
});
