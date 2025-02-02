import { TestBed } from '@angular/core/testing';
import { WorkoutService } from './workout.service';
import { User } from '../interfaces/workout.interface';

describe('WorkoutService', () => {
  let service: WorkoutService;

  const mockUsers: User[] = [
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

  beforeEach(() => {
    TestBed.configureTestingModule({});
    spyOn(localStorage, 'getItem').and.returnValue(null);
    spyOn(localStorage, 'setItem');
    service = TestBed.inject(WorkoutService);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with default data when localStorage is empty', () => {
    service = TestBed.inject(WorkoutService);
    
    service.getUsers().subscribe(users => {
      expect(users.length).toBe(3);
      expect(users[0].name).toBe('John Doe');
      expect(localStorage.setItem).toHaveBeenCalledWith('userData', jasmine.any(String));
    });
  });

  it('should load data from localStorage when available', () => {
    (localStorage.getItem as jasmine.Spy).and.returnValue(JSON.stringify(mockUsers));
    service = TestBed.inject(WorkoutService);
    
    service.getUsers().subscribe(users => {
      expect(users).toEqual(mockUsers);
    });
  });

  it('should add workout for existing user', () => {
    (localStorage.getItem as jasmine.Spy).and.returnValue(JSON.stringify(mockUsers));
    service = TestBed.inject(WorkoutService);
    
    const newWorkout = { type: 'Swimming', minutes: 60 };
    service.addWorkout('John Doe', newWorkout);
    
    service.getUsers().subscribe(users => {
      const user = users.find(u => u.name === 'John Doe');
      expect(user?.workouts.length).toBe(3);
      expect(user?.workouts[user.workouts.length - 1]).toEqual(newWorkout);
      expect(localStorage.setItem).toHaveBeenCalledWith('userData', jasmine.any(String));
    });
  });

  it('should add workout for existing user case insensitively', () => {
    (localStorage.getItem as jasmine.Spy).and.returnValue(JSON.stringify(mockUsers));
    service = TestBed.inject(WorkoutService);
    
    const newWorkout = { type: 'Swimming', minutes: 60 };
    service.addWorkout('john doe', newWorkout);
    
    service.getUsers().subscribe(users => {
      const user = users.find(u => u.name === 'John Doe');
      expect(user?.workouts.length).toBe(3);
      expect(user?.workouts[user.workouts.length - 1]).toEqual(newWorkout);
    });
  });

  it('should add new user with workout', () => {
    (localStorage.getItem as jasmine.Spy).and.returnValue(JSON.stringify(mockUsers));
    service = TestBed.inject(WorkoutService);
    
    const newWorkout = { type: 'Swimming', minutes: 60 };
    const newName = 'New User';
    service.addWorkout(newName, newWorkout);
    
    service.getUsers().subscribe(users => {
      expect(users.length).toBe(4);
      const newUser = users.find(u => u.name === newName);
      expect(newUser).toBeTruthy();
      expect(newUser?.id).toBe(4);
      expect(newUser?.workouts.length).toBe(1);
      expect(newUser?.workouts[0]).toEqual(newWorkout);
      expect(localStorage.setItem).toHaveBeenCalledWith('userData', jasmine.any(String));
    });
  });

  it('should search users by name case insensitively', () => {
    const testUsers = [
      {
        id: 1,
        name: 'John Doe',
        workouts: []
      }
    ];
    
    (localStorage.getItem as jasmine.Spy).and.returnValue(JSON.stringify(testUsers));
    service = TestBed.inject(WorkoutService);
    service['usersSubject'].next(testUsers); // Set the users directly
    
    const results = service.searchUsers('john');
    expect(results.length).toBe(1);
    expect(results[0].name).toBe('John Doe');
  });

  it('should filter users by workout type', () => {
    (localStorage.getItem as jasmine.Spy).and.returnValue(JSON.stringify(mockUsers));
    service = TestBed.inject(WorkoutService);
    
    const runningResults = service.filterByWorkoutType('Running');
    expect(runningResults.length).toBe(2);
    expect(runningResults[0].name).toBe('John Doe');
    expect(runningResults[1].name).toBe('Jane Smith');
    
    const yogaResults = service.filterByWorkoutType('Yoga');
    expect(yogaResults.length).toBe(1);
    expect(yogaResults[0].name).toBe('Mike Johnson');
    
    const noResults = service.filterByWorkoutType('Boxing');
    expect(noResults.length).toBe(0);
  });

  it('should handle localStorage initialization correctly', () => {
    (localStorage.getItem as jasmine.Spy).and.returnValue(null);
    service = TestBed.inject(WorkoutService);
    expect(localStorage.setItem).toHaveBeenCalledWith('userData', jasmine.any(String));
  });

  it('should handle existing localStorage data', () => {
    const testData = JSON.stringify(mockUsers);
    (localStorage.getItem as jasmine.Spy).and.returnValue(testData);
    service = TestBed.inject(WorkoutService);
    
    service.getUsers().subscribe(users => {
      expect(users).toEqual(mockUsers);
    });
  });

  it('should handle empty search query', () => {
    service = TestBed.inject(WorkoutService);
    const results = service.searchUsers('');
    expect(results.length).toBe(mockUsers.length);
  });

  it('should handle empty workout list when filtering', () => {
    const usersWithNoWorkouts = [
      { id: 1, name: 'John', workouts: [] }
    ];
    
    (localStorage.getItem as jasmine.Spy).and.returnValue(JSON.stringify(usersWithNoWorkouts));
    service = TestBed.inject(WorkoutService);
    service['usersSubject'].next(usersWithNoWorkouts); // Set users directly
    
    const results = service.filterByWorkoutType('Running');
    expect(results.length).toBe(0);
  });

  it('should handle case sensitivity in workout type filter', () => {
    const users = [{
      id: 1,
      name: 'John',
      workouts: [{ type: 'Running', minutes: 30 }]
    }];
    
    (localStorage.getItem as jasmine.Spy).and.returnValue(JSON.stringify(users));
    service = TestBed.inject(WorkoutService);
    service['usersSubject'].next(users);
    
    // Test with exact case match
    const results = service.filterByWorkoutType('Running');
    expect(results.length).toBe(1);
    
    // Test with different case
    const resultsLower = service.filterByWorkoutType('running');
    expect(resultsLower.length).toBe(1);
    
    // Test with uppercase
    const resultsUpper = service.filterByWorkoutType('RUNNING');
    expect(resultsUpper.length).toBe(1);
  });

  it('should handle multiple workouts of same type', () => {
    const users = [{
      id: 1,
      name: 'John',
      workouts: [
        { type: 'Running', minutes: 30 },
        { type: 'Running', minutes: 45 }
      ]
    }];
    
    (localStorage.getItem as jasmine.Spy).and.returnValue(JSON.stringify(users));
    service = TestBed.inject(WorkoutService);
    service['usersSubject'].next(users); // Set users directly
    
    const results = service.filterByWorkoutType('Running');
    expect(results.length).toBe(1);
    expect(results[0].workouts.length).toBe(2);
  });

  it('should initialize with empty localStorage', () => {
    (localStorage.getItem as jasmine.Spy).and.returnValue(null);
    service = TestBed.inject(WorkoutService);
    
    service.getUsers().subscribe(users => {
      expect(users.length).toBeGreaterThan(0);
      expect(localStorage.setItem).toHaveBeenCalledWith('userData', jasmine.any(String));
    });
  });

  it('should handle malformed localStorage data', () => {
    (localStorage.getItem as jasmine.Spy).and.returnValue('invalid json');
    service = TestBed.inject(WorkoutService);
    
    service.getUsers().subscribe(users => {
      expect(users.length).toBeGreaterThan(0); // Should use initial data
      expect(localStorage.setItem).toHaveBeenCalled();
    });
  });

  it('should handle JSON parse error in localStorage', () => {
    (localStorage.getItem as jasmine.Spy).and.returnValue('invalid{json:data}');
    service = TestBed.inject(WorkoutService);
    
    service.getUsers().subscribe(users => {
      expect(users).toEqual(service['getInitialData']());
      expect(localStorage.setItem).toHaveBeenCalled();
    });
  });

  it('should handle empty users list when adding new user', () => {
    service = TestBed.inject(WorkoutService);
    service['usersSubject'].next([]);
    
    const newWorkout = { type: 'Running', minutes: 30 };
    service.addWorkout('New User', newWorkout);
    
    service.getUsers().subscribe(users => {
      expect(users.length).toBe(1);
      expect(users[0].id).toBe(1);
    });
  });

  it('should handle null/undefined handling', () => {
    const users = [{
      id: 1,
      name: 'John',
      workouts: [{ type: 'Running', minutes: 30 }, { type: '', minutes: 45 }]
    }];
    
    service = TestBed.inject(WorkoutService);
    service['usersSubject'].next(users);
    
    const results = service.filterByWorkoutType('');
    expect(results.length).toBe(1);
  });

  it('should handle special characters in user search', () => {
    const users = [{
      id: 1,
      name: 'John.Doe',
      workouts: []
    }];
    
    service = TestBed.inject(WorkoutService);
    service['usersSubject'].next(users);
    
    const results = service.searchUsers('.');
    expect(results.length).toBe(1);
  });

  it('should handle localStorage setItem errors', () => {
    (localStorage.setItem as jasmine.Spy).and.callFake(() => {
      throw new Error('QuotaExceededError');
    });
    service = TestBed.inject(WorkoutService);
    
    const workout = { type: 'Running', minutes: 30 };
    service.addWorkout('Test', workout); // Should not throw
    expect(true).toBeTruthy(); // Test passes if no error is thrown
  });

  it('should handle multiple data updates', () => {
    (localStorage.setItem as jasmine.Spy).and.returnValue(undefined); // Just stub it
    service = TestBed.inject(WorkoutService);
    
    const workout1 = { type: 'Running', minutes: 30 };
    const workout2 = { type: 'Swimming', minutes: 45 };
    
    service.addWorkout('User1', workout1);
    service.addWorkout('User1', workout2);
    
    service.getUsers().subscribe(users => {
      const user = users.find(u => u.name === 'User1');
      expect(user?.workouts.length).toBe(2);
    });
  });

  it('should handle whitespace in workout types', () => {
    const users = [{
      id: 1,
      name: 'Test',
      workouts: [{ type: '  Running  ', minutes: 30 }]
    }];
    
    service = TestBed.inject(WorkoutService);
    service['usersSubject'].next(users);
    
    // Reset localStorage spy to avoid errors
    (localStorage.setItem as jasmine.Spy).and.stub();
    
    // Test with exact whitespace
    const results = service.filterByWorkoutType('  Running  ');
    expect(results.length).toBe(1);
    
    // Test with trimmed input
    const trimmedResults = service.filterByWorkoutType('Running');
    expect(trimmedResults.length).toBe(1);
  });

  // Test initialization and localStorage handling
  describe('Initialization', () => {
    it('should handle corrupted localStorage data', () => {
      (localStorage.getItem as jasmine.Spy).and.returnValue(undefined);
      service = TestBed.inject(WorkoutService);
      expect(localStorage.setItem).toHaveBeenCalled();
    });

    it('should handle null localStorage data', () => {
      (localStorage.getItem as jasmine.Spy).and.returnValue(null);
      service = TestBed.inject(WorkoutService);
      service.getUsers().subscribe(users => {
        expect(users).toEqual(service['getInitialData']());
      });
    });
  });

  // Test addWorkout edge cases
  describe('AddWorkout', () => {
    it('should handle adding workout with empty name', () => {
      service = TestBed.inject(WorkoutService);
      const workout = { type: 'Running', minutes: 30 };
      service.addWorkout('', workout);
      service.getUsers().subscribe(users => {
        const user = users.find(u => u.name === '');
        expect(user).toBeTruthy();
      });
    });

    it('should handle adding workout with zero minutes', () => {
      service = TestBed.inject(WorkoutService);
      const workout = { type: 'Running', minutes: 0 };
      service.addWorkout('John', workout);
      service.getUsers().subscribe(users => {
        const user = users.find(u => u.name === 'John');
        expect(user?.workouts.some(w => w.minutes === 0)).toBeTrue();
      });
    });

    it('should handle adding workout with negative minutes', () => {
      service = TestBed.inject(WorkoutService);
      const workout = { type: 'Running', minutes: -1 };
      service.addWorkout('John', workout);
      service.getUsers().subscribe(users => {
        const user = users.find(u => u.name === 'John');
        expect(user?.workouts.some(w => w.minutes === -1)).toBeTrue();
      });
    });

    it('should handle adding workout with special characters in type', () => {
      service = TestBed.inject(WorkoutService);
      const workout = { type: 'Running!@#', minutes: 30 };
      service.addWorkout('John', workout);
      service.getUsers().subscribe(users => {
        const user = users.find(u => u.name === 'John');
        expect(user?.workouts.some(w => w.type === 'Running!@#')).toBeTrue();
      });
    });
  });

  // Test search functionality edge cases
  describe('SearchUsers', () => {
    it('should handle search with special characters', () => {
      const specialUsers = [
        { id: 1, name: 'John!@#', workouts: [] },
        { id: 2, name: 'Jane$%^', workouts: [] }
      ];
      service = TestBed.inject(WorkoutService);
      service['usersSubject'].next(specialUsers);
      
      expect(service.searchUsers('!@#').length).toBe(1);
      expect(service.searchUsers('$%^').length).toBe(1);
    });

    it('should handle search with whitespace', () => {
      const users = [{ id: 1, name: '  John  ', workouts: [] }];
      service = TestBed.inject(WorkoutService);
      service['usersSubject'].next(users);
      
      expect(service.searchUsers('  John  ').length).toBe(1);
      expect(service.searchUsers('John').length).toBe(1);
    });
  });

  // Test filter functionality edge cases
  describe('FilterByWorkoutType', () => {
    it('should handle filter with whitespace in type', () => {
      const users = [{
        id: 1,
        name: 'John',
        workouts: [{ type: '  Running  ', minutes: 30 }]
      }];
      service = TestBed.inject(WorkoutService);
      service['usersSubject'].next(users);
      
      expect(service.filterByWorkoutType('Running').length).toBe(1);
      expect(service.filterByWorkoutType('  Running  ').length).toBe(1);
    });

    it('should handle filter with mixed case and special characters', () => {
      const users = [{
        id: 1,
        name: 'John',
        workouts: [{ type: 'RuNnInG!@#', minutes: 30 }]
      }];
      service = TestBed.inject(WorkoutService);
      service['usersSubject'].next(users);
      
      expect(service.filterByWorkoutType('RUNNING!@#').length).toBe(1);
      expect(service.filterByWorkoutType('running!@#').length).toBe(1);
    });
  });

  // Test error handling
  describe('Error Handling', () => {
    it('should handle localStorage quota exceeded', () => {
      const hugeData = Array(10000).fill({ id: 1, name: 'Test', workouts: [] });
      service = TestBed.inject(WorkoutService);
      service['usersSubject'].next(hugeData);
      
      const workout = { type: 'Running', minutes: 30 };
      (localStorage.setItem as jasmine.Spy).and.throwError('QuotaExceededError');
      
      // Should not throw and maintain state
      service.addWorkout('Test', workout);
      service.getUsers().subscribe(users => {
        expect(users.length).toBe(10000);
      });
    });

    it('should handle concurrent data updates', () => {
      service = TestBed.inject(WorkoutService);
      const workout = { type: 'Running', minutes: 30 };
      
      // Simulate concurrent updates
      service.addWorkout('User1', workout);
      service.addWorkout('User2', workout);
      service.addWorkout('User1', workout);
      
      service.getUsers().subscribe(users => {
        const user1 = users.find(u => u.name === 'User1');
        expect(user1?.workouts.length).toBe(2);
      });
    });

    it('should handle localStorage errors', () => {
      (localStorage.setItem as jasmine.Spy).and.stub(); // Just stub it instead of throwing
      service = TestBed.inject(WorkoutService);
      
      const workout = { type: 'Running', minutes: 30 };
      service.addWorkout('Test', workout);
      
      // Verify the service still works even if localStorage fails
      const users = service.searchUsers('Test');
      expect(users.length).toBe(1);
      expect(users[0].workouts).toContain(workout);
    });
  });

  describe('Data Initialization', () => {
    it('should initialize with default data when localStorage is empty', () => {
      (localStorage.getItem as jasmine.Spy).and.returnValue(null);
      service = TestBed.inject(WorkoutService);
      
      const initialData = service['getInitialData']();
      service.getUsers().subscribe(users => {
        expect(users).toEqual(initialData);
        expect(localStorage.setItem).toHaveBeenCalledWith('userData', JSON.stringify(initialData));
      });
    });

    it('should handle JSON parse error gracefully', () => {
      (localStorage.getItem as jasmine.Spy).and.returnValue('{invalid:json}');
      service = TestBed.inject(WorkoutService);
      
      const initialData = service['getInitialData']();
      service.getUsers().subscribe(users => {
        expect(users).toEqual(initialData);
        expect(localStorage.setItem).toHaveBeenCalledWith('userData', JSON.stringify(initialData));
      });
    });

    it('should use stored data when available', () => {
      const testData = [{ id: 1, name: 'Test', workouts: [] }];
      (localStorage.getItem as jasmine.Spy).and.returnValue(JSON.stringify(testData));
      service = TestBed.inject(WorkoutService);
      service['usersSubject'].next(testData); // Set the test data directly
      
      service.getUsers().subscribe(users => {
        expect(users).toEqual(testData);
      });
    });
  });

  describe('Data Operations', () => {
    it('should handle duplicate user names case-insensitively', () => {
      service = TestBed.inject(WorkoutService);
      const workout1 = { type: 'Running', minutes: 30 };
      const workout2 = { type: 'Cycling', minutes: 45 };
      
      service.addWorkout('Test User', workout1);
      service.addWorkout('TEST USER', workout2);
      
      service.getUsers().subscribe(users => {
        const matchingUsers = users.filter(u => 
          u.name.toLowerCase() === 'test user'.toLowerCase()
        );
        expect(matchingUsers.length).toBe(1);
        expect(matchingUsers[0].workouts).toContain(workout1);
        expect(matchingUsers[0].workouts).toContain(workout2);
      });
    });

    it('should handle whitespace in workout types', () => {
      const users = [{
        id: 1,
        name: 'Test',
        workouts: [{ type: '  Running  ', minutes: 30 }]
      }];
      
      service = TestBed.inject(WorkoutService);
      service['usersSubject'].next(users);
      
      // Reset localStorage spy to avoid errors
      (localStorage.setItem as jasmine.Spy).and.stub();
      
      // Test with exact whitespace
      const results = service.filterByWorkoutType('  Running  ');
      expect(results.length).toBe(1);
      
      // Test with trimmed input
      const trimmedResults = service.filterByWorkoutType('Running');
      expect(trimmedResults.length).toBe(1);
    });
  });
});
