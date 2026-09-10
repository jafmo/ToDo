using API.Core.Common;
using API.Core.ToDoListDomain.Model;

namespace API.Core.ToDoListDomain.Service
{
    public interface IToDoListService : IBaseService<ToDoList>
    {
        Task<ToDoList> AddTask(int toDoListId, ToDoTask task);
        Task<ToDoList> DeleteTask(int toDoListId, int taskId);
        Task<ToDoList> UpdateTask(int toDoListId, ToDoTask task);
        Task SaveChanges();
    }
}
