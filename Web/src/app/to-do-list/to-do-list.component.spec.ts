import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ToDoListComponent } from './to-do-list.component';
import { ToDoListService } from './services/to-do-list.service';
import { UserComponent } from './components/user/user.component';
import { TaskComponent } from './components/task/task.component';
import { AddEditTaskComponent } from './components/task/add-edit-task.component';
import { of, throwError } from 'rxjs';
import { ToDoList, Task, User } from './Model/to-do.models';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

describe('ToDoListComponent', () => {
  let component: ToDoListComponent;
  let fixture: ComponentFixture<ToDoListComponent>;
  let toDoListService: jasmine.SpyObj<ToDoListService>;

  // Mock data
  const mockUser: User = {
    id: 1,
    name: 'John Doe'
  };

  const mockTask: Task = {
    id: 1,
    toDoListId: 1,
    name: 'Test Task',
    description: 'Test Description',
    isCompleted: false
  };

  const mockToDoList: ToDoList = {
    id: 1,
    user: mockUser,
    tasks: [mockTask]
  };

  beforeEach(async () => {
    // Create a spy object for ToDoListService
    const toDoListServiceSpy = jasmine.createSpyObj('ToDoListService', [
      'getToDoListItems',
      'AddTask',
      'DeleteTask',
      'UpdateTask'
    ]);

    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        ToDoListComponent,
        UserComponent,
        TaskComponent,
        AddEditTaskComponent
      ],
      providers: [
        { provide: ToDoListService, useValue: toDoListServiceSpy }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    toDoListService = TestBed.inject(ToDoListService) as jasmine.SpyObj<ToDoListService>;
    fixture = TestBed.createComponent(ToDoListComponent);
    component = fixture.componentInstance;
  });

  describe('Component Initialization', () => {
    it('should create the component', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with empty todo list items', () => {
      expect(component.toDoListItems()).toEqual([]);
    });

    it('should initialize loading state as true', () => {
      expect(component.loading()).toBe(true);
    });

    it('should initialize newTask signal with default empty task', () => {
      const newTask = component.newTask();
      expect(newTask).toEqual({
        toDoListId: 0,
        id: 0,
        name: '',
        description: '',
        isCompleted: false
      });
    });
  });

  describe('ngOnInit', () => {
    it('should call loadItemsList on initialization', () => {
      spyOn(component, 'loadItemsList');
      component.ngOnInit();
      expect(component.loadItemsList).toHaveBeenCalled();
    });

    it('should load todo lists and update signal', fakeAsync(() => {
      toDoListService.getToDoListItems.and.returnValue(of([mockToDoList]));

      component.ngOnInit();
      tick();

      expect(component.toDoListItems().length).toBe(1);
      expect(component.toDoListItems()[0].id).toBe(mockToDoList.id);
    }));

    it('should set loading to false after data is loaded', fakeAsync(() => {
      toDoListService.getToDoListItems.and.returnValue(of([mockToDoList]));
      expect(component.loading()).toBe(true);
      component.ngOnInit();
      tick();
      expect(component.loading()).toBe(false);
    }));

    it('should handle empty list from service', fakeAsync(() => {
      toDoListService.getToDoListItems.and.returnValue(of([]));

      component.ngOnInit();
      tick();

      expect(component.toDoListItems().length).toBe(0);
      expect(component.loading()).toBe(false);
    }));

    it('should set loading to false on error', fakeAsync(() => {
      toDoListService.getToDoListItems.and.returnValue(
        throwError(() => new Error('API Error'))
      );

      spyOn(console, 'error');
      component.ngOnInit();
      tick();

      expect(component.loading()).toBe(false);
      expect(console.error).toHaveBeenCalledWith('API Error details:', jasmine.any(Error));
    }));
  });

  describe('loadItemsList', () => {
    it('should call service getToDoListItems', fakeAsync(() => {
      toDoListService.getToDoListItems.and.returnValue(of([mockToDoList]));

      component.loadItemsList();
      tick();

      expect(toDoListService.getToDoListItems).toHaveBeenCalled();
    }));

    it('should update toDoListItems signal with service data', fakeAsync(() => {
      toDoListService.getToDoListItems.and.returnValue(of([mockToDoList]));

      component.loadItemsList();
      tick();

      expect(component.toDoListItems()).toEqual([mockToDoList]);
    }));

    it('should set loading to false after successful load', fakeAsync(() => {
      toDoListService.getToDoListItems.and.returnValue(of([mockToDoList]));
      component.loading.set(true);

      component.loadItemsList();
      tick();

      expect(component.loading()).toBe(false);
    }));

    it('should handle error and set loading to false', fakeAsync(() => {
      const errorMessage = 'Failed to fetch';
      toDoListService.getToDoListItems.and.returnValue(
        throwError(() => new Error(errorMessage))
      );
      component.loading.set(true);

      spyOn(console, 'error');
      component.loadItemsList();
      tick();

      expect(component.loading()).toBe(false);
      expect(console.error).toHaveBeenCalled();
    }));
  });

  describe('onAdd', () => {
    it('should set newTask signal with task for selected todo list', () => {
      component.onAdd(mockToDoList);

      const newTask = component.newTask();
      expect(newTask.toDoListId).toBe(mockToDoList.id);
      expect(newTask.name).toBe('');
      expect(newTask.description).toBe('');
      expect(newTask.isCompleted).toBe(false);
    });

    it('should create new task with id 0', () => {
      component.onAdd(mockToDoList);

      expect(component.newTask().id).toBe(0);
    });

    it('should set correct toDoListId from parent list', () => {
      const toDoListId = 5;
      const testList = { ...mockToDoList, id: toDoListId };

      component.onAdd(testList);

      expect(component.newTask().toDoListId).toBe(toDoListId);
    });
  });

  describe('onCancel', () => {
    it('should reset newTask signal to default empty task', () => {
      component.newTask.set({
        toDoListId: 1,
        id: 1,
        name: 'Some Task',
        description: 'Some Description',
        isCompleted: true
      });

      component.onCancel();

      expect(component.newTask()).toEqual({
        toDoListId: 0,
        id: 0,
        name: '',
        description: '',
        isCompleted: false
      });
    });

    it('should clear all task fields', () => {
      component.newTask.set(mockTask);
      component.onCancel();

      const newTask = component.newTask();
      expect(newTask.name).toBe('');
      expect(newTask.description).toBe('');
      expect(newTask.isCompleted).toBe(false);
    });
  });

  describe('onSave', () => {
    it('should call service AddTask with correct parameters', fakeAsync(() => {
      toDoListService.AddTask.and.returnValue(of(mockTask as any));
      toDoListService.getToDoListItems.and.returnValue(of([mockToDoList]));

      component.onSave(mockTask);
      tick();

      expect(toDoListService.AddTask).toHaveBeenCalledWith(mockTask.toDoListId, mockTask);
    }));

    it('should reload list after successful save', fakeAsync(() => {
      toDoListService.AddTask.and.returnValue(of(mockTask as any));
      toDoListService.getToDoListItems.and.returnValue(of([mockToDoList]));
      spyOn(component, 'loadItemsList');

      component.onSave(mockTask);
      tick();

      expect(component.loadItemsList).toHaveBeenCalled();
    }));

    it('should reset newTask after successful save', fakeAsync(() => {
      toDoListService.AddTask.and.returnValue(of(mockTask as any));
      toDoListService.getToDoListItems.and.returnValue(of([]));
      component.newTask.set(mockTask);

      component.onSave(mockTask);
      tick();

      expect(component.newTask()).toEqual({
        toDoListId: 0,
        id: 0,
        name: '',
        description: '',
        isCompleted: false
      });
    }));

    it('should handle service error gracefully', fakeAsync(() => {
      const errorMessage = 'Failed to add task';
      toDoListService.AddTask.and.returnValue(
        throwError(() => new Error(errorMessage))
      );

      spyOn(console, 'error');
      component.onSave(mockTask);
      tick();

      expect(console.error).toHaveBeenCalledWith('Add task failed', jasmine.any(Error));
    }));

    it('should not reload list on error', fakeAsync(() => {
      toDoListService.AddTask.and.returnValue(
        throwError(() => new Error('API Error'))
      );
      spyOn(component, 'loadItemsList');

      component.onSave(mockTask);
      tick();

      expect(component.loadItemsList).not.toHaveBeenCalled();
    }));
  });

  describe('onDelete', () => {
    it('should call service DeleteTask with correct parameters', fakeAsync(() => {
      toDoListService.DeleteTask.and.returnValue(of(mockTask as any));
      toDoListService.getToDoListItems.and.returnValue(of([mockToDoList]));

      component.onDelete(mockTask);
      tick();

      expect(toDoListService.DeleteTask).toHaveBeenCalledWith(mockTask.toDoListId, mockTask.id);
    }));

    it('should reload list after successful delete', fakeAsync(() => {
      toDoListService.DeleteTask.and.returnValue(of(mockTask as any));
      toDoListService.getToDoListItems.and.returnValue(of([]));
      spyOn(component, 'loadItemsList');

      component.onDelete(mockTask);
      tick();

      expect(component.loadItemsList).toHaveBeenCalled();
    }));

    it('should handle service error on delete', fakeAsync(() => {
      const errorMessage = 'Failed to delete task';
      toDoListService.DeleteTask.and.returnValue(
        throwError(() => new Error(errorMessage))
      );

      spyOn(console, 'error');
      component.onDelete(mockTask);
      tick();

      expect(console.error).toHaveBeenCalledWith('Delete task failed', jasmine.any(Error));
    }));

    it('should not reload list on delete error', fakeAsync(() => {
      toDoListService.DeleteTask.and.returnValue(
        throwError(() => new Error('API Error'))
      );
      spyOn(component, 'loadItemsList');

      component.onDelete(mockTask);
      tick();

      expect(component.loadItemsList).not.toHaveBeenCalled();
    }));
  });

  describe('onEdit', () => {
    it('should exist but do nothing (placeholder method)', () => {
      expect(() => component.onEdit(mockTask)).not.toThrow();
    });
  });

  describe('Integration Tests', () => {
    it('should handle complete workflow: load -> add -> save', fakeAsync(() => {
      // Load initial data
      toDoListService.getToDoListItems.and.returnValue(of([mockToDoList]));
      component.ngOnInit();
      tick();

      expect(component.toDoListItems().length).toBe(1);

      // Add new task
      component.onAdd(mockToDoList);
      expect(component.newTask().toDoListId).toBe(mockToDoList.id);

      // Save task
      toDoListService.AddTask.and.returnValue(of(component.newTask() as any));
      component.onSave(component.newTask());
      tick();

      expect(toDoListService.AddTask).toHaveBeenCalled();
      expect(component.newTask()).toEqual({
        toDoListId: 0,
        id: 0,
        name: '',
        description: '',
        isCompleted: false
      });
    }));

    it('should handle complete workflow: load -> delete', fakeAsync(() => {
      // Load initial data
      toDoListService.getToDoListItems.and.returnValue(of([mockToDoList]));
      component.ngOnInit();
      tick();

      expect(component.toDoListItems().length).toBe(1);

      // Delete task
      toDoListService.DeleteTask.and.returnValue(of(mockTask as any));
      toDoListService.getToDoListItems.and.returnValue(of([]));

      component.onDelete(mockTask);
      tick();

      expect(toDoListService.DeleteTask).toHaveBeenCalledWith(mockTask.toDoListId, mockTask.id);
    }));

    it('should handle multiple list items', fakeAsync(() => {
      const multipleItems = [mockToDoList, { ...mockToDoList, id: 2 }];
      toDoListService.getToDoListItems.and.returnValue(of(multipleItems));

      component.ngOnInit();
      tick();

      expect(component.toDoListItems().length).toBe(2);
      expect(component.toDoListItems()[0].id).toBe(1);
      expect(component.toDoListItems()[1].id).toBe(2);
    }));
  });

  describe('Error Handling', () => {
    it('should not crash when service throws error during load', fakeAsync(() => {
      toDoListService.getToDoListItems.and.returnValue(
        throwError(() => new Error('Network error'))
      );

      expect(() => {
        component.ngOnInit();
        tick();
      }).not.toThrow();
    }));

    it('should not crash when adding task fails', fakeAsync(() => {
      toDoListService.AddTask.and.returnValue(
        throwError(() => new Error('Server error'))
      );

      expect(() => {
        component.onSave(mockTask);
        tick();
      }).not.toThrow();
    }));

    it('should not crash when deleting task fails', fakeAsync(() => {
      toDoListService.DeleteTask.and.returnValue(
        throwError(() => new Error('Server error'))
      );

      expect(() => {
        component.onDelete(mockTask);
        tick();
      }).not.toThrow();
    }));
  });
});
