using System.ComponentModel.DataAnnotations;

namespace API.Core.ToDoListDomain.Model
{
    public class ToDoTask
    {
        public int ToDoListId { get; set; }
        public int Id { get; set; }
        [Required]
        public string Name { get; set; }
        public string Description {  get; set; }
        [Required]
        public bool IsCompleted { get; set; }
    }
}
