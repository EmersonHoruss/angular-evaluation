import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { Router, provideRouter } from '@angular/router';
import { routes } from '../app.routes';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [provideRouter(routes)],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('should render color game component', () => {
    const link = fixture.nativeElement.querySelector('[data-testid="colorGame"]');
    link.click();

    expect(router.url).toBe('/color-game');
  });
  
  it('should render doable component', () => {
    const link = fixture.nativeElement.querySelector('[data-testid="doable"]');
    link.click();

    expect(router.url).toBe('/doable');
  });
});
