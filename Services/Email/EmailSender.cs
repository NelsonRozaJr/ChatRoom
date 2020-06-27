using ChatRoom.Services.Email.Interfaces;
using ChatRoom.Services.OptionModels;
using MailKit.Net.Smtp;
using Microsoft.Extensions.Options;
using MimeKit;
using MimeKit.Text;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ChatRoom.Services.Email
{
	public class EmailSender : IEmailSender
    {
        private readonly EmailOptions _emailOptions;

		public EmailSender(IOptions<EmailOptions> emailOptions)
        {
			_emailOptions = emailOptions.Value;
        }

        public async Task SendEmailAsync(string nameTo, string emailTo, string subject, string content)
        {
			var message = new MimeMessage();

			message.From.AddRange(new List<MailboxAddress>() 
			{ 
				new MailboxAddress(name: _emailOptions.NameFrom, address: _emailOptions.EmailFrom) 
			});

			message.To.AddRange(new List<MailboxAddress>() 
			{ 
				new MailboxAddress(name: nameTo, address: emailTo) 
			});

			message.Importance = MessageImportance.High;
			message.Subject = subject;
			message.Body = new TextPart(TextFormat.Html)
			{
				Text = content
			};

			using (var emailClient = new SmtpClient())
			{
				emailClient.Connect(_emailOptions.SmtpServer, _emailOptions.SmtpPort, true);
				emailClient.AuthenticationMechanisms.Remove("XOAUTH2");
				emailClient.Authenticate(_emailOptions.SmtpUsername, _emailOptions.SmtpPassword);

				await emailClient.SendAsync(message);

				emailClient.Disconnect(true);
			}
		}
    }
}
