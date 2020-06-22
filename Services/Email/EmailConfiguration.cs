using ChatRoom.Services.Email.Interfaces;

namespace ChatRoom.Services.Email
{
    public class EmailConfiguration : IEmailConfiguration
    {
        public string SmtpServer { get; set; }

        public int SmtpPort { get; set; }

        public string SmtpUsername { get; set; }

        public string SmtpPassword { get; set; }

        public string NameFrom { get; set; }

        public string EmailFrom { get; set; }
    }
}
