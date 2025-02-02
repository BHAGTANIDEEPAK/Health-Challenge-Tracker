import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User, Workout } from '../interfaces/workout.interface';

@Injectable({
  providedIn: 'root'
})
export class WorkoutService {
  private readonly STORAGE_KEY = 'userData';
  private usersSubject = new BehaviorSubject<User[]>(this.getInitialData());
  
  constructor() {
    this.initializeData();
  }

  private getInitialData(): User[] {
    return [
      {
        id: 1,
        name: 'John Doe',
        workouts: [
          { type: 'Running', minutes: 30 },
          { type: 'Cycling', minutes: 45 }
        ]
      },
      {
        id: 2,
        name: 'Jane Smith',
        workouts: [
          { type: 'Swimming', minutes: 60 },
          { type: 'Running', minutes: 20 }
        ]
      },
      {
        id: 3,
        name: 'Mike Johnson',
        workouts: [
          { type: 'Yoga', minutes: 50 },
          { type: 'Cycling', minutes: 40 }
        ]
      }
    ];
  }

  private initializeData(): void {
    const storedData = localStorage.getItem(this.STORAGE_KEY);
    if (!storedData) {
      const initialData = this.getInitialData();
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(initialData));
      this.usersSubject.next(initialData);
    } else {
      this.usersSubject.next(JSON.parse(storedData));
    }
  }

  getUsers(): Observable<User[]> {
    return this.usersSubject.asObservable();
  }

  addWorkout(name: string, workout: Workout): void {
    const users = this.usersSubject.value;
    let user = users.find(u => u.name.toLowerCase() === name.toLowerCase());
    
    if (user) {
      user.workouts.push(workout);
    } else {
      user = {
        id: Math.max(...users.map(u => u.id), 0) + 1,
        name,
        workouts: [workout]
      };
      users.push(user);
    }
    
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(users));
    this.usersSubject.next(users);
  }

  searchUsers(query: string): User[] {
    return this.usersSubject.value.filter(user => 
      user.name.toLowerCase().includes(query.toLowerCase())
    );
  }

  filterByWorkoutType(type: string): User[] {
    return this.usersSubject.value.filter(user =>
      user.workouts.some(workout => workout.type === type)
    );
  }
}
