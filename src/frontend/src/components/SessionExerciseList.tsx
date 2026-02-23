import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ChevronUp, ChevronDown, X } from 'lucide-react';
import type { ExerciseTemplate } from '@/backend';

interface SessionExerciseListProps {
  exercises: ExerciseTemplate[];
  onRemove: (index: number) => void;
  onReorder: (fromIndex: number, toIndex: number) => void;
}

export default function SessionExerciseList({ exercises, onRemove, onReorder }: SessionExerciseListProps) {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-muted-foreground">Selected Exercises</h3>
      {exercises.map((exercise, index) => (
        <Card key={`${exercise.id}-${index}`} className="p-3">
          <div className="flex items-center gap-3">
            <div className="flex flex-col gap-1">
              <Button
                size="icon"
                variant="ghost"
                className="h-6 w-6"
                onClick={() => onReorder(index, Math.max(0, index - 1))}
                disabled={index === 0}
              >
                <ChevronUp className="h-3 w-3" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="h-6 w-6"
                onClick={() => onReorder(index, Math.min(exercises.length - 1, index + 1))}
                disabled={index === exercises.length - 1}
              >
                <ChevronDown className="h-3 w-3" />
              </Button>
            </div>
            <div className="flex-1">
              <p className="font-medium">{exercise.name}</p>
              <p className="text-xs text-muted-foreground">
                Defaults: {exercise.sets.map((set, i) => `${Number(set.weight)}×${Number(set.reps)}`).join(', ')}
              </p>
            </div>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => onRemove(index)}
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}
