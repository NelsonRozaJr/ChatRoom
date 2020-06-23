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

        public async Task SendMessage(string message, bool isAutomaticMessage)
        {
            var senderUser = await _userManager.GetUserAsync(_httpContextAccessor.HttpContext.User);
            await Clients.All.SendAsync("ReceiveMessage", senderUser.FirstName, senderUser.LastName, senderUser.UserName, message, isAutomaticMessage);
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            await SendMessage("disconnected", true);
        }

        public override async Task OnConnectedAsync()
        {
            await SendMessage("connected", true);
        }
    }
}
