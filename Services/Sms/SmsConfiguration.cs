using ChatRoom.Services.Sms.Interfaces;

namespace ChatRoom.Services.Sms
{
    public class SmsConfiguration : ISmsConfiguration
    {
        public string SMSAccountIdentification { get; set; }

        public string SMSAccountToken { get; set; }

        public string SMSAccountFrom { get; set; }
    }
}
