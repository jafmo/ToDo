import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToDoListService } from './services/to-do-list.service';
import { ToDoList, Task } from './Model/to-do.models';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'to-do-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './to-do-list.component.html', 
  styleUrls: ['./to-do-list.component.css']   
})
export class ToDoListComponent implements OnInit {
  private toDoListService = inject(ToDoListService);

  // Initialize state 
  toDoListItems = signal<ToDoList[]>([]);
  loading = signal<boolean>(true);
  newTask = signal<Task>({ toDoListId: 0, id:0, name: '', description:'', completed: false });
  toDoListForm: FormGroup;
  submitted = signal<boolean>(false);

  constructor(private formBuilder: FormBuilder) {
    this.toDoListForm = this.CreateAddEditForm();
  }
  
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
    const newTask: Task = { toDoListId: toDoListItem.id, id: 0, name: '', description: '', completed: false };
    this.newTask.set(newTask);
    // initialize the reactive form with the new task's values
    this.toDoListForm.reset({ id: newTask.id, name: newTask.name, description: newTask.description, completed: newTask.completed });
    this.submitted.set(false);
  }

  onCancel() {
    this.newTask.set({ toDoListId: 0, id:0, name: '', description:'', completed: false });
    this.toDoListForm.reset();
    this.submitted.set(false);
  }

  onSave(toDoListItem: ToDoList) {

    this.submitted.set(true);
    if (this.toDoListForm.invalid) {
      return;
    }

    const formValue = this.toDoListForm.value;
    const taskToAdd: Partial<Task> = {
      id: formValue.id,
      toDoListId: toDoListItem.id,
      name: formValue.name,
      description: formValue.description,
      completed: formValue.completed
    };

    this.toDoListService.AddTask(toDoListItem, taskToAdd).subscribe({
      next: () => {
        this.loadItemsList();
        this.toDoListForm.reset();
        this.newTask.set({ toDoListId: 0, id:0, name: '', description:'', completed: false });
        this.submitted.set(false);
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
        this.toDoListForm.reset();
      },
      error: (err) => {
        console.error('Delete task failed', err);
      }
    });
  }

  private CreateAddEditForm() {
    return  this.formBuilder.group({
                id: [0],
                name: ['', [Validators.required, Validators.maxLength(100)]],
                description:[''],
                completed: [false, [Validators.required]]
            });
  }


}
