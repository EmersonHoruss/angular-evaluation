import {
  Component,
  ViewEncapsulation,
  computed,
  inject,
  signal,
} from '@angular/core';
import { ButtonComponent } from '../../../shared/button/button.component';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AuthStateService } from '../../data-access/state/auth-state.service';

@Component({
  selector: 'app-unauthenticated',
  standalone: true,
  imports: [ButtonComponent, ReactiveFormsModule],
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
      <form [formGroup]="form">
        <div class="form-field">
          <label class="form-field__label">Email</label>
          <input
            class="form-field__main-content"
            placeholder="user@example.com"
            formControlName="email"
          />
        </div>

        <div class="form-field">
          <label class="form-field__label">Password</label>
          <input
            class="form-field__main-content"
            type="password"
            formControlName="password"
          />
        </div>

        <app-button cssClass="button-default w-full" (clicked)="handleAction()">
          {{ action() }}
        </app-button>
        <div class="error">{{ service.error()?.description }}</div>
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

  form!: FormGroup;

  fb = inject(FormBuilder);
  service = inject(AuthStateService);
  constructor() {
    this.form = this.fb.group({
      email: [''],
      password: [''],
    });
  }

  handleTab(tab: string) {
    this.tab.set(tab);
  }

  handleAction() {
    if (this.tab() === 'login') {
      this.service.login$.next(this.form.value);
    }
    if (this.tab() === 'signup') {
      this.service.signup$.next(this.form.value);
    }
  }
}
