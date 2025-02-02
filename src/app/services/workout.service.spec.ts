import { TestBed } from '@angular/core/testing';
import { WorkoutService } from './workout.service';
import { User } from '../interfaces/workout.interface';

describe('WorkoutService', () => {
  let service: WorkoutService;
  let localStorageSpy: jest.SpyInstance;

  const mockUsers: User[] = [
    {
      id: 1,
      name: 'John Doe',
      workouts: [
        { type: 'Running', minutes: 30 },
        { type: 'Cycling', minutes: 45 }
      ]
    }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WorkoutService);
    localStorageSpy = jest.spyOn(localStorage, 'getItem');
  });

  afterEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with default data when localStorage is empty', () => {
    localStorageSpy.mockReturnValue(null);
    service = TestBed.inject(WorkoutService);
    
    service.getUsers().subscribe(users => {
      expect(users.length).toBe(3);
      expect(users[0].name).toBe('John Doe');
    });
  });

  it('should load data from localStorage when available', () => {
    localStorage.setItem('userData', JSON.stringify(mockUsers));
    service = TestBed.inject(WorkoutService);
    
    service.getUsers().subscribe(users => {
      expect(users).toEqual(mockUsers);
    });
  });

  it('should add workout for existing user', () => {
    localStorage.setItem('userData', JSON.stringify(mockUsers));
    service = TestBed.inject(WorkoutService);
    
    const newWorkout = { type: 'Swimming', minutes: 60 };
    service.addWorkout('John Doe', newWorkout);
    
    service.getUsers().subscribe(users => {
      const user = users.find(u => u.name === 'John Doe');
      expect(user?.workouts.length).toBe(3);
      expect(user?.workouts).toContainEqual(newWorkout);
    });
  });

  it('should add new user with workout', () => {
    localStorage.setItem('userData', JSON.stringify(mockUsers));
    service = TestBed.inject(WorkoutService);
    
    const newWorkout = { type: 'Swimming', minutes: 60 };
    service.addWorkout('Jane Smith', newWorkout);
    
    service.getUsers().subscribe(users => {
      expect(users.length).toBe(2);
      const newUser = users.find(u => u.name === 'Jane Smith');
      expect(newUser?.workouts).toContainEqual(newWorkout);
    });
  });

  it('should search users by name', () => {
    localStorage.setItem('userData', JSON.stringify(mockUsers));
    service = TestBed.inject(WorkoutService);
    
    const results = service.searchUsers('john');
    expect(results.length).toBe(1);
    expect(results[0].name).toBe('John Doe');
    
    const noResults = service.searchUsers('xyz');
    expect(noResults.length).toBe(0);
  });

  it('should filter users by workout type', () => {
    localStorage.setItem('userData', JSON.stringify(mockUsers));
    service = TestBed.inject(WorkoutService);
    
    const results = service.filterByWorkoutType('Running');
    expect(results.length).toBe(1);
    expect(results[0].name).toBe('John Doe');
    
    const noResults = service.filterByWorkoutType('Swimming');
    expect(noResults.length).toBe(0);
  });
});
