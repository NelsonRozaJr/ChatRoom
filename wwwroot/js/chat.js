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
            connection.invoke("SendPrivateMessage", userId, message)
                .catch(err => console.error(err));
        }

        $("#txtMessage").val("").focus();
    }
};

//Disable buttons until connection is established
changeDisableButtons(true);

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

connection.on("ReceiveMessage", (firstName, lastName, userName, message, isConnected, isDisconnected) => {
    let currentUserName = $("#userName").val();

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
