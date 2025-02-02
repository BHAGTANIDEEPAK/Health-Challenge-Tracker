import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { WorkoutService } from '../../services/workout.service';
import { WORKOUT_TYPES } from '../../interfaces/workout.interface';

@Component({
  selector: 'app-workout-form',
  template: `
    <form [formGroup]="workoutForm" (ngSubmit)="onSubmit()" class="p-4 bg-white rounded-lg shadow-md">
      <div class="mb-4">
        <mat-form-field class="w-full">
          <mat-label>User Name</mat-label>
          <input matInput formControlName="name" placeholder="Enter user name">
          <mat-error *ngIf="workoutForm.get('name')?.errors?.['required']">Name is required</mat-error>
        </mat-form-field>
      </div>

      <div class="mb-4">
        <mat-form-field class="w-full">
          <mat-label>Workout Type</mat-label>
          <mat-select formControlName="workoutType">
            <mat-option *ngFor="let type of workoutTypes" [value]="type">
              {{type}}
            </mat-option>
          </mat-select>
          <mat-error *ngIf="workoutForm.get('workoutType')?.errors?.['required']">Workout type is required</mat-error>
        </mat-form-field>
      </div>

      <div class="mb-4">
        <mat-form-field class="w-full">
          <mat-label>Minutes</mat-label>
          <input matInput type="number" formControlName="minutes" placeholder="Enter workout duration">
          <mat-error *ngIf="workoutForm.get('minutes')?.errors?.['required']">Minutes are required</mat-error>
          <mat-error *ngIf="workoutForm.get('minutes')?.errors?.['min']">Minutes must be greater than 0</mat-error>
        </mat-form-field>
      </div>

      <button mat-raised-button color="primary" type="submit" [disabled]="!workoutForm.valid"
        class="w-full py-2">
        Add Workout
      </button>
    </form>
  `,
  styles: [`
    :host {
      display: block;
      max-width: 500px;
      margin: 0 auto;
    }
  `]
})
export class WorkoutFormComponent {
  workoutForm: FormGroup;
  workoutTypes = WORKOUT_TYPES;

  constructor(
    private fb: FormBuilder,
    private workoutService: WorkoutService
  ) {
    this.workoutForm = this.fb.group({
      name: ['', Validators.required],
      workoutType: ['', Validators.required],
      minutes: ['', [Validators.required, Validators.min(1)]]
    });
  }

  onSubmit(): void {
    if (this.workoutForm.valid) {
      const { name, workoutType, minutes } = this.workoutForm.value;
      this.workoutService.addWorkout(name, {
        type: workoutType,
        minutes: parseInt(minutes, 10)
      });
      this.workoutForm.reset();
    }
  }
}
