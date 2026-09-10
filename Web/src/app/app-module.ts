import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { ToDoListComponent } from './to-do-list/to-do-list.component';
import { UserComponent } from './to-do-list/components/user/user.component';
import { TaskComponent } from './to-do-list/components/task/task.component';
import { AddEditTaskComponent } from './to-do-list/components/task/add-edit-task.component';

@NgModule({
  declarations: [
    App
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    UserComponent,
    TaskComponent,
    AddEditTaskComponent,
    ToDoListComponent
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
     provideHttpClient()
  ],
  bootstrap: [App]
})
export class AppModule { }
