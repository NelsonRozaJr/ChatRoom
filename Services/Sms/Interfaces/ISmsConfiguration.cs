namespace ChatRoom.Services.Sms.Interfaces
{
    public interface ISmsConfiguration
    {
        string SMSAccountIdentification { get; set; }

        string SMSAccountToken { get; set; }

        string SMSAccountFrom { get; set; }
    }
}
