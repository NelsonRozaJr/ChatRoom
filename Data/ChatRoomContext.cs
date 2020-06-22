using System;
using System.Collections.Generic;
using System.Text;
using ChatRoom.Data.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace ChatRoom.Data
{
    public class ChatRoomContext : IdentityDbContext<AppUser>
    {
        public ChatRoomContext(DbContextOptions<ChatRoomContext> options)
            : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
        }
    }
}
