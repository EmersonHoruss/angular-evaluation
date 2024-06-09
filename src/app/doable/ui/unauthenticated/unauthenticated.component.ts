import { Component, ViewEncapsulation, computed, signal } from '@angular/core';
import { ButtonComponent } from '../../../shared/button/button.component';

@Component({
  selector: 'app-unauthenticated',
  standalone: true,
  imports: [ButtonComponent],
  template: `
    <div class="wrapper">
      <div class="tabs">
        <app-button
          [cssClass]="'button-doable ' + cssWhenLoginEnabled()"
          (clicked)="handleTab('login')"
        >
          Login
        </app-button>
        <app-button
          [cssClass]="'button-doable ' + cssWhenSignupEnabled()"
          (clicked)="handleTab('signup')"
        >
          Signup
        </app-button>
      </div>
      <form>
        <div class="form-field">
          <label class="form-field__label">Email</label>
          <input
            class="form-field__main-content"
            placeholder="user@example.com"
          />
        </div>

        <div class="form-field">
          <label class="form-field__label">Password</label>
          <input class="form-field__main-content" type="password" />
        </div>

        <app-button cssClass="button-default w-full" (clicked)="handleAction()">
          {{ action() }}
        </app-button>
      </form>
    </div>
  `,
  styleUrl: './unauthenticated.component.css',
})
export class UnauthenticatedComponent {
  tab = signal('login');
  action = computed(() => (this.tab() === 'login' ? 'Enter' : 'Create'));
  cssWhenLoginEnabled = computed(() =>
    this.tab() === 'login' ? 'button-doable__active' : ''
  );
  cssWhenSignupEnabled = computed(() =>
    this.tab() === 'signup' ? 'button-doable__active' : ''
  );
  handleTab(tab: string) {
    this.tab.set(tab);
  }

  handleAction() {}
}
