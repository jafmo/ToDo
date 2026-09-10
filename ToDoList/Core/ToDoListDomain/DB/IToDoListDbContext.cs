using API.Core.ToDoListDomain.Model;
using Microsoft.EntityFrameworkCore;

namespace API.Core.ToDoListDomain.DB
{
    public interface IToDoListDbContext
    {
        DbSet<User> Users { get; set; }
        DbSet<Model.ToDoTask> Tasks { get; set; }
        DbSet<Model.ToDoList> ToDoLists { get; set; }
        System.Threading.Tasks.Task SaveChangesAsync();
    }
}
