namespace ChatRoom.Services.OptionModels
{
    public class EmailOptions
    {
        public const string EmailConfig = "EmailConfiguration";

        public string SmtpServer { get; set; }

        public int SmtpPort { get; set; }

        public string SmtpUsername { get; set; }

        public string SmtpPassword { get; set; }

        public string NameFrom { get; set; }

        public string EmailFrom { get; set; }
    }
}
