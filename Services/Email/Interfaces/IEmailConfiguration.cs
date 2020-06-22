namespace ChatRoom.Services.Email.Interfaces
{
    public interface IEmailConfiguration
    {
        string SmtpServer { get; }

        int SmtpPort { get; }

        string SmtpUsername { get; set; }

        string SmtpPassword { get; set; }

        string NameFrom { get; set; }

        string EmailFrom { get; set; }
    }
}
