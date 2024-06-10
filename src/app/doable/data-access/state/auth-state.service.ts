import { Injectable, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NEVER, Subject, catchError, of, switchMap, tap } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { AuthState, AuthUser } from '../interfaces/auth.interface';
import { TaskService } from '../services/task.service';

@Injectable({
  providedIn: 'root',
})
export class AuthStateService {
  private authService = inject(AuthService);
  private taskService = inject(TaskService);

  // Sources
  login$ = new Subject<AuthUser>();
  signup$ = new Subject<AuthUser>();
  logout$ = new Subject<void>();

  // State
  private state = signal<AuthState>({
    token: null,
    loading: true,
    error: null,
  });

  // Selectors
  token = computed(() => this.state().token);
  loading = computed(() => this.state().loading);
  error = computed(() => this.state().error);

  // Reducers
  constructor() {
    const token = localStorage.getItem('token');
    if (token) {
      this.setToken(token);
      this.taskService
        .getListTasks(this.token() || '')
        .pipe(
          catchError(() => {
            this.resetAuthState();
            localStorage.clear();
            return of(null);
          })
        )
        .subscribe();
    }

    this.login$
      .pipe(
        takeUntilDestroyed(),
        tap(() => this.setLoading(true)),
        switchMap((authUser) =>
          this.authService.login(authUser).pipe(this.setCatchError())
        )
      )
      .subscribe((token: any) => {
        this.setLoading(false);
        this.setToken(token);
        this.setError(null);
        localStorage.setItem('token', token);
      });

    this.signup$
      .pipe(
        takeUntilDestroyed(),
        tap(() => this.setLoading(true)),
        switchMap((authUser) =>
          this.authService.signup(authUser).pipe(this.setCatchError())
        )
      )
      .subscribe((token: any) => {
        this.setLoading(false);
        this.setToken(token);
        this.setError(null);
        localStorage.setItem('token', token);
      });

    this.logout$
      .pipe(
        takeUntilDestroyed(),
        tap(() => this.setLoading(true)),
        switchMap(() =>
          this.authService.logout(this.token() || '').pipe(this.setCatchError())
        )
      )
      .subscribe(() => {
        this.resetAuthState();
        localStorage.clear();
      });
  }

  // Utilities
  setToken(token: AuthState['token']) {
    this.state.update((prev) => ({
      ...prev,
      token,
    }));
  }

  setLoading(loading: AuthState['loading']) {
    this.state.update((prev) => ({
      ...prev,
      loading,
    }));
  }

  setError(value: any) {
    const error = value
      ? {
          status: value.status,
          name: value.name,
          description: value.error.errors[0],
        }
      : value;

    this.state.update((prev) => ({
      ...prev,
      error,
    }));
  }

  resetAuthState() {
    this.state.set({
      token: null,
      loading: false,
      error: null,
    });
  }

  setCatchError() {
    return catchError((error: any) => {
      this.resetAuthState();
      this.setError(error);
      return NEVER;
    });
  }
}
