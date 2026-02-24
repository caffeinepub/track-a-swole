import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { WorkoutExercise } from '@/backend';

interface CompletedExerciseDisplayProps {
  exercise: WorkoutExercise;
}

export default function CompletedExerciseDisplay({ exercise }: CompletedExerciseDisplayProps) {
  return (
    <Card className="overflow-hidden border-l-4 border-l-amber-500">
      <div className="p-4 bg-accent/30">
        <h3 className="font-semibold text-lg">{exercise.exerciseName}</h3>
        <p className="text-sm text-muted-foreground">{Number(exercise.sets)} sets</p>
      </div>
      <div className="p-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">Set</TableHead>
              <TableHead>Weight (lbs)</TableHead>
              <TableHead>Reps</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: Number(exercise.sets) }, (_, i) => (
              <TableRow key={i}>
                <TableCell className="font-medium">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-amber-500/10 text-amber-500 text-sm">
                    {i + 1}
                  </div>
                </TableCell>
                <TableCell>{exercise.weight.toFixed(1)}</TableCell>
                <TableCell>{Number(exercise.reps)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {exercise.comments && (
          <div className="mt-4 p-3 bg-muted/50 rounded-lg">
            <p className="text-sm font-medium text-muted-foreground mb-1">Comments</p>
            <p className="text-sm">{exercise.comments}</p>
          </div>
        )}
      </div>
    </Card>
  );
}
