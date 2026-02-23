import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearch } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useWorkoutSession, useAddExerciseToSession, useExercises } from '@/hooks/useQueries';
import ExerciseTracker from '@/components/ExerciseTracker';
import { Loader2, Save } from 'lucide-react';
import { toast } from 'sonner';
import type { ExerciseTemplate } from '@/backend';

interface ExerciseData {
  exercise: ExerciseTemplate;
  sets: Array<{ weight: string; reps: string }>;
  comments: string;
  isCompleted: boolean;
}

export default function ActiveWorkout() {
  const { sessionId } = useParams({ from: '/workout/$sessionId' });
  const search = useSearch({ from: '/workout/$sessionId' });
  const navigate = useNavigate();
  const { data: session, isLoading: sessionLoading } = useWorkoutSession(BigInt(sessionId));
  const { data: allExercises, isLoading: exercisesLoading } = useExercises();
  const addExerciseToSession = useAddExerciseToSession();

  const [exercisesData, setExercisesData] = useState<ExerciseData[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Get exercise IDs from search params
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
          isCompleted: false,
        }));
        setExercisesData(initialData);
      }
    }
  }, [search.exerciseIds, allExercises]);

  const handleExerciseComplete = (index: number, data: { sets: Array<{ weight: string; reps: string }>; comments: string }) => {
    setExercisesData((prev) => {
      const newData = [...prev];
      newData[index] = { 
        ...newData[index], 
        sets: data.sets,
        comments: data.comments,
        isCompleted: true 
      };
      return newData;
    });
    toast.success(`${exercisesData[index].exercise.name} completed!`);
  };

  const handleSaveWorkout = async () => {
    const completedExercises = exercisesData.filter(ex => ex.isCompleted);
    
    if (completedExercises.length === 0) {
      toast.error('Please complete at least one exercise before saving');
      return;
    }

    setIsSaving(true);
    try {
      for (const exerciseData of completedExercises) {
        const avgWeight = exerciseData.sets.reduce((sum, set) => {
          const weight = parseFloat(set.weight) || 0;
          return sum + weight;
        }, 0) / 3;

        const avgReps = exerciseData.sets.reduce((sum, set) => {
          const reps = parseInt(set.reps) || 0;
          return sum + reps;
        }, 0) / 3;

        await addExerciseToSession.mutateAsync({
          sessionId: BigInt(sessionId),
          exerciseId: exerciseData.exercise.id,
          weight: avgWeight,
          reps: BigInt(Math.round(avgReps)),
          sets: BigInt(3),
          comments: exerciseData.comments,
        });
      }
      toast.success('Workout saved successfully!');
      navigate({ to: '/history' });
    } catch (error) {
      toast.error('Failed to save workout');
    } finally {
      setIsSaving(false);
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

  const completedCount = exercisesData.filter(ex => ex.isCompleted).length;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{session.name}</h1>
        <p className="text-muted-foreground mt-1">
          {completedCount} of {exercisesData.length} exercise{exercisesData.length === 1 ? '' : 's'} completed
        </p>
      </div>

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
                onComplete={(data) => handleExerciseComplete(index, data)}
                isCompleted={exerciseData.isCompleted}
              />
            ))}
          </div>

          <Card className="bg-gradient-to-br from-amber-500/5 to-orange-600/5 border-amber-500/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Save className="h-5 w-5 text-amber-500" />
                Save Your Workout
              </CardTitle>
              <CardDescription>
                {completedCount === 0 
                  ? 'Complete at least one exercise to save your workout'
                  : `${completedCount} exercise${completedCount === 1 ? '' : 's'} ready to save`
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => navigate({ to: '/' })}
                  disabled={isSaving}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700"
                  onClick={handleSaveWorkout}
                  disabled={isSaving || completedCount === 0}
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Workout
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
