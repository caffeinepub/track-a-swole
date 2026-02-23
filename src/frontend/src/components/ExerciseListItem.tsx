import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Edit2, Trash2, Check, X, Loader2 } from 'lucide-react';
import { useEditExercise, useDeleteExercise } from '@/hooks/useQueries';
import type { ExerciseTemplate } from '@/backend';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface ExerciseListItemProps {
  exercise: ExerciseTemplate;
}

export default function ExerciseListItem({ exercise }: ExerciseListItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(exercise.name);
  const [editedSets, setEditedSets] = useState(
    exercise.sets.map((set) => ({
      weight: set.weight.toString(),
      reps: set.reps.toString(),
    }))
  );
  const [editedComments, setEditedComments] = useState(exercise.comments);
  const editExercise = useEditExercise();
  const deleteExercise = useDeleteExercise();

  const handleSetChange = (index: number, field: 'weight' | 'reps', value: string) => {
    const newSets = [...editedSets];
    newSets[index][field] = value;
    setEditedSets(newSets);
  };

  const handleEdit = async () => {
    if (!editedName.trim()) {
      toast.error('Exercise name cannot be empty');
      return;
    }

    // Validate sets
    for (let i = 0; i < editedSets.length; i++) {
      const weight = parseInt(editedSets[i].weight);
      const reps = parseInt(editedSets[i].reps);
      if (isNaN(weight) || weight < 0) {
        toast.error(`Please enter a valid weight for Set ${i + 1}`);
        return;
      }
      if (isNaN(reps) || reps < 0) {
        toast.error(`Please enter a valid reps for Set ${i + 1}`);
        return;
      }
    }

    try {
      // Note: Backend only supports editing name currently
      await editExercise.mutateAsync({ id: exercise.id, newName: editedName.trim() });
      toast.success('Exercise updated successfully');
      setIsEditing(false);
    } catch (error) {
      toast.error('Failed to update exercise');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteExercise.mutateAsync(exercise.id);
      toast.success('Exercise deleted successfully');
    } catch (error) {
      toast.error('Failed to delete exercise');
    }
  };

  const handleCancel = () => {
    setEditedName(exercise.name);
    setEditedSets(
      exercise.sets.map((set) => ({
        weight: set.weight.toString(),
        reps: set.reps.toString(),
      }))
    );
    setEditedComments(exercise.comments);
    setIsEditing(false);
  };

  return (
    <div className="rounded-lg border border-border bg-card hover:bg-accent/50 transition-colors">
      {isEditing ? (
        <div className="p-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor={`edit-name-${exercise.id}`}>Exercise Name</Label>
            <Input
              id={`edit-name-${exercise.id}`}
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              disabled={editExercise.isPending}
              autoFocus
            />
          </div>

          <div className="space-y-3">
            <Label>Default Set Values</Label>
            {editedSets.map((set, index) => (
              <div key={index} className="flex items-center gap-3">
                <span className="text-sm font-medium text-muted-foreground w-12">Set {index + 1}</span>
                <div className="flex-1 flex gap-2">
                  <div className="flex-1">
                    <Input
                      type="number"
                      placeholder="Weight"
                      value={set.weight}
                      onChange={(e) => handleSetChange(index, 'weight', e.target.value)}
                      disabled={editExercise.isPending}
                      min="0"
                    />
                  </div>
                  <div className="flex-1">
                    <Input
                      type="number"
                      placeholder="Reps"
                      value={set.reps}
                      onChange={(e) => handleSetChange(index, 'reps', e.target.value)}
                      disabled={editExercise.isPending}
                      min="0"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <Label htmlFor={`edit-comments-${exercise.id}`}>Default Comments</Label>
            <Textarea
              id={`edit-comments-${exercise.id}`}
              value={editedComments}
              onChange={(e) => setEditedComments(e.target.value)}
              disabled={editExercise.isPending}
              rows={2}
            />
          </div>

          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={handleEdit}
              disabled={editExercise.isPending}
              className="flex-1 bg-green-500 hover:bg-green-600 text-white"
            >
              {editExercise.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4 mr-2" />}
              Save
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleCancel}
              disabled={editExercise.isPending}
              className="flex-1"
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <div className="p-4">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex-1">
              <h3 className="font-semibold text-lg">{exercise.name}</h3>
            </div>
            <div className="flex gap-1">
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setIsEditing(true)}
                className="text-amber-500 hover:text-amber-600 hover:bg-amber-500/10 h-8 w-8"
              >
                <Edit2 className="h-4 w-4" />
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-destructive hover:text-destructive hover:bg-destructive/10 h-8 w-8"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Exercise</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete "{exercise.name}"? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDelete}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-sm">
              <span className="font-medium text-muted-foreground">Default Sets:</span>
              <div className="mt-1 space-y-1">
                {exercise.sets.map((set, index) => (
                  <div key={index} className="flex items-center gap-2 text-muted-foreground">
                    <span className="w-12">Set {index + 1}:</span>
                    <span>{Number(set.weight)} lbs × {Number(set.reps)} reps</span>
                  </div>
                ))}
              </div>
            </div>
            {exercise.comments && (
              <div className="text-sm">
                <span className="font-medium text-muted-foreground">Default Comments:</span>
                <p className="mt-1 text-muted-foreground">{exercise.comments}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
