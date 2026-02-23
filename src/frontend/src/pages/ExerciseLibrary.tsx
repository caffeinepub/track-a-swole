import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Loader2 } from 'lucide-react';
import { useExercises } from '@/hooks/useQueries';
import AddExerciseForm from '@/components/AddExerciseForm';
import ExerciseListItem from '@/components/ExerciseListItem';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

export default function ExerciseLibrary() {
  const { data: exercises, isLoading } = useExercises();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Exercise Library</h1>
          <p className="text-muted-foreground mt-1">Build your custom exercise templates with default values</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Exercise
            </Button>
          </DialogTrigger>
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
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Exercise Templates</CardTitle>
          <CardDescription>
            {exercises?.length === 0
              ? 'No exercise templates yet. Add your first one to get started.'
              : `${exercises?.length || 0} exercise template${exercises?.length === 1 ? '' : 's'} in your library`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
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
