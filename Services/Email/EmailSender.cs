using ChatRoom.Services.Email.Interfaces;
using MailKit.Net.Smtp;
using MimeKit;
using MimeKit.Text;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ChatRoom.Services.Email
{
	public class EmailSender : IEmailSender
    {
        private readonly IEmailConfiguration _emailConfiguration;

		public EmailSender(IEmailConfiguration emailConfiguration)
        {
            _emailConfiguration = emailConfiguration;
        }

        public async Task SendEmailAsync(string nameTo, string emailTo, string subject, string content)
        {
			var message = new MimeMessage();

			message.From.AddRange(new List<MailboxAddress>() 
			{ 
				new MailboxAddress(name: _emailConfiguration.NameFrom, address: _emailConfiguration.EmailFrom) 
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
				emailClient.Connect(_emailConfiguration.SmtpServer, _emailConfiguration.SmtpPort, true);
				emailClient.AuthenticationMechanisms.Remove("XOAUTH2");
				emailClient.Authenticate(_emailConfiguration.SmtpUsername, _emailConfiguration.SmtpPassword);

				await emailClient.SendAsync(message);

				emailClient.Disconnect(true);
			}
		}
    }
}
