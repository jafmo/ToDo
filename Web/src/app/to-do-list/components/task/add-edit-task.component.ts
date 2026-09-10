import { Component, input , output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Task } from '../../Model/to-do.models';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'add-edit-task',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './add-edit-task.component.html', 
  styleUrls: []   
})
export class AddEditTaskComponent {
  toDoListForm: FormGroup;
  submitted = signal<boolean>(false);
  mode = input.required<string>();
  task = input.required<Task>();

  cancelTriggered = output<boolean>();
  saveTriggered = output<Task>();

   constructor(private formBuilder: FormBuilder) {
      this.toDoListForm = this.CreateAddEditForm();
   }

  onCancel() {
    this.cancelTriggered.emit(true);
    this.toDoListForm.reset();
    this.submitted.set(false);
  }

  onSave() {
    this.submitted.set(true);
    if (this.toDoListForm.invalid) {
      return;
    }

    const formValue = this.toDoListForm.value;
    let taskToAdd: Task = {
      id: formValue.id,
      toDoListId: this.task().toDoListId,
      name: formValue.name,
      description: formValue.description,
      isCompleted: formValue.isCompleted
    };

    this.saveTriggered.emit(taskToAdd);
    this.toDoListForm.reset();
    this.submitted.set(false);
  }

  private CreateAddEditForm() {
    return  this.formBuilder.group({
                id: [0],
                name: ['', [Validators.required, Validators.maxLength(100)]],
                description:[''],
                isCompleted: [false, [Validators.required]]
            });
  }
}
