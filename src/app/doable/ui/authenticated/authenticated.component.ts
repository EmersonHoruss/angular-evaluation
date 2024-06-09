import { Component, Inject, inject, signal } from '@angular/core';
import { ButtonComponent } from '../../../shared/button/button.component';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-authenticated',
  standalone: true,
  imports: [ButtonComponent],
  providers: [DatePipe],
  template: `
    <div>
      <form class="wrapper-form ">
        <div class="form-field">
          <input class="form-field__main-content" placeholder="do the dishes" />
        </div>

        <div class="form-field">
          <input class="form-field__main-content" type="date" />
        </div>

        <app-button cssClass="button-default w-full" (clicked)="handleAdd()">
          Add task
        </app-button>
      </form>
      <div class="wrapper-tasks">
        <form class="wrapper-tasks-filters">
          <div class="form-field">
            <label class="form-field__label" for="sort">Sort by</label>
            <select class="form-field__main-content" id="sort">
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
                <input type="checkbox" name="css" value="si" />
                Only pending
              </label>
              <label class="checkables-item">
                <input type="checkbox" name="js" value="si" />
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
          @for (task of tasks; track task.id) {
          <div class="wrapper-tasks-list-item">
            <div class="wrapper-tasks-list-item-content">
              <input type="checkbox" />
              <div>
                <label for="">asdf</label>
                <small>
                  {{ datePipe.transform('2024-06-09', 'EEEE, MMM dd') }}
                </small>
              </div>
            </div>

            <div class="wrapper-tasks-list-item-actions">
              <app-button
                cssClass="button-icon button-outline"
                (clicked)="handleImportant(task.id, task.important)"
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
  datePipe = inject(DatePipe);

  handleAdd() {}

  handleLogout() {}

  tasks = [
    {
      id: 12,
      name: 'hola',
      date: '2024-06-09',
      important: true,
      pending: true,
    },
  ];

  handleImportant(id: number, important: boolean) {}

  handleDelete(id: number) {}
}
