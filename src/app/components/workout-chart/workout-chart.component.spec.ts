import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { WorkoutChartComponent } from './workout-chart.component';
import { WorkoutService } from '../../services/workout.service';
import { of } from 'rxjs';
import { User } from '../../interfaces/workout.interface';
import { Chart, registerables } from 'chart.js';

describe('WorkoutChartComponent', () => {
  let component: WorkoutChartComponent;
  let fixture: ComponentFixture<WorkoutChartComponent>;
  let workoutService: jasmine.SpyObj<WorkoutService>;
  let mockChartInstance: any;

  const mockUsers: User[] = [
    {
      id: 1,
      name: 'John',
      workouts: [
        { type: 'Running', minutes: 30 },
        { type: 'Cycling', minutes: 45 }
      ]
    },
    {
      id: 2,
      name: 'Jane',
      workouts: [
        { type: 'Swimming', minutes: 60 },
        { type: 'Yoga', minutes: 40 }
      ]
    }
  ];

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('WorkoutService', ['getUsers']);
    spy.getUsers.and.returnValue(of(mockUsers));

    mockChartInstance = {
      destroy: jasmine.createSpy('destroy'),
      update: jasmine.createSpy('update'),
      data: {
        labels: [],
        datasets: [{ data: [], backgroundColor: [] }]
      }
    };

    // Create a constructor spy that can be called as a function
    const ChartConstructor: any = jasmine.createSpy('Chart').and.returnValue(mockChartInstance);
    ChartConstructor.register = jasmine.createSpy('register');
    ChartConstructor.registerables = registerables;
    (window as any).Chart = ChartConstructor;

    await TestBed.configureTestingModule({
      declarations: [WorkoutChartComponent],
      providers: [{ provide: WorkoutService, useValue: spy }]
    }).compileComponents();

    workoutService = TestBed.inject(WorkoutService) as jasmine.SpyObj<WorkoutService>;
    fixture = TestBed.createComponent(WorkoutChartComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    if ((window as any).Chart) {
      delete (window as any).Chart;
    }
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch users on init', fakeAsync(() => {
    fixture.detectChanges();
    tick();
    expect(workoutService.getUsers).toHaveBeenCalled();
  }));
});
