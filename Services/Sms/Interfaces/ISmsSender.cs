using System.Threading.Tasks;

namespace ChatRoom.Services.Sms.Interfaces
{
    public interface ISmsSender
    {
        Task SendSmsAsync(string numberTo, string message);
    }
}
