import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule],
  template: `
    <div class="wrapper">
      <header class="header">
        <a class="logo" routerLink="/" data-testid="home">
          <img src="assets/angular.svg" />
          <span data-testid="app-title">{{ title }}</span>
        </a>
        <nav class="nav">
          @for (item of navigation; track item.to) {
          <a
            class="nav-item"
            [routerLink]="item.to"
            routerLinkActive="link-active"
            [attr.data-testid]="item.name"
          >
            {{ item.name }}
          </a>
          }
        </nav>
      </header>
      <main class="main">
        <router-outlet />
      </main>
    </div>
  `,
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'Angular Evaluation';
  navigation = [
    {
      name: 'Color Game',
      to: '/color-game',
    },
    {
      name: 'Doable',
      to: '/doable',
    },
  ];
}
