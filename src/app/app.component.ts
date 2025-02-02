import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <div class="min-h-screen bg-gray-100">
      <header class="bg-white shadow">
        <div class="max-w-7xl mx-auto py-6 px-4">
          <h1 class="text-3xl font-bold text-gray-900">
            Health Challenge Tracker
          </h1>
        </div>
      </header>

      <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div class="px-4 py-6 sm:px-0">
          <app-workout-form></app-workout-form>
          <div class="mt-8">
            <app-workout-list></app-workout-list>
          </div>
          <div class="mt-8">
            <app-workout-chart></app-workout-chart>
          </div>
        </div>
      </main>
    </div>
  `,
  styles: []
})
export class AppComponent {
  title = 'health-challenge-tracker';
}
