import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearch } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useWorkoutSession, useCompleteSession, useExercises } from '@/hooks/useQueries';
import ExerciseTracker from '@/components/ExerciseTracker';
import { Loader2, Save, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import type { ExerciseTemplate } from '@/backend';

interface ExerciseData {
  exercise: ExerciseTemplate;
  sets: Array<{ weight: string; reps: string }>;
  comments: string;
}

interface PersistedSessionData {
  sessionId: string;
  exerciseIds: string[];
  exercisesData: ExerciseData[];
}

const STORAGE_KEY = 'activeWorkoutSession';

export default function ActiveWorkout() {
  const { sessionId } = useParams({ from: '/workout/$sessionId' });
  const search = useSearch({ from: '/workout/$sessionId' });
  const navigate = useNavigate();
  const { data: session, isLoading: sessionLoading } = useWorkoutSession(BigInt(sessionId));
  const { data: allExercises, isLoading: exercisesLoading } = useExercises();
  const completeSession = useCompleteSession();

  const [exercisesData, setExercisesData] = useState<ExerciseData[]>([]);
  const [isRestoringFromStorage, setIsRestoringFromStorage] = useState(true);

  // Restore session from localStorage on mount
  useEffect(() => {
    if (!allExercises || allExercises.length === 0) {
      return;
    }

    try {
      const storedData = localStorage.getItem(STORAGE_KEY);
      
      if (storedData) {
        const parsed: PersistedSessionData = JSON.parse(storedData);
        
        // Only restore if it matches the current session
        if (parsed.sessionId === sessionId) {
          // Reconstruct exercise data with current exercise templates
          const restoredData: ExerciseData[] = parsed.exercisesData.map(data => {
            const exercise = allExercises.find(ex => ex.id === data.exercise.id);
            if (exercise) {
              return {
                exercise,
                sets: data.sets,
                comments: data.comments,
              };
            }
            return data;
          });
          
          setExercisesData(restoredData);
          setIsRestoringFromStorage(false);
          return;
        }
      }
    } catch (error) {
      console.error('Failed to restore session from localStorage:', error);
    }

    // If no localStorage data or different session, load from URL params
    const exerciseIdsParam = search.exerciseIds;
    
    if (exerciseIdsParam && allExercises && allExercises.length > 0) {
      const exerciseIds = exerciseIdsParam.split(',').map(id => BigInt(id));
      const selectedExercises = exerciseIds
        .map(id => allExercises.find(ex => ex.id === id))
        .filter((ex): ex is ExerciseTemplate => ex !== undefined);
      
      if (selectedExercises.length > 0) {
        const initialData: ExerciseData[] = selectedExercises.map((ex) => ({
          exercise: ex,
          sets: ex.sets.map((set) => ({
            weight: set.weight.toString(),
            reps: set.reps.toString(),
          })),
          comments: ex.comments,
        }));
        setExercisesData(initialData);
      }
    }
    
    setIsRestoringFromStorage(false);
  }, [sessionId, search.exerciseIds, allExercises]);

  // Persist session to localStorage whenever data changes
  useEffect(() => {
    if (isRestoringFromStorage || exercisesData.length === 0) {
      return;
    }

    try {
      const exerciseIds = exercisesData.map(data => data.exercise.id.toString());
      
      const dataToStore: PersistedSessionData = {
        sessionId,
        exerciseIds,
        exercisesData,
      };
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToStore));
    } catch (error) {
      console.error('Failed to persist session to localStorage:', error);
    }
  }, [sessionId, exercisesData, isRestoringFromStorage]);

  const handleSetChange = (exerciseIndex: number, setIndex: number, field: 'weight' | 'reps', value: string) => {
    setExercisesData((prev) => {
      const newData = [...prev];
      newData[exerciseIndex].sets[setIndex][field] = value;
      return newData;
    });
  };

  const handleCommentsChange = (exerciseIndex: number, value: string) => {
    setExercisesData((prev) => {
      const newData = [...prev];
      newData[exerciseIndex].comments = value;
      return newData;
    });
  };

  const handleSaveSession = async () => {
    // Check if at least one exercise has data entered
    const hasData = exercisesData.some(ex => 
      ex.sets.some(set => set.weight || set.reps) || ex.comments
    );
    
    if (!hasData) {
      toast.error('Please enter data for at least one exercise before saving');
      return;
    }

    try {
      const exercises = exercisesData.map(exerciseData => ({
        exerciseId: exerciseData.exercise.id,
        exerciseName: exerciseData.exercise.name,
        sets: exerciseData.sets.map(set => ({
          weight: parseFloat(set.weight) || 0,
          reps: BigInt(parseInt(set.reps) || 0),
        })),
        comments: exerciseData.comments,
      }));

      await completeSession.mutateAsync({
        sessionId: BigInt(sessionId),
        exercises,
      });

      toast.success('Workout session saved successfully!');
      
      // Clear localStorage after successful save
      localStorage.removeItem(STORAGE_KEY);
      
      // Clear the workout state
      if (allExercises) {
        const exerciseIdsParam = search.exerciseIds;
        if (exerciseIdsParam) {
          const exerciseIds = exerciseIdsParam.split(',').map(id => BigInt(id));
          const selectedExercises = exerciseIds
            .map(id => allExercises.find(ex => ex.id === id))
            .filter((ex): ex is ExerciseTemplate => ex !== undefined);
          
          // Reset to default template values
          const clearedData: ExerciseData[] = selectedExercises.map((ex) => ({
            exercise: ex,
            sets: ex.sets.map((set) => ({
              weight: set.weight.toString(),
              reps: set.reps.toString(),
            })),
            comments: ex.comments,
          }));
          setExercisesData(clearedData);
        }
      }
      
      // Navigate to history
      navigate({ to: '/history' });
    } catch (error) {
      console.error('Failed to save session:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to save workout session';
      toast.error(errorMessage);
    }
  };

  if (sessionLoading || exercisesLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Session not found</p>
      </div>
    );
  }

  const hasAnyData = exercisesData.some(ex => 
    ex.sets.some(set => set.weight || set.reps) || ex.comments
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{session.name}</h1>
        <p className="text-muted-foreground mt-1">
          Track your exercises and save when complete
        </p>
      </div>

      {completeSession.isError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error saving session</AlertTitle>
          <AlertDescription>
            {completeSession.error instanceof Error 
              ? completeSession.error.message 
              : 'An unexpected error occurred. Please try again.'}
          </AlertDescription>
        </Alert>
      )}

      {exercisesData.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <p>No exercises added to this session yet.</p>
            <p className="text-sm mt-1">Go back and add exercises to get started.</p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="space-y-3">
            {exercisesData.map((exerciseData, index) => (
              <ExerciseTracker
                key={`${exerciseData.exercise.id}-${index}`}
                exercise={exerciseData.exercise}
                sets={exerciseData.sets}
                comments={exerciseData.comments}
                onSetChange={(setIndex, field, value) => handleSetChange(index, setIndex, field, value)}
                onCommentsChange={(value) => handleCommentsChange(index, value)}
              />
            ))}
          </div>

          <Card className="bg-gradient-to-br from-amber-500/5 to-orange-600/5 border-amber-500/20 sticky bottom-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Save className="h-5 w-5 text-amber-500" />
                Save Session
              </CardTitle>
              <CardDescription>
                {hasAnyData 
                  ? 'Save all exercises in this workout session to your history'
                  : 'Enter data for at least one exercise to save your session'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => navigate({ to: '/' })}
                  disabled={completeSession.isPending}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700"
                  onClick={handleSaveSession}
                  disabled={completeSession.isPending || !hasAnyData}
                >
                  {completeSession.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Session
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
