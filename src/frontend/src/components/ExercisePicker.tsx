import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';
import type { ExerciseTemplate } from '@/backend';
import { useState } from 'react';

interface ExercisePickerProps {
  exercises: ExerciseTemplate[];
  onSelectExercise: (exercise: ExerciseTemplate) => void;
}

export default function ExercisePicker({ exercises, onSelectExercise }: ExercisePickerProps) {
  const [selectedId, setSelectedId] = useState<string>('');

  const handleAdd = () => {
    const exercise = exercises.find((ex) => ex.id.toString() === selectedId);
    if (exercise) {
      onSelectExercise(exercise);
      setSelectedId('');
    }
  };

  return (
    <div className="flex gap-3">
      <Select value={selectedId} onValueChange={setSelectedId}>
        <SelectTrigger className="flex-1">
          <SelectValue placeholder="Select an exercise from your library" />
        </SelectTrigger>
        <SelectContent>
          {exercises.map((exercise) => (
            <SelectItem key={Number(exercise.id)} value={exercise.id.toString()}>
              <div className="flex flex-col items-start">
                <span className="font-medium">{exercise.name}</span>
                <span className="text-xs text-muted-foreground">
                  {exercise.sets.map((set, i) => `${Number(set.weight)}×${Number(set.reps)}`).join(', ')}
                </span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button
        onClick={handleAdd}
        disabled={!selectedId}
        className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add
      </Button>
    </div>
  );
}
