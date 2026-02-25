import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Loader2, AlertCircle } from 'lucide-react';
import { useExercises } from '@/hooks/useQueries';
import { useActor } from '@/hooks/useActor';
import AddExerciseForm from '@/components/AddExerciseForm';
import ExerciseListItem from '@/components/ExerciseListItem';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export default function ExerciseLibrary() {
  const { actor, isFetching: isActorFetching } = useActor();
  const { data: exercises, isLoading, isError, error } = useExercises();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Show spinner while actor is initializing OR while exercises are loading
  const showSpinner = isActorFetching || (!actor && !isError) || isLoading;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Exercise Library</h1>
          <p className="text-muted-foreground mt-1">Build your custom exercise templates with default values</p>
        </div>
        <Button
          className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700"
          onClick={() => setIsDialogOpen(true)}
          disabled={isActorFetching || !actor}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Exercise
        </Button>
      </div>

      {/* Add Exercise Dialog — controlled independently of DialogTrigger to avoid stale closure issues */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Exercise Template</DialogTitle>
            <DialogDescription>
              Create an exercise template with default set values. These defaults will pre-populate when you add this exercise to a workout.
            </DialogDescription>
          </DialogHeader>
          <AddExerciseForm onSuccess={() => setIsDialogOpen(false)} />
        </DialogContent>
      </Dialog>

      <Card>
        <CardHeader>
          <CardTitle>Your Exercise Templates</CardTitle>
          <CardDescription>
            {!showSpinner && !isError && (
              exercises?.length === 0
                ? 'No exercise templates yet. Add your first one to get started.'
                : `${exercises?.length || 0} exercise template${exercises?.length === 1 ? '' : 's'} in your library`
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {showSpinner ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
            </div>
          ) : isError ? (
            <div className="flex flex-col items-center justify-center py-12 text-destructive gap-2">
              <AlertCircle className="h-8 w-8" />
              <p className="font-medium">Failed to load exercises</p>
              <p className="text-sm text-muted-foreground">
                {error instanceof Error ? error.message : 'An unexpected error occurred. Please try again.'}
              </p>
            </div>
          ) : exercises && exercises.length > 0 ? (
            <div className="space-y-3">
              {exercises.map((exercise) => (
                <ExerciseListItem key={Number(exercise.id)} exercise={exercise} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <p>Your exercise library is empty.</p>
              <p className="text-sm mt-1">Click "Add Exercise" to create your first template.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
