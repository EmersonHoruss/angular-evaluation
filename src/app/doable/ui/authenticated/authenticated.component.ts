import { Component, Inject, OnInit, effect, inject, signal } from '@angular/core';
import { ButtonComponent } from '../../../shared/button/button.component';
import { DatePipe } from '@angular/common';
import { TaskService } from '../../data-access/services/task.service';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { TasksStateService } from '../../data-access/state/task-state.service';
import { AuthStateService } from '../../data-access/state/auth-state.service';
import { Task, sortTaskType } from '../../data-access/interfaces/task.interface';

@Component({
  selector: 'app-authenticated',
  standalone: true,
  imports: [ButtonComponent, ReactiveFormsModule,FormsModule],
  providers: [DatePipe],
  template: `
    <div>
      <form class="wrapper-form" [formGroup]="formAdd">
        <div class="form-field">
          <input
            class="form-field__main-content"
            placeholder="do the dishes"
            formControlName="title"
          />
        </div>

        <div class="form-field">
          <input
            class="form-field__main-content"
            type="date"
            formControlName="due_date"
          />
        </div>

        <app-button cssClass="button-default w-full" (clicked)="handleAdd()">
          Add task
        </app-button>
      </form>

      <div class="wrapper-tasks">
        <div class="wrapper-tasks-filters">
          <div class="form-field">
            <label class="form-field__label" for="sort">Sort by</label>
            <select
              class="form-field__main-content"
              id="sort"
              [(ngModel)]="sortOption"
            >
              <option value="old_first">Due Date (old first)</option>
              <option value="new_first">Due Date (new first)</option>
              <option value="a_z">Alphabetical (a-z)</option>
              <option value="z_a">Alphabetical (z-a)</option>
            </select>
          </div>

          <div class="form-field">
            <legend class="form-field__label">Filter</legend>
            <div class="checkables form-field__main-content">
              <label class="checkables-item">
                <input
                  type="checkbox"
                  [(ngModel)]="isPending"
                />
                Only pending
              </label>
              <label class="checkables-item">
                <input
                  type="checkbox"
                  [(ngModel)]="isImportant"
                />
                Only important
              </label>
            </div>
          </div>

          <app-button
            cssClass="button-secondary w-full"
            (clicked)="handleLogout()"
          >
            Logout
          </app-button>
        </div>

        <div class="wrapper-tasks-list">
          @for (task of taskService.tasks(); track task.id) {
          <div class="wrapper-tasks-list-item">
            <div class="wrapper-tasks-list-item-content">
              <input
                type="checkbox"
                (change)="handleCompleted(task)"
                [checked]="task.completed"
              />
              <div>
                <label for="">{{ task.title }}</label>
                <small>
                  {{ datePipe.transform(task.due_date, 'EEEE, MMM dd') }}
                </small>
              </div>
            </div>

            <div class="wrapper-tasks-list-item-actions">
              <app-button
                [cssClass]="
                  'button-icon button-outline ' +
                  (task.important && 'secondary')
                "
                (clicked)="handleImportant(task)"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="lucide lucide-badge-alert icon"
                >
                  <path
                    d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"
                  ></path>
                  <line x1="12" x2="12" y1="8" y2="12"></line>
                  <line x1="12" x2="12.01" y1="16" y2="16"></line>
                </svg>
              </app-button>
              <app-button
                cssClass="button-icon button-outline"
                (clicked)="handleDelete(task.id)"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="lucide lucide-trash2 icon"
                >
                  <path d="M3 6h18"></path>
                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                  <line x1="10" x2="10" y1="11" y2="17"></line>
                  <line x1="14" x2="14" y1="11" y2="17"></line>
                </svg>
              </app-button>
            </div>
          </div>
          }
        </div>
      </div>
    </div>
  `,
  styleUrl: './authenticated.component.css',
})
export class AuthenticatedComponent {
  fb = inject(FormBuilder);
  taskService = inject(TasksStateService);
  authService = inject(AuthStateService);
  datePipe = inject(DatePipe);
  sortOption = signal<sortTaskType>('old_first');
  isPending = signal<boolean>(false);
  isImportant = signal<boolean>(false);

  formAdd!: FormGroup;

  constructor() {
    this.formAdd = this.fb.group({
      title: [''],
      due_date: [''],
    });
    effect(()=>{
      this.taskService.sortTasksBy$.next((this.sortOption()));
    },{ allowSignalWrites: true });
    effect(()=>{
      if(this.isPending() && this.isImportant()){
        this.taskService.filterTaskBy$.next('pending_important');
      }else if(this.isPending()){
        this.taskService.filterTaskBy$.next('pending');
      }else if(this.isImportant()){
        this.taskService.filterTaskBy$.next('important');
      }else{
        this.taskService.getAllTasks$.next();
      }
    },{ allowSignalWrites: true })
  }

  handleAdd() {
    this.taskService.createTask$.next(this.formAdd.value);
    this.formAdd.reset();
  }

  handleLogout() {
    this.authService.logout$.next();
  }

  handleImportant(task: Task) {
    this.taskService.editTask$.next({ ...task, important: !task.important });
  }

  handleCompleted(task: Task) {
    console.log(task);
    this.taskService.editTask$.next({ ...task, completed: !task.completed });
  }

  handleDelete(id: number) {
    this.taskService.deleteTask$.next(id);
  }
    
}
