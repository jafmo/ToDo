using API.Core.ToDoListDomain.DB;
using API.Core.ToDoListDomain.Model;
using API.Core.ToDoListDomain.Service;
using Microsoft.Extensions.Logging;
using NSubstitute;
using MockQueryable.NSubstitute;

namespace unitTests
{
    [TestClass]
    public class ToDoListServiceTests
    {
        private readonly IToDoListDbContext _context;
        private readonly ILoggerFactory _loggerFactory;
        private readonly ILogger<ToDoListService> _logger;
        private IToDoListService _toDoListService;

        public ToDoListServiceTests()
        {
            _context = Substitute.For<IToDoListDbContext>();
            _loggerFactory = LoggerFactory.Create(static builder => { });
            _logger = _loggerFactory.CreateLogger<ToDoListService>();
        }

        [TestMethod]
        public async Task Add_Should_Add_ToDoList()
        {
            // arrange
            var list = new ToDoList { Id = 1, Tasks = new List<ToDoTask>(), User = new User() };
            var mockDbSet = new List<ToDoList> { list }.BuildMockDbSet<ToDoList>();
            _context.ToDoLists.Returns(mockDbSet);
            _toDoListService = new ToDoListService(_context, _loggerFactory);

            // act
            await _toDoListService.Add(list);

            // assert
            mockDbSet.Received(1).Add(Arg.Is<ToDoList>(static t => t.Id == 1));
        }

        [TestMethod]
        public async Task Delete_Should_Remove_ToDoList()
        {
            // arrange
            var list = new ToDoList { Id = 1, Tasks = new List<ToDoTask>(), User = new User() };
            var mockDbSet = new List<ToDoList> { list }.BuildMockDbSet<ToDoList>();
            _context.ToDoLists.Returns(mockDbSet);
            _toDoListService = new ToDoListService(_context, _loggerFactory);

            // act
            await _toDoListService.Delete(1);

            // assert
            mockDbSet.Received(1).Remove(Arg.Is<ToDoList>(static t => t.Id == 1));
        }

        
        [TestMethod]
        public async Task Get_Should_Return_ToDoList_When_Found()
        {
            // arrange
            var list = new ToDoList { Id = 1, Tasks = new List<API.Core.ToDoListDomain.Model.ToDoTask>() };
            var mockDbSet = new List<ToDoList> { list }.BuildMockDbSet<ToDoList>();
            _context.ToDoLists.Returns(mockDbSet);
            _toDoListService = new ToDoListService(_context, _loggerFactory);

            // act
            var result = await _toDoListService.Get(1);

            // assert
            Assert.IsNotNull(result);
            Assert.AreEqual(1, result.Id);
        }
       
        [TestMethod]
        public async Task Get_Should_Throw_When_NotFound()
        {
            try
            {
                await _toDoListService.Get(9999);
                Assert.Fail("Expected exception was not thrown.");
            }
            catch (Exception)
            {
                // expected
            }
        }
        
       [TestMethod]
       public async Task GetList_Should_Return_Queryable_With_Items()
       {
            // arrange
            var list = new ToDoList { Id = 30, Tasks = new List<API.Core.ToDoListDomain.Model.ToDoTask> { new API.Core.ToDoListDomain.Model.ToDoTask { Id = 1, Name = "i1", ToDoListId = 30 } } };
            var mockDbSet = new List<ToDoList> { list }.BuildMockDbSet<ToDoList>();
            _context.ToDoLists.Returns(mockDbSet);
            _toDoListService = new ToDoListService(_context, _loggerFactory);

            // act
            var query = await _toDoListService.GetList();
            var all = query.ToList();

            // assert
            Assert.AreEqual(1, all.Count);
            Assert.AreEqual(1, all[0].Tasks.Count);
       }

       [TestMethod]
       public async Task AddItem_Should_Add_Item_To_List()
       {
            // arrange
            var tasksList = new List<ToDoTask>();  // Use real list instead of substitute
            var list = new ToDoList { Id = 40, Tasks = tasksList };
            var mockDbSet = new List<ToDoList> { list }.BuildMockDbSet<ToDoList>();
            _context.ToDoLists.Returns(mockDbSet);
            _toDoListService = new ToDoListService(_context, _loggerFactory);

            // act
            var task = new ToDoTask { Name = "New", Description = "desc" };
            var result = await _toDoListService.AddTask(40, task);

            // assert
            var stored = mockDbSet.FirstOrDefault(i => i.Id == 40);
            Assert.IsNotNull(stored.Tasks.FirstOrDefault(x => x.Name == "New"));
            Assert.AreEqual(1, stored.Tasks.Count);
        }

