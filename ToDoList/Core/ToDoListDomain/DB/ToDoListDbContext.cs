using API.Core.ToDoListDomain.Model;
using Microsoft.EntityFrameworkCore;

namespace API.Core.ToDoListDomain.DB
{

    public class ToDoListDbContext: DbContext, IToDoListDbContext
    {
        public DbSet<User> Users { get; set; }
        public DbSet<ToDoTask> Tasks { get; set; }
        public DbSet<ToDoList> ToDoLists { get; set; }

        public ToDoListDbContext(DbContextOptions<ToDoListDbContext> options)
           : base(options)
        {
        }

        public System.Threading.Tasks.Task SaveChangesAsync()
        {
            return base.SaveChangesAsync();
        }

    }
}
