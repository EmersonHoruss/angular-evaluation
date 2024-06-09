import { Component, computed, signal } from '@angular/core';
import { getRandomColors, getStatus, rgbString } from './utils';
import { Color, ColorTag, ColorTargeted } from './types';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-color-game',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="wrapper">
      <h1 class="title">Color Game</h1>
      <p class="description">
        Guess which color correspond to the following RGB code
      </p>

      <div class="rgb-wrapper">
        @for (color of colorsTargeted(); track $index) {
        <div class="rgb-square" [ngStyle]="{ 'border-color': color.rgb }">
          <span class="rgb-square-value">{{ color.value }}</span>
          <span class="rgb-square-tag">{{ color.tag }}</span>
        </div>
        }
      </div>
      <div class="dashboard">
        <div class="number-input">
          <label for="colors"># Colors</label>
          <input
            id="colors"
            type="number"
            [value]="numOfColors"
            (change)="handleChangeNumber($event)"
            step="3"
            min="3"
            max="9"
          />
        </div>
        <p class="game-status">{{ statusMessages[status] }}</p>
        <button (click)="handleReset()">Reset</button>
      </div>
      <div class="squares">
        @for (color of colors(); track $index) {
        <button
          [ngStyle]="{
            'background-color': rgbString(color),
            opacity: '100'
          }"
          (click)="handleAttempt($index)"
          class="square"
        ></button>
        }
      </div>
    </div>
  `,
  styleUrl: './color-game.component.css',
})
export class ColorGameComponent {
  static DEFAULT_NUM_OF_COLORS = 6;
  rgbString = rgbString;
  numOfColors = 6;
  statusMessages = {
    playing: 'The game is on!',
    win: 'You won!',
    lose: 'You lose!',
  };

  attempts = signal<number[]>([]);
  colors = signal<Color[]>(getRandomColors(this.numOfColors));
  target = Math.floor(Math.random() * this.colors.length);
  status = getStatus(this.attempts(), this.target, this.numOfColors);
  colorsTargeted = computed<ColorTargeted[]>(() =>
    Object.entries(ColorTag).map(
      ([_, tag]: [string, ColorTag], index): ColorTargeted => ({
        value: this.colors()[this.target][index],
        tag,
        tagIndex: index + 1,
        rgb: index === 0 ? 'red' : index === 1 ? 'green' : 'blue',
      })
    )
  );

  handleChangeNumber(event: Event) {
    this.numOfColors = parseInt(
      (event?.target as HTMLInputElement)?.value ??
        ColorGameComponent.DEFAULT_NUM_OF_COLORS
    );
    this.handleReset();
  }

  handleReset() {
    this.attempts.set([]);
    this.colors.set(getRandomColors(this.numOfColors));
  }

  handleAttempt(index: number) {
    this.attempts.update((attempts) => [...attempts, index]);
  }
}
