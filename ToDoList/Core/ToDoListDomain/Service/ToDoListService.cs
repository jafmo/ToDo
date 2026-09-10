using API.Core.ToDoListDomain.DB;
using API.Core.ToDoListDomain.Model;
using Microsoft.EntityFrameworkCore;


namespace API.Core.ToDoListDomain.Service
{
    public class ToDoListService : IToDoListService
    {
        private readonly IToDoListDbContext _context;
        private readonly ILoggerFactory _loggerFactory;
        private readonly ILogger<ToDoListService> _logger;

        public ToDoListService(IToDoListDbContext context, ILoggerFactory loggerFactory)
        {
            _context = context;
            _loggerFactory = loggerFactory;
            _logger = _loggerFactory.CreateLogger<ToDoListService>();
        }

        public async Task SaveChanges()
        {
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException ex)
            {
                _logger.LogError(ex, "An error occurred while saving changes to the database.");
                throw new Exception("An error occurred while saving changes to the database.", ex);
            }   
        }

        public async Task<ToDoList> Get(int id)
        {
            var toDoListItem = await _context.ToDoLists.Include(t => t.Tasks).Include(t => t.User).FirstOrDefaultAsync(x => x.Id == id);

            if (toDoListItem == null)
            {
                _logger.LogError("ToDoList not found with ID: {Id}", id);
                throw new Exception($"ToDoList not found with ID: {id}");
            }

            return toDoListItem;
        }

        public Task Add(ToDoList toDoList)
        {
            _context.ToDoLists.Add(toDoList);
            return Task.CompletedTask;
        }

        public async Task Delete(int id)
        {
            var toDoListItem = await Get(id);
            _context.ToDoLists.Remove(toDoListItem);
            await SaveChanges();
        }

        public async Task<IQueryable<ToDoList>> GetList()
        {
            IQueryable<ToDoList> query = _context.ToDoLists.Include(static t => t.Tasks).Include(static t => t.User);
            return query;
        }

        public async Task Update(ToDoList toDoList)
        {
            var toDoListItem = await Get(toDoList.Id);
            // Update the properties of toDoListItem with the values from toDoList
            foreach (var toDoTask in toDoList.Tasks)
            {
                var existingItem = toDoListItem.Tasks.FirstOrDefault(x => x.Id == toDoTask.Id);
                if (existingItem != null)
                {
                    existingItem.Name = toDoTask.Name;
                    existingItem.Description = toDoTask.Description;
                }
                else
                {
                    toDoListItem.Tasks.Add(toDoTask);
                }
            }
            
            await SaveChanges();
        }

        public async Task<ToDoList> AddTask(int toDoListId, ToDoTask task)
        {
            var toDoListItem = await Get(toDoListId);
            toDoListItem.Tasks.Add(task);
            await SaveChanges();

            return toDoListItem;
        }

        public async Task<ToDoList> DeleteTask(int toDoListId, int taskId)
        {
            var toDoListItem = await Get(toDoListId);
            toDoListItem.Tasks.RemoveAll(x => x.Id == taskId);
            await SaveChanges();

            return toDoListItem;
        }

        public async Task<ToDoList> UpdateTask(int toDoListId,  ToDoTask task)
        {
            var toDoListItem = await Get(toDoListId);
            var existingItem = toDoListItem.Tasks.FirstOrDefault(x => x.Id == task.Id);

            if (existingItem == null)
            {
                _logger.LogError("Task not found in ToDoList {ToDoListId}: {task}", toDoListId , task);
                throw new Exception($"Task not found in ToDoList {toDoListId}: TaskId={task.Id}, Name={task.Name}");
            }

            // Update the existing task
            existingItem.Name = task.Name;
            existingItem.Description = task.Description;
            await SaveChanges();

            return toDoListItem;
        }

    }
}
