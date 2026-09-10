import { Component, OnInit, signal, inject} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToDoListService } from './services/to-do-list.service';
import { ToDoList, Task } from './Model/to-do.models';
import { UserComponent } from './components/user/user.component';
import { TaskComponent } from './components/task/task.component';
import { AddEditTaskComponent } from './components/task/add-edit-task.component';

@Component({
  selector: 'to-do-list',
  imports: [CommonModule, UserComponent, TaskComponent, AddEditTaskComponent],
  templateUrl: './to-do-list.component.html', 
  styleUrls: ['./to-do-list.component.css']
})
export class ToDoListComponent implements OnInit {
  private toDoListService = inject(ToDoListService);

  // Initialize state 
  toDoListItems = signal<ToDoList[]>([]);
  loading = signal<boolean>(true);
  newTask = signal<Task>({ toDoListId: 0, id:0, name: '', description:'', isCompleted: false });
  
  ngOnInit(): void {
    this.loadItemsList();
  }

  loadItemsList() {
     this.toDoListService.getToDoListItems().subscribe({
      next: (data) => {
        this.toDoListItems.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('API Error details:', err);
        this.loading.set(false);
      }
    });
  }

  onAdd(toDoListItem: ToDoList) {
    const newTask: Task = { toDoListId: toDoListItem.id, id: 0, name: '', description: '', isCompleted: false };
    this.newTask.set(newTask);
  }

  onCancel() {
    this.newTask.set({ toDoListId: 0, id:0, name: '', description:'', isCompleted: false });
  }

  onSave(task: Task) {

    this.toDoListService.AddTask(task.toDoListId, task).subscribe({
      next: () => {
        this.loadItemsList();
        this.newTask.set({ toDoListId: 0, id:0, name: '', description:'', isCompleted: false });
      },
      error: (err) => {
        console.error('Add task failed', err);
      }
    });

  }

  onEdit(task: Task) {}

  onDelete(task: Task) {
    this.toDoListService.DeleteTask(task.toDoListId, task.id).subscribe({
      next: () => {
        this.loadItemsList();
      },
      error: (err) => {
        console.error('Delete task failed', err);
      }
    });
  }

}
