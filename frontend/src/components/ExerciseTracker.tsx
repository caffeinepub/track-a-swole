import { useState } from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ChevronDown, ChevronUp } from 'lucide-react';
import type { ExerciseTemplate } from '@/backend';
import SetInputRow from '@/components/SetInputRow';

interface ExerciseTrackerProps {
  exercise: ExerciseTemplate;
  sets: Array<{ weight: string; reps: string }>;
  comments: string;
  onSetChange: (index: number, field: 'weight' | 'reps', value: string) => void;
  onCommentsChange: (value: string) => void;
}

export default function ExerciseTracker({ 
  exercise, 
  sets, 
  comments, 
  onSetChange, 
  onCommentsChange 
}: ExerciseTrackerProps) {
  const [isOpen, setIsOpen] = useState(true);

  const hasData = sets.some((set) => set.weight || set.reps) || comments;

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card className={`overflow-hidden transition-colors ${hasData ? 'border-amber-500/30' : ''}`}>
        <CollapsibleTrigger className="w-full p-4 flex items-center justify-between hover:bg-accent/50 transition-colors">
          <div className="flex items-center gap-3">
            <div className={`w-2 h-2 rounded-full ${hasData ? 'bg-amber-500' : 'bg-muted'}`} />
            <div className="text-left">
              <h3 className="font-semibold">{exercise.name}</h3>
              <p className="text-sm text-muted-foreground">3 sets</p>
            </div>
          </div>
          {isOpen ? <ChevronUp className="h-5 w-5 text-muted-foreground" /> : <ChevronDown className="h-5 w-5 text-muted-foreground" />}
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="p-4 pt-0 space-y-4 border-t border-border">
            <div className="space-y-3">
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
                <SetInputRow
                  key={index}
                  setNumber={index + 1}
                  weight={set.weight}
                  reps={set.reps}
                  onWeightChange={(value) => onSetChange(index, 'weight', value)}
                  onRepsChange={(value) => onSetChange(index, 'reps', value)}
                  disabled={false}
                />
              ))}
            </div>
            <div className="space-y-2">
              <Label htmlFor={`comments-${exercise.id}`}>Comments</Label>
              <Textarea
                id={`comments-${exercise.id}`}
                placeholder="Notes about form, difficulty, or how you felt..."
                value={comments}
                onChange={(e) => onCommentsChange(e.target.value)}
                rows={3}
              />
            </div>
          </div>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}
