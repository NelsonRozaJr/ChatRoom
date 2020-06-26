using ChatRoom.Data.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;

namespace ChatRoom.Hubs
{
    public class ChatHub : Hub
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private static List<ConnectedUser> connectedUsers = new List<ConnectedUser>();

        public ChatHub(UserManager<AppUser> userManager, IHttpContextAccessor httpContextAccessor)
        {
            _userManager = userManager;
            _httpContextAccessor = httpContextAccessor;
        }

        public async Task<AppUser> SendMessage(string message, bool isConnected, bool isDisconnected)
        {
            var senderUser = await _userManager.GetUserAsync(_httpContextAccessor.HttpContext.User);
            if (senderUser != null)
            {
                await Clients.All.SendAsync("ReceiveMessage", $"{senderUser.FirstName} {senderUser.LastName}", 
                    senderUser.UserName, "all", message, isConnected, isDisconnected);
            }

            return senderUser;
        }

        public async Task SendPrivateMessage(string receiverUserId, string receiverFullName, string message)
        {
            var senderUser = await _userManager.GetUserAsync(_httpContextAccessor.HttpContext.User);
            if (senderUser != null)
            {
                await Clients.Users(senderUser.Id, receiverUserId).SendAsync("ReceiveMessage", $"{senderUser.FirstName} {senderUser.LastName}",
                    senderUser.UserName, receiverFullName, message, false, false);
            }
        }

        public override async Task OnConnectedAsync()
        {
            var user = await SendMessage(string.Empty, true, false);

            connectedUsers.Add(new ConnectedUser { UserId = user.Id, UserName = user.UserName, FullName = $"{user.FirstName} {user.LastName}" });
            await Clients.All.SendAsync("ConnectedUsers", connectedUsers.OrderBy(u => u.FullName));

            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            var user = await SendMessage(string.Empty, false, true);

            connectedUsers.RemoveAll(u => u.UserId == user.Id);
            await Clients.All.SendAsync("ConnectedUsers", connectedUsers.OrderBy(u => u.FullName));

            await base.OnDisconnectedAsync(exception);
        }
    }

    public class ConnectedUser
    {
        public string UserId { get; set; }

        public string UserName { get; set; }

        public string FullName { get; set; }
    }
}
