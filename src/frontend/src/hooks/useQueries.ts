import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { ExerciseTemplate, WorkoutSession, WorkoutSessionHistory } from '@/backend';

export function useExercises() {
  const { actor, isFetching } = useActor();

  return useQuery<ExerciseTemplate[]>({
    queryKey: ['exercises'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllExercises();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddExercise() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (name: string) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.addExercise(name);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exercises'] });
    },
  });
}

export function useEditExercise() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, newName }: { id: bigint; newName: string }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.editExercise(id, newName);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exercises'] });
    },
  });
}

export function useDeleteExercise() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.deleteExercise(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exercises'] });
    },
  });
}

export function useCreateWorkoutSession() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ name, date }: { name: string; date: bigint }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.createWorkoutSession(name, date);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
    },
  });
}

export function useCompleteSession() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      sessionId,
      exercises,
    }: {
      sessionId: bigint;
      exercises: Array<{
        exerciseId: bigint;
        exerciseName: string;
        sets: Array<{ weight: number; reps: bigint }>;
        comments: string;
      }>;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      
      // Add all exercises to the session
      for (const exercise of exercises) {
        // Calculate averages for the backend format
        const avgWeight = exercise.sets.reduce((sum, set) => sum + set.weight, 0) / exercise.sets.length;
        const avgReps = exercise.sets.reduce((sum, set) => Number(set.reps), 0) / exercise.sets.length;
        
        await actor.addExerciseToSession(
          sessionId,
          exercise.exerciseId,
          avgWeight,
          BigInt(Math.round(avgReps)),
          BigInt(exercise.sets.length),
          exercise.comments
        );
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['history'] });
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
    },
  });
}

export function useAddExerciseToSession() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      sessionId,
      exerciseId,
      weight,
      reps,
      sets,
      comments,
    }: {
      sessionId: bigint;
      exerciseId: bigint;
      weight: number;
      reps: bigint;
      sets: bigint;
      comments: string;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.addExerciseToSession(sessionId, exerciseId, weight, reps, sets, comments);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['session', variables.sessionId.toString()] });
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
      queryClient.invalidateQueries({ queryKey: ['history'] });
    },
  });
}

export function useWorkoutSession(sessionId: bigint) {
  const { actor, isFetching } = useActor();

  return useQuery<WorkoutSession>({
    queryKey: ['session', sessionId.toString()],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not initialized');
      const sessions = await actor.getWorkoutSessionsByDate();
      const session = sessions.find((s) => s.id === sessionId);
      if (!session) throw new Error('Session not found');
      return session;
    },
    enabled: !!actor && !isFetching,
  });
}

export function useWorkoutHistory() {
  const { actor, isFetching } = useActor();

  return useQuery<WorkoutSessionHistory[]>({
    queryKey: ['history'],
    queryFn: async () => {
      if (!actor) return [];
      const history = await actor.getWorkoutHistory();
      return history.sort((a, b) => Number(b.date) - Number(a.date));
    },
    enabled: !!actor && !isFetching,
  });
}
