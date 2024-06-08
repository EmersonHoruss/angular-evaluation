import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule],
  template: `
    <div class="wrapper">
      <img src="assets/angular.svg" width="96" />
      <h1 class="title">Angular Evaluation</h1>
      <p class="name">David Emerson Perales Villanueva</p>
      <div class="buttons">
        <a routerLink="/color-game"> Color Game </a>
        <a routerLink="/doable"> Doable </a>
      </div>
    </div>
  `,
  styleUrl: './home.component.css',
})
export class HomeComponent {}
