import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface WorkoutSessionHistory {
    id: bigint;
    isCompleted: boolean;
    date: bigint;
    name: string;
    exercises: Array<WorkoutExercise>;
}
export interface ExerciseTemplate {
    id: bigint;
    name: string;
    sets: Array<Set_>;
    comments: string;
}
export interface WorkoutSession {
    id: bigint;
    isCompleted: boolean;
    date: bigint;
    name: string;
    exercises: Array<WorkoutExercise>;
}
export interface WorkoutExercise {
    weight: number;
    exerciseId: bigint;
    reps: bigint;
    sets: bigint;
    exerciseName: string;
    comments: string;
}
export interface Set_ {
    weight: bigint;
    reps: bigint;
}
export interface backendInterface {
    addExercise(name: string): Promise<bigint>;
    addExerciseToSession(sessionId: bigint, exerciseId: bigint, weight: number, reps: bigint, sets: bigint, comments: string): Promise<void>;
    createWorkoutSession(name: string, date: bigint): Promise<bigint>;
    deleteExercise(id: bigint): Promise<void>;
    editExercise(id: bigint, newName: string): Promise<void>;
    getAllExercises(): Promise<Array<ExerciseTemplate>>;
    getExerciseLibrarySize(): Promise<bigint>;
    getNextExerciseId(): Promise<bigint>;
    getNextSessionId(): Promise<bigint>;
    getSessionExercises(sessionId: bigint): Promise<Array<WorkoutExercise>>;
    getWorkoutHistory(): Promise<Array<WorkoutSessionHistory>>;
    getWorkoutSessionsByDate(): Promise<Array<WorkoutSession>>;
    removeExerciseFromSession(sessionId: bigint, exerciseIndex: bigint): Promise<void>;
}
