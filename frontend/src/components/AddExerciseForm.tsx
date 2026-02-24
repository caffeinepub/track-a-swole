import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAddExercise } from '@/hooks/useQueries';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface AddExerciseFormProps {
  onSuccess?: () => void;
}

export default function AddExerciseForm({ onSuccess }: AddExerciseFormProps) {
  const [name, setName] = useState('');
  const [sets, setSets] = useState([
    { weight: '0', reps: '0' },
    { weight: '0', reps: '0' },
    { weight: '0', reps: '0' },
  ]);
  const [comments, setComments] = useState('');
  const addExercise = useAddExercise();

  const handleSetChange = (index: number, field: 'weight' | 'reps', value: string) => {
    const newSets = [...sets];
    newSets[index][field] = value;
    setSets(newSets);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    
    if (!name.trim()) {
      toast.error('Please enter an exercise name');
      return;
    }

    // Validate that all weight and reps fields have valid numbers
    for (let i = 0; i < sets.length; i++) {
      const weight = parseInt(sets[i].weight);
      const reps = parseInt(sets[i].reps);
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
      await addExercise.mutateAsync(name.trim());
      toast.success('Exercise template added successfully');
      setName('');
      setSets([
        { weight: '0', reps: '0' },
        { weight: '0', reps: '0' },
        { weight: '0', reps: '0' },
      ]);
      setComments('');
      onSuccess?.();
    } catch (error) {
      console.error('Error adding exercise:', error);
      toast.error('Failed to add exercise');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="exercise-name">Exercise Name</Label>
        <Input
          id="exercise-name"
          placeholder="e.g., Bench Press, Squats, Deadlift"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={addExercise.isPending}
        />
      </div>

      <div className="space-y-3">
        <Label>Default Set Values</Label>
        {/* Column Headers */}
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-muted-foreground w-12"></span>
          <div className="flex-1 flex gap-2">
            <div className="flex-1">
              <span className="text-sm font-medium text-amber-500">Weight</span>
            </div>
            <div className="flex-1">
              <span className="text-sm font-medium text-amber-500">Reps</span>
            </div>
          </div>
        </div>
        {/* Set Input Rows */}
        {sets.map((set, index) => (
          <div key={index} className="flex items-center gap-3">
            <span className="text-sm font-medium text-muted-foreground w-12">Set {index + 1}</span>
            <div className="flex-1 flex gap-2">
              <div className="flex-1">
                <Input
                  type="number"
                  placeholder="Weight"
                  value={set.weight}
                  onChange={(e) => handleSetChange(index, 'weight', e.target.value)}
                  disabled={addExercise.isPending}
                  min="0"
                />
              </div>
              <div className="flex-1">
                <Input
                  type="number"
                  placeholder="Reps"
                  value={set.reps}
                  onChange={(e) => handleSetChange(index, 'reps', e.target.value)}
                  disabled={addExercise.isPending}
                  min="0"
                />
              </div>
            </div>
          </div>
        ))}
        <p className="text-xs text-muted-foreground">These default values will pre-populate when you add this exercise to a workout</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="comments">Default Comments</Label>
        <Textarea
          id="comments"
          placeholder="Notes about form, tips, or reminders..."
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          disabled={addExercise.isPending}
          rows={3}
        />
      </div>

      <Button
        type="submit"
        onClick={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700"
        disabled={addExercise.isPending}
      >
        {addExercise.isPending ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Adding...
          </>
        ) : (
          'Add Exercise Template'
        )}
      </Button>
    </form>
  );
}
