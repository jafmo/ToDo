using API.Core.ToDoListDomain.Model;
using API.Core.ToDoListDomain.Service;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;


namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ToDoListController : ControllerBase
    {
        private readonly ILogger<ToDoListController> _logger;
        private readonly IToDoListService _toDoListService;

        public ToDoListController(ILogger<ToDoListController> logger, IToDoListService toDoListService)
        {
            _logger = logger;
            _toDoListService = toDoListService;
        }

        // GET: api/<ToDoListController>
        [HttpGet]
        public async Task<List<ToDoList>> Get()
        {
            var list = await _toDoListService.GetList();
            return list.ToList();
        }

        // GET api/<ToDoListController>/5
        [HttpGet("{id}")]
        public async Task<ToDoList> Get(int id)
        {
            return await _toDoListService.Get(id);
        }

        // POST api/<ToDoListController>
        [HttpPost]
        public async System.Threading.Tasks.Task Post([FromBody] ToDoList toDoList)
        {
            await _toDoListService.Add(toDoList);
        }

        // POST task
        [HttpPost]
        [Route("addTask")]
        public async Task<ToDoList> AddTask(int id, [FromBody] ToDoTask task)
        {
            return await _toDoListService.AddTask(id, task);
        }

        // PUT api/<ToDoListController>/5
        [HttpPut]
        public async System.Threading.Tasks.Task Put([FromBody] ToDoList toDoList)
        {
            await _toDoListService.Update(toDoList);
        }

        // PUT task
        [HttpPut("{id}")]
        [Route("updateTask")]
        public async Task Put(int id, [FromBody] ToDoTask task)
        {
            await _toDoListService.UpdateTask(id, task);
        }

        // DELETE api/<ToDoListController>/5
        [HttpDelete("{id}")]
        public async Task Delete(int id)
        {
            await _toDoListService.Delete(id);
        }

        // DELETE task
        [HttpDelete()]
        [Route("deleteTask")]
        public async Task Delete(int id, int taskId)
        {
            await _toDoListService.DeleteTask(id, taskId);
        }
    }
}
