namespace API.Core.ToDoListDomain.Model
{
    public class ToDoList
    {
        public int Id { get; set; }
        public User User {  get; set; }
        public List<ToDoTask> Tasks { get; set; }

        public ToDoList()
        {
            Tasks = new List<ToDoTask>();
        }
    }
}
