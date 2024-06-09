import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      [ngStyle]="style"
      [class]="cssClass"
      [disabled]="disabled"
      (click)="handleClick()"
      type="button"
    >
      <ng-content></ng-content>
    </button>
  `,
  styleUrl: './button.component.css',
})
export class ButtonComponent {
  @Input() style: { [key: string]: string } = {};
  @Input() cssClass: string = '';
  @Input() disabled: boolean = false;
  @Output() clicked = new EventEmitter<void>();

  handleClick() {
    this.clicked.emit();
  }
}
