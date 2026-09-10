using API.Core.ToDoListDomain.Model;
using API.Core.ToDoListDomain.Service;

namespace API
{
    public class DataSeeder
    {
        private readonly IToDoListService _toDoListService;

        public DataSeeder(IToDoListService toDoListService)
        {
            _toDoListService = toDoListService;
        }

        public async System.Threading.Tasks.Task SeedData()
        {
            var existingLists = await _toDoListService.GetList();
            if (!existingLists.Any())
            {
                var user = new User { Id = 1, Name = "Sample User" };
                var toDoList1 = new ToDoList
                {
                    Id = 1,
                    User = user,
                    Tasks = new List<Core.ToDoListDomain.Model.ToDoTask>
                    {
                        new Core.ToDoListDomain.Model.ToDoTask { ToDoListId = 1, Id = 1, Name = "Sample Task 1", Description = "Sample Task 1", IsCompleted = false },
                        new Core.ToDoListDomain.Model.ToDoTask { ToDoListId = 1, Id = 2, Name = "Sample Task 2", Description = "Sample Task 2", IsCompleted = false },
                        new Core.ToDoListDomain.Model.ToDoTask { ToDoListId = 1, Id = 3, Name = "Sample Task 3", Description = "Sample Task 3", IsCompleted = false },
                        new Core.ToDoListDomain.Model.ToDoTask { ToDoListId = 1, Id = 4, Name = "Sample Task 4", Description = "Sample Task 4", IsCompleted = false },
                        new Core.ToDoListDomain.Model.ToDoTask { ToDoListId = 1, Id = 5, Name = "Sample Task 5", Description = "Sample Task 5", IsCompleted = true }
                    }
                };
                var user2 = new User { Id = 2, Name = "Sample User 2" };
                var toDoList2 = new ToDoList
                {
                    Id = 2,
                    User = user2,
                    Tasks = new List<Core.ToDoListDomain.Model.ToDoTask>
                    {
                        new Core.ToDoListDomain.Model.ToDoTask { ToDoListId = 2, Id = 8, Name = "Sample Task 8", Description = "Sample Task 8", IsCompleted = false },
                        new Core.ToDoListDomain.Model.ToDoTask { ToDoListId = 2, Id = 9, Name = "Sample Task 9", Description = "Sample Task 9", IsCompleted = false },
                        new Core.ToDoListDomain.Model.ToDoTask { ToDoListId = 2, Id = 10, Name = "Sample Task 10", Description = "Sample Task 10", IsCompleted = false },
                        new Core.ToDoListDomain.Model.ToDoTask { ToDoListId = 2, Id = 11, Name = "Sample Task 11", Description = "Sample Task 11", IsCompleted = false },
                        new Core.ToDoListDomain.Model.ToDoTask { ToDoListId = 2, Id = 12, Name = "Sample Task 12", Description = "Sample Task 12", IsCompleted = true }
                    }
                };
                await _toDoListService.Add(toDoList1);
                await _toDoListService.Add(toDoList2);
                await _toDoListService.SaveChanges();
            }
        }
    }
}
