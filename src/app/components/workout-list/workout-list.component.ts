import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { WorkoutService } from '../../services/workout.service';
import { User, WORKOUT_TYPES } from '../../interfaces/workout.interface';

@Component({
  selector: 'app-workout-list',
  template: `
    <div class="p-4">
      <div class="mb-4 flex gap-4">
        <mat-form-field class="flex-1">
          <mat-label>Search by name</mat-label>
          <input matInput (keyup)="applyFilter($event)" placeholder="Type to search...">
        </mat-form-field>

        <mat-form-field class="flex-1">
          <mat-label>Filter by workout type</mat-label>
          <mat-select (selectionChange)="filterByType($event.value)">
            <mat-option>None</mat-option>
            <mat-option *ngFor="let type of workoutTypes" [value]="type">
              {{type}}
            </mat-option>
          </mat-select>
        </mat-form-field>
      </div>

      <div class="mat-elevation-z8">
        <table mat-table [dataSource]="dataSource" class="w-full">
          <ng-container matColumnDef="name">
            <th mat-header-cell *matHeaderCellDef>Name</th>
            <td mat-cell *matCellDef="let user">{{user.name}}</td>
          </ng-container>

          <ng-container matColumnDef="workouts">
            <th mat-header-cell *matHeaderCellDef>Workouts</th>
            <td mat-cell *matCellDef="let user">
              <div *ngFor="let workout of user.workouts" class="py-1">
                {{workout.type}} - {{workout.minutes}} minutes
              </div>
            </td>
          </ng-container>

          <ng-container matColumnDef="totalMinutes">
            <th mat-header-cell *matHeaderCellDef>Total Minutes</th>
            <td mat-cell *matCellDef="let user">
              {{getTotalMinutes(user)}}
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>

        <mat-paginator [pageSizeOptions]="[5, 10, 25]"
                      showFirstLastButtons
                      aria-label="Select page">
        </mat-paginator>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class WorkoutListComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  
  displayedColumns: string[] = ['name', 'workouts', 'totalMinutes'];
  dataSource: MatTableDataSource<User>;
  workoutTypes = WORKOUT_TYPES;
  users: User[] = [];

  constructor(private workoutService: WorkoutService) {
    this.dataSource = new MatTableDataSource<User>([]);
  }

  ngOnInit(): void {
    this.workoutService.getUsers().subscribe(users => {
      this.users = users;
      this.dataSource.data = users;
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.data = this.workoutService.searchUsers(filterValue);
  }

  filterByType(type: string | null): void {
    this.dataSource.data = type 
      ? this.workoutService.filterByWorkoutType(type)
      : this.users;
  }

  getTotalMinutes(user: User): number {
    return user.workouts.reduce((total, workout) => total + workout.minutes, 0);
  }
}
