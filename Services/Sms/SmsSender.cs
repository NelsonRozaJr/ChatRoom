using ChatRoom.Services.Sms.Interfaces;
using System.Threading.Tasks;
using Twilio;
using Twilio.Rest.Api.V2010.Account;
using Twilio.Types;

namespace ChatRoom.Services.Sms
{
    public class SmsSender : ISmsSender
    {
        private readonly ISmsConfiguration _smsConfiguration;

        public SmsSender(ISmsConfiguration smsConfiguration)
        {
            _smsConfiguration = smsConfiguration;
        }

        public async Task SendSmsAsync(string numberTo, string message)
        {
            string accountSid = _smsConfiguration.SMSAccountIdentification;
            string authToken = _smsConfiguration.SMSAccountToken;
            string numberFrom = _smsConfiguration.SMSAccountFrom;

            TwilioClient.Init(accountSid, authToken);

            await MessageResource.CreateAsync(body: message,
                from: new PhoneNumber(numberFrom),
                to: new PhoneNumber(numberTo)
            );
        }
    }
}
