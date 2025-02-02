import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { WorkoutService } from '../../services/workout.service';
import { User, WorkoutType, WORKOUT_TYPES } from '../../interfaces/workout.interface';

Chart.register(...registerables);

@Component({
  selector: 'app-workout-chart',
  template: `
    <div class="p-4">
      <div class="mb-4">
        <h2 class="text-xl font-bold">Workout Progress</h2>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="bg-white p-4 rounded-lg shadow">
          <canvas id="workoutTypeChart"></canvas>
        </div>
        <div class="bg-white p-4 rounded-lg shadow">
          <canvas id="userProgressChart"></canvas>
        </div>
      </div>
    </div>
  `
})
export class WorkoutChartComponent implements OnInit {
  constructor(private workoutService: WorkoutService) {}

  ngOnInit(): void {
    this.workoutService.getUsers().subscribe(users => {
      this.createWorkoutTypeChart(users);
      this.createUserProgressChart(users);
    });
  }

  private createWorkoutTypeChart(users: User[]): void {
    const workoutCounts = WORKOUT_TYPES.reduce((acc, type) => {
      acc[type] = users.reduce((count, user) => 
        count + user.workouts.filter(w => w.type === type).length, 0
      );
      return acc;
    }, {} as Record<WorkoutType, number>);

    new Chart('workoutTypeChart', {
      type: 'pie',
      data: {
        labels: Object.keys(workoutCounts),
        datasets: [{
          data: Object.values(workoutCounts),
          backgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56',
            '#4BC0C0',
            '#9966FF'
          ]
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Workout Type Distribution'
          }
        }
      }
    });
  }

  private createUserProgressChart(users: User[]): void {
    const userData = users.map(user => ({
      name: user.name,
      totalMinutes: user.workouts.reduce((sum, w) => sum + w.minutes, 0)
    }));

    new Chart('userProgressChart', {
      type: 'bar',
      data: {
        labels: userData.map(d => d.name),
        datasets: [{
          label: 'Total Minutes',
          data: userData.map(d => d.totalMinutes),
          backgroundColor: '#36A2EB'
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'User Progress (Total Minutes)'
          }
        },
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }
}
