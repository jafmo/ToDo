
export interface User {
  id: number;
  name: string;
}
export interface Task {
  toDoListId: number;
  id: number;
  name: string;
  description: string;
  completed: boolean;
}
export interface ToDoList {
  id: number;
  user: User;
  tasks: Task[];
}



