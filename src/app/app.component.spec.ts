import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { Router, provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { query } from '@angular/animations';
import { HomeComponent } from './home/home.component';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [provideRouter(routes)],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have the 'angular-evaluation' title`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('Angular Evaluation');
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const appTitle: DebugElement = fixture.debugElement.query(
      By.css('[data-testid="app-title"]')
    );
    const appTitleContent = appTitle.nativeElement.textContent;
    expect(appTitleContent).toEqual('Angular Evaluation');
  });

  it('should render home component when click on title page', () => {
    const link = fixture.nativeElement.querySelector('[data-testid="home"]');
    link.click();

    const element = fixture.nativeElement.querySelector('app-home');
    expect(element).toBeTruthy();
    expect(router.url).toBe('/');
  });

  it('should render color game component', () => {
    const link = fixture.nativeElement.querySelector(
      '[data-testid="Color Game"]'
    );
    link.click();

    const element = fixture.nativeElement.querySelector('app-color-game');
    expect(element).toBeTruthy();
    expect(router.url).toBe('/color-game');
  });

  it('should render doable component', () => {
    const link = fixture.nativeElement.querySelector('[data-testid="Doable"]');
    link.click();

    const element = fixture.nativeElement.querySelector('app-doable');
    expect(element).toBeTruthy();
    expect(router.url).toBe("/doable")
  });
});
