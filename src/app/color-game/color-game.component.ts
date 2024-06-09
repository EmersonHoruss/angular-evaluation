import { Component, ViewEncapsulation, computed, signal } from '@angular/core';
import { getRandomColors, getStatus, rgbString } from './utils';
import { Color, ColorTag, ColorTargeted } from './types';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../shared/button/button.component';
import { encapsulateStyle } from '@angular/compiler';

@Component({
  selector: 'app-color-game',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  encapsulation: ViewEncapsulation.None,
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
        <p class="game-status">{{ statusMessages[status()] }}</p>
        <app-button (clicked)="handleReset()" cssClass="button-default">
          Reset
        </app-button>
      </div>
      <div class="squares">
        @for (color of colors(); track $index) {
        <app-button
          [style]="{
            'background-color':
              status() === 'playing' ? rgbString(color) : colorsTargetedRgb(),
            opacity: attemptIndexes()[$index] ? '0' : '100'
          }"
          (clicked)="handleAttempt($index)"
          cssClass="square"
          [disabled]="attemptsDisabled()"
        >
        </app-button>
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
  statusMessages: Record<string, string> = {
    playing: 'The game is on!',
    win: 'You won!',
    lose: 'You lose!',
  };

  attempts = signal<Set<number>>(new Set());
  colors = signal<Color[]>(getRandomColors(this.numOfColors));
  target = computed<number>(() =>
    Math.floor(Math.random() * this.colors().length)
  );
  status = computed<string>(() => {
    return getStatus(
      Array.from(this.attempts()),
      this.target(),
      this.numOfColors
    );
  });
  colorsTargeted = computed<ColorTargeted[]>(() =>
    Object.entries(ColorTag).map(
      ([_, tag]: [string, ColorTag], index): ColorTargeted => ({
        value: this.colors()[this.target()][index],
        tag,
        tagIndex: index + 1,
        rgb: index === 0 ? 'red' : index === 1 ? 'green' : 'blue',
      })
    )
  );
  colorsTargetedRgb = computed<string>(() => {
    const color: Color = this.colorsTargeted().map((e) => e.value) as Color;
    return rgbString(color);
  });
  attemptIndexes = computed(() =>
    this.status() === 'playing'
      ? Array.from({ length: this.colors().length }, (_, i) =>
          this.attempts().has(i)
        )
      : Array.from({ length: this.colors().length }, (_, i) => false)
  );
  attemptsDisabled = computed(() => this.status() !== 'playing');

  handleChangeNumber(event: Event) {
    this.numOfColors = parseInt(
      (event?.target as HTMLInputElement)?.value ??
        ColorGameComponent.DEFAULT_NUM_OF_COLORS
    );
    this.handleReset();
  }

  handleReset() {
    this.attempts.set(new Set());
    const random = getRandomColors(this.numOfColors);
    this.colors.set(random);
  }

  handleAttempt(index: number) {
    this.attempts.update((attempts) => {
      const newSet = new Set(attempts);
      newSet.add(index);
      return newSet;
    });
  }
}
