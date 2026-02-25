import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { ExerciseTemplate, WorkoutSession, WorkoutSessionHistory } from '@/backend';

export function useExercises() {
  const { actor, isFetching } = useActor();

  return useQuery<ExerciseTemplate[]>({
    queryKey: ['exercises'],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getAllExercises();
      } catch (error) {
        // If the user doesn't exist yet on the backend (first login),
        // return an empty array rather than propagating the trap error.
        console.warn('getAllExercises error (may be first login):', error);
        return [];
      }
    },
    // Only run when actor is fully initialized (not still fetching)
    enabled: !!actor && !isFetching,
    // Treat a disabled query as having empty data rather than staying in loading state
    placeholderData: [],
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
    onError: (error) => {
      console.error('addExercise mutation error:', error);
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
    onError: (error) => {
      console.error('editExercise mutation error:', error);
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
    onError: (error) => {
      console.error('deleteExercise mutation error:', error);
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
      try {
        // getWorkoutHistory only returns sessions with isCompleted=true.
        // Since the backend has no completeWorkoutSession endpoint, we fall back
        // to getWorkoutSessionsByDate and surface all sessions that have at least
        // one exercise recorded (i.e. the user actually saved data to them).
        const allSessions = await actor.getWorkoutSessionsByDate();
        const savedSessions = allSessions.filter((s) => s.exercises.length > 0);
        // Map WorkoutSession → WorkoutSessionHistory shape (identical fields)
        const history: WorkoutSessionHistory[] = savedSessions.map((s) => ({
          id: s.id,
          name: s.name,
          date: s.date,
          exercises: s.exercises,
          isCompleted: s.isCompleted,
        }));
        // Sort most-recent first
        return history.sort((a, b) => Number(b.date) - Number(a.date));
      } catch (error) {
        console.warn('getWorkoutSessionsByDate error:', error);
        return [];
      }
    },
    enabled: !!actor && !isFetching,
    placeholderData: [],
  });
}
