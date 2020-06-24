using ChatRoom.Data.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using System;

namespace ChatRoom.Hubs
{
    public class ChatHub : Hub
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public ChatHub(UserManager<AppUser> userManager, IHttpContextAccessor httpContextAccessor)
        {
            _userManager = userManager;
            _httpContextAccessor = httpContextAccessor;
        }

        public async Task SendMessage(string message, bool isConnected, bool isDisconnected)
        {
            var senderUser = await _userManager.GetUserAsync(_httpContextAccessor.HttpContext.User);
            await Clients.All.SendAsync("ReceiveMessage", senderUser.FirstName, senderUser.LastName, senderUser.UserName, message, isConnected, isDisconnected);
        }

        public override async Task OnConnectedAsync()
        {
            await SendMessage(string.Empty, true, false);
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            await SendMessage(string.Empty, false, true);
        }
    }
}
