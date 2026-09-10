import { Component, input , output } from '@angular/core';
import { Task } from '../../Model/to-do.models';

@Component({
  selector: 'task',
  templateUrl: './task.component.html', 
  styleUrls: []   
})
export class TaskComponent {
  task = input.required<Task>();

  deleteTriggered = output<Task>();

  onDelete(task: Task) {
    this.deleteTriggered.emit(task);
  }
}
