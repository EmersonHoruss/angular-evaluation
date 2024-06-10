import { Component, Inject, OnInit, inject, signal } from '@angular/core';
import { ButtonComponent } from '../../../shared/button/button.component';
import { DatePipe } from '@angular/common';
import { TaskService } from '../../data-access/services/task.service';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { TasksStateService } from '../../data-access/state/task-state.service';
import { AuthStateService } from '../../data-access/state/auth-state.service';
import { Task } from '../../data-access/interfaces/task.interface';

@Component({
  selector: 'app-authenticated',
  standalone: true,
  imports: [ButtonComponent, ReactiveFormsModule],
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
        <form class="wrapper-tasks-filters" [formGroup]="formFilter">
          <div class="form-field">
            <label class="form-field__label" for="sort">Sort by</label>
            <select
              class="form-field__main-content"
              id="sort"
              formControlName="sort"
            >
              <option value="old_first">Due Date (old first)</option>
              <option value="new_fist">Due Date (new first)</option>
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
                  (change)="toggleFilter('pending')"
                  [checked]="isFilterSelected('onlyPending')"
                />
                Only pending
              </label>
              <label class="checkables-item">
                <input
                  type="checkbox"
                  (change)="toggleFilter('important')"
                  [checked]="isFilterSelected('onlyImportant')"
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
        </form>

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
                  {{ datePipe.transform(task.created_at, 'EEEE, MMM dd') }}
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
export class AuthenticatedComponent implements OnInit {
  fb = inject(FormBuilder);
  taskService = inject(TasksStateService);
  authService = inject(AuthStateService);
  datePipe = inject(DatePipe);

  formAdd!: FormGroup;
  formFilter!: FormGroup;

  constructor() {
    this.formAdd = this.fb.group({
      title: [''],
      due_date: [''],
    });

    this.formFilter = this.fb.group({
      sort: ['old_first'],
      filters: this.fb.array([]),
    });
  }

  get filters(): FormArray {
    return this.formFilter.get('filters') as FormArray;
  }

  toggleFilter(value: string) {
    const index = this.filters.controls.findIndex(
      (control) => control.value === value
    );
    if (index === -1) {
      this.filters.push(this.fb.control(value));
    } else {
      this.filters.removeAt(index);
    }
  }

  isFilterSelected(value: string): boolean {
    return this.filters.controls.some((control) => control.value === value);
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

  ngOnInit() {
    this.formFilter.valueChanges.subscribe((value) => {
      if (value.filters.length) {
        const isPending = value.filters.find((e: string) => e === 'pending');
        const isImportant = value.filters.find(
          (e: string) => e === 'important'
        );
        const allChecks = isPending && isImportant ? 'pending_important' : '';
        if (allChecks) {
          this.taskService.filterTaskBy$.next(allChecks);
        } else {
          this.taskService.filterTaskBy$.next(value.filters[0]);
        }
      }

      this.taskService.sortTasksBy$.next(value.sort);
    });
  }
}
