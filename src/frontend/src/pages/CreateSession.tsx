import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useExercises, useCreateWorkoutSession } from '@/hooks/useQueries';
import ExercisePicker from '@/components/ExercisePicker';
import SessionExerciseList from '@/components/SessionExerciseList';
import { Loader2, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from '@tanstack/react-router';
import type { ExerciseTemplate } from '@/backend';

export default function CreateSession() {
  const navigate = useNavigate();
  const { data: exercises, isLoading: exercisesLoading } = useExercises();
  const createSession = useCreateWorkoutSession();
  
  const [sessionName, setSessionName] = useState(() => {
    const today = new Date();
    const month = today.getMonth() + 1;
    const day = today.getDate();
    const year = today.getFullYear();
    return `Gym Day ${month}/${day}/${year}`;
  });
  
  const [selectedExercises, setSelectedExercises] = useState<ExerciseTemplate[]>([]);

  const handleAddExercise = (exercise: ExerciseTemplate) => {
    setSelectedExercises([...selectedExercises, exercise]);
  };

  const handleRemoveExercise = (index: number) => {
    setSelectedExercises(selectedExercises.filter((_, i) => i !== index));
  };

  const handleReorderExercise = (fromIndex: number, toIndex: number) => {
    const newExercises = [...selectedExercises];
    const [removed] = newExercises.splice(fromIndex, 1);
    newExercises.splice(toIndex, 0, removed);
    setSelectedExercises(newExercises);
  };

  const handleCreateSession = async () => {
    if (!sessionName.trim()) {
      toast.error('Please enter a session name');
      return;
    }

    if (selectedExercises.length === 0) {
      toast.error('Please add at least one exercise');
      return;
    }

    try {
      const sessionId = await createSession.mutateAsync({
        name: sessionName.trim(),
        date: BigInt(Date.now()),
      });
      toast.success('Session created successfully');
      // Pass exercise IDs as search params
      const exerciseIds = selectedExercises.map(ex => ex.id.toString()).join(',');
      navigate({ 
        to: '/workout/$sessionId', 
        params: { sessionId: sessionId.toString() },
        search: { exerciseIds }
      });
    } catch (error) {
      toast.error('Failed to create session');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create Workout Session</h1>
        <p className="text-muted-foreground mt-1">Set up your workout and get ready to train</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Session Details</CardTitle>
          <CardDescription>Name your workout session</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="session-name">Session Name</Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="session-name"
                placeholder="e.g., Gym Day Upper 2/25/2026"
                value={sessionName}
                onChange={(e) => setSessionName(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Add Exercises</CardTitle>
          <CardDescription>
            {selectedExercises.length === 0
              ? 'Select exercises from your library'
              : `${selectedExercises.length} exercise${selectedExercises.length === 1 ? '' : 's'} added`}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {exercisesLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
            </div>
          ) : exercises && exercises.length > 0 ? (
            <>
              <ExercisePicker exercises={exercises} onSelectExercise={handleAddExercise} />
              {selectedExercises.length > 0 && (
                <SessionExerciseList
                  exercises={selectedExercises}
                  onRemove={handleRemoveExercise}
                  onReorder={handleReorderExercise}
                />
              )}
            </>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>No exercises in your library yet.</p>
              <p className="text-sm mt-1">Add exercises to your library first.</p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button
          variant="outline"
          className="flex-1"
          onClick={() => navigate({ to: '/' })}
        >
          Cancel
        </Button>
        <Button
          className="flex-1 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700"
          onClick={handleCreateSession}
          disabled={createSession.isPending || selectedExercises.length === 0}
        >
          {createSession.isPending ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Creating...
            </>
          ) : (
            'Start Workout'
          )}
        </Button>
      </div>
    </div>
  );
}
