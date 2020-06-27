namespace ChatRoom.Services.OptionModels
{
    public class SmsOptions
    {
        public const string SmsConfig = "TwilioConfiguration";

        public string SMSAccountIdentification { get; set; }

        public string SMSAccountToken { get; set; }

        public string SMSAccountFrom { get; set; }
    }
}
