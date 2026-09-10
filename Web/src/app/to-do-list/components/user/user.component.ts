import { Component, input, computed } from '@angular/core';
import { User } from '../../Model/to-do.models';

@Component({
  selector: 'user',
  templateUrl: './user.component.html', 
  styleUrls: []   
})
export class UserComponent {
  currentUser = input.required<User>(); 
  currentUserName = computed(() => `User: ${this.currentUser().name}`);
}
