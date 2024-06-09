import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonComponent } from './button.component';
import { By } from '@angular/platform-browser';

describe('ButtonComponent', () => {
  let component: ButtonComponent;
  let fixture: ComponentFixture<ButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the button text from ng-content', () => {
    const buttonText = 'Hi world';

    const button = fixture.debugElement.query(By.css('button')).nativeElement;
    button.textContent = buttonText;

    expect(button.textContent).toContain(buttonText);
  });

  it('should apply custom sytles', () => {
    const style: Record<string, string> = { backgroundColor: 'red' };
    component.style = style;
    fixture.detectChanges();

    const button: HTMLButtonElement = fixture.debugElement.query(
      By.css('button')
    ).nativeElement;
    const computedStyle = getComputedStyle(button);
    expect(computedStyle.backgroundColor).toBe('red');
  });

  it('should apply custom css class', () => {
    const cssClass = 'custom-class';
    component.cssClass = cssClass;
    fixture.detectChanges();

    const button = fixture.debugElement.query(By.css('button')).nativeElement;
    expect(button.classList).toContain(cssClass);
  });

  it('should be disabled when the disabled input is true', () => {
    component.disabled = true;
    fixture.detectChanges();

    const button = fixture.debugElement.query(By.css('button')).nativeElement;
    expect(button.disabled).toBeTruthy();
  });

  it('should emit click event when clicked', () => {
    const mockFn = jest.fn();
    component.clicked.emit = mockFn;

    const button = fixture.debugElement.query(By.css('button')).nativeElement;
    button.click();

    expect(mockFn).toHaveBeenCalled();
  });
});
