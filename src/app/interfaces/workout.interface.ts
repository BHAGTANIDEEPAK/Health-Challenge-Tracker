export interface Workout {
  type: string;
  minutes: number;
}

export interface User {
  id: number;
  name: string;
  workouts: Workout[];
}

export const WORKOUT_TYPES = ['Running', 'Cycling', 'Swimming', 'Yoga', 'Weight Training'] as const;
export type WorkoutType = typeof WORKOUT_TYPES[number];
