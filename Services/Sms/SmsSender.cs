using ChatRoom.Services.OptionModels;
using ChatRoom.Services.Sms.Interfaces;
using Microsoft.Extensions.Options;
using System.Threading.Tasks;
using Twilio;
using Twilio.Rest.Api.V2010.Account;
using Twilio.Types;

namespace ChatRoom.Services.Sms
{
    public class SmsSender : ISmsSender
    {
        private readonly SmsOptions _smsOptions;

        public SmsSender(IOptions<SmsOptions> smsOptions)
        {
            _smsOptions = smsOptions.Value;
        }

        public async Task SendSmsAsync(string numberTo, string message)
        {
            string accountSid = _smsOptions.SMSAccountIdentification;
            string authToken = _smsOptions.SMSAccountToken;
            string numberFrom = _smsOptions.SMSAccountFrom;

            TwilioClient.Init(accountSid, authToken);

            await MessageResource.CreateAsync(body: message,
                from: new PhoneNumber(numberFrom),
                to: new PhoneNumber(numberTo)
            );
        }
    }
}
