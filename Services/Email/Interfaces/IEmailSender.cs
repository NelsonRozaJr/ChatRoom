using System.Threading.Tasks;

namespace ChatRoom.Services.Email.Interfaces
{
    public interface IEmailSender
    {
        Task SendEmailAsync(string nameTo, string emailTo, string subject, string content);
    }
}