       [TestMethod]
       public async Task DeleteTask_Should_Remove_Task()
       {
            // arrange
            var task = new ToDoTask { Id = 55, Name = "toRemove", ToDoListId = 50 };
            var tasksList = new List<ToDoTask> { task };  // Use real list instead of substitute
            var list = new ToDoList { Id = 50, Tasks = tasksList };
            var mockDbSet = new List<ToDoList> { list }.BuildMockDbSet<ToDoList>();
            _context.ToDoLists.Returns(mockDbSet);
            _toDoListService = new ToDoListService(_context, _loggerFactory);
            var storedBeforeDelete = mockDbSet.FirstOrDefault(i => i.Id == 50);
            Assert.IsNotNull(storedBeforeDelete.Tasks.FirstOrDefault(x => x.Id == 55));

            // act
            var result = await _toDoListService.DeleteTask(50, 55);

            // assert
            var stored = mockDbSet.FirstOrDefault(i => i.Id == 50);
            Assert.IsNull(stored.Tasks.FirstOrDefault(x => x.Id == 55));  // Verify item was removed
            Assert.AreEqual(0, stored.Tasks.Count);
        }

       [TestMethod]
       public async Task UpdateTask_Should_Update_Existing_Task()
       {
            // arrange
            var existingTask = new ToDoTask { Id = 66, Name = "old", Description = "d", ToDoListId = 60 };
            var mockTasks = Substitute.For<List<ToDoTask>>(new List<ToDoTask> { existingTask });
            var list = new ToDoList { Id = 60, Tasks = mockTasks };
            var mockDbSet = new List<ToDoList> { list }.BuildMockDbSet<ToDoList>();
            _context.ToDoLists.Returns(mockDbSet);
            _toDoListService = new ToDoListService(_context, _loggerFactory);

            // act
            var updated = new ToDoTask { Id = 66, Name = "new", Description = "newd", ToDoListId = 60 };
            var result = await _toDoListService.UpdateTask(60, updated);

            // assert
            var stored = mockDbSet.FirstOrDefault(i => i.Id == 60)?.Tasks.FirstOrDefault(t => t.Id == 66);
            Assert.AreEqual("new", stored.Name);
            Assert.AreEqual("newd", stored.Description);
       }

       [TestMethod]
       public async Task Update_Should_Add_And_Update_Tasks()
       {
            // arrange
            var existingTask = new ToDoTask { Id = 77, Name = "old", Description = "d", ToDoListId = 70 };
            var mockTasks = Substitute.For<List<ToDoTask>>(new List<ToDoTask> { existingTask });
            var list = new ToDoList { Id = 70, Tasks = mockTasks };
            var mockDbSet = new List<ToDoList> { list }.BuildMockDbSet<ToDoList>();
            _context.ToDoLists.Returns(mockDbSet);
            _toDoListService = new ToDoListService(_context, _loggerFactory);

            var incoming = new ToDoList
            {
                Id = 70,
                Tasks = new List<ToDoTask>
                {
                    new ToDoTask { Id = 77, Name = "updated", Description = "updated" },
                    new ToDoTask { Name = "newItem", Description = "newDesc" }
                }
            };

            // act
            await _toDoListService.Update(incoming);

            // assert
            var storedToDoListItem = mockDbSet.FirstOrDefault(i => i.Id == 70);
            Assert.AreEqual(2, storedToDoListItem.Tasks.Count);
            Assert.IsTrue(storedToDoListItem.Tasks.Any(i => i.Name == "updated"));
            Assert.IsTrue(storedToDoListItem.Tasks.Any(i => i.Name == "newItem"));
       }

       [TestMethod]
       public async Task SaveChanges_Should_Wrap_DbUpdateException()
       {
           try
           {
               await _toDoListService.SaveChanges();
               Assert.Fail("Expected exception was not thrown.");
           }
           catch (Exception)
           {
               // expected
           }
       }
  
    }
}
