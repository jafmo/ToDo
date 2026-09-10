import { Service, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ToDoList, Task } from '../Model/to-do.models'; 

@Service()
export class ToDoListService {
  private http = inject(HttpClient);
  private apiUrl = 'https://localhost:7051/api/todolist';

  getToDoListItems(): Observable<ToDoList[]> {
    return this.http.get<ToDoList[]>(this.apiUrl);
  }

  AddTask (toDoList: ToDoList, task: Partial<Task>): Observable<ToDoList> {
      const params = new HttpParams().set('id', toDoList.id.toString());
      return this.http.post<ToDoList>(`${this.apiUrl}/addTask`, task, { params });
  }

  DeleteTask(id: number, taskId: number): Observable<void> {
    const params = new HttpParams().set('id', id.toString()).set('taskId', taskId.toString());
    return this.http.delete<void>(`${this.apiUrl}/deleteTask`, { params });
  }

  UpdateTask (toDoList: ToDoList, task: Partial<Task>): Observable<ToDoList> {
      const params = new HttpParams().set('id', toDoList.id.toString());
      return this.http.put<ToDoList>(`${this.apiUrl}/updateTask`, task, { params });
  }


}
