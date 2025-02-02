import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { WorkoutFormComponent } from './workout-form.component';
import { WorkoutService } from '../../services/workout.service';

describe('WorkoutFormComponent', () => {
  let component: WorkoutFormComponent;
  let fixture: ComponentFixture<WorkoutFormComponent>;
  let workoutService: WorkoutService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkoutFormComponent ],
      imports: [
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        BrowserAnimationsModule
      ],
      providers: [ WorkoutService ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkoutFormComponent);
    component = fixture.componentInstance;
    workoutService = TestBed.inject(WorkoutService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty form', () => {
    expect(component.workoutForm.get('name')?.value).toBe('');
    expect(component.workoutForm.get('workoutType')?.value).toBe('');
    expect(component.workoutForm.get('minutes')?.value).toBe('');
  });

  it('should be invalid when empty', () => {
    expect(component.workoutForm.valid).toBeFalsy();
  });

  it('should be valid when all fields are filled', () => {
    component.workoutForm.controls['name'].setValue('John Doe');
    component.workoutForm.controls['workoutType'].setValue('Running');
    component.workoutForm.controls['minutes'].setValue('30');
    
    expect(component.workoutForm.valid).toBeTruthy();
  });

  it('should call workoutService.addWorkout when form is submitted', () => {
    const addWorkoutSpy = jest.spyOn(workoutService, 'addWorkout');
    
    component.workoutForm.controls['name'].setValue('John Doe');
    component.workoutForm.controls['workoutType'].setValue('Running');
    component.workoutForm.controls['minutes'].setValue('30');
    
    component.onSubmit();
    
    expect(addWorkoutSpy).toHaveBeenCalledWith('John Doe', {
      type: 'Running',
      minutes: 30
    });
  });

  it('should reset form after successful submission', () => {
    component.workoutForm.controls['name'].setValue('John Doe');
    component.workoutForm.controls['workoutType'].setValue('Running');
    component.workoutForm.controls['minutes'].setValue('30');
    
    component.onSubmit();
    
    expect(component.workoutForm.get('name')?.value).toBe('');
    expect(component.workoutForm.get('workoutType')?.value).toBe('');
    expect(component.workoutForm.get('minutes')?.value).toBe('');
  });

  it('should not submit if form is invalid', () => {
    const addWorkoutSpy = jest.spyOn(workoutService, 'addWorkout');
    
    component.workoutForm.controls['name'].setValue(''); // Invalid
    component.workoutForm.controls['workoutType'].setValue('Running');
    component.workoutForm.controls['minutes'].setValue('30');
    
    component.onSubmit();
    
    expect(addWorkoutSpy).not.toHaveBeenCalled();
  });
});
