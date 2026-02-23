import { useState } from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, CheckCircle2 } from 'lucide-react';
import type { ExerciseTemplate } from '@/backend';
import SetInputRow from '@/components/SetInputRow';

interface ExerciseTrackerProps {
  exercise: ExerciseTemplate;
  onComplete: (data: { sets: Array<{ weight: string; reps: string }>; comments: string }) => void;
  isCompleted?: boolean;
}

export default function ExerciseTracker({ exercise, onComplete, isCompleted = false }: ExerciseTrackerProps) {
  const [isOpen, setIsOpen] = useState(!isCompleted);
  const [sets, setSets] = useState(
    exercise.sets.map((set) => ({
      weight: set.weight.toString(),
      reps: set.reps.toString(),
    }))
  );
  const [comments, setComments] = useState(exercise.comments);

  const handleSetChange = (index: number, field: 'weight' | 'reps', value: string) => {
    const newSets = [...sets];
    newSets[index][field] = value;
    setSets(newSets);
  };

  const handleCommentsChange = (value: string) => {
    setComments(value);
  };

  const handleDone = () => {
    onComplete({ sets, comments });
  };

  const hasData = sets.some((set) => set.weight || set.reps) || comments;

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card className={`overflow-hidden transition-colors ${isCompleted ? 'border-green-500/50 bg-green-500/5' : hasData ? 'border-amber-500/30' : ''}`}>
        <CollapsibleTrigger className="w-full p-4 flex items-center justify-between hover:bg-accent/50 transition-colors">
          <div className="flex items-center gap-3">
            <div className={`w-2 h-2 rounded-full ${isCompleted ? 'bg-green-500' : hasData ? 'bg-amber-500' : 'bg-muted'}`} />
            <div className="text-left">
              <h3 className="font-semibold">{exercise.name}</h3>
              <p className="text-sm text-muted-foreground">
                {isCompleted ? 'Completed' : '3 sets'}
              </p>
            </div>
          </div>
          {isOpen ? <ChevronUp className="h-5 w-5 text-muted-foreground" /> : <ChevronDown className="h-5 w-5 text-muted-foreground" />}
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="p-4 pt-0 space-y-4 border-t border-border">
            <div className="space-y-3">
              {sets.map((set, index) => (
                <SetInputRow
                  key={index}
                  setNumber={index + 1}
                  weight={set.weight}
                  reps={set.reps}
                  onWeightChange={(value) => handleSetChange(index, 'weight', value)}
                  onRepsChange={(value) => handleSetChange(index, 'reps', value)}
                  disabled={isCompleted}
                />
              ))}
            </div>
            <div className="space-y-2">
              <Label htmlFor={`comments-${exercise.id}`}>Comments</Label>
              <Textarea
                id={`comments-${exercise.id}`}
                placeholder="Notes about form, difficulty, or how you felt..."
                value={comments}
                onChange={(e) => handleCommentsChange(e.target.value)}
                rows={3}
                disabled={isCompleted}
              />
            </div>
            {!isCompleted && (
              <Button
                onClick={handleDone}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
              >
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Done
              </Button>
            )}
          </div>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}
