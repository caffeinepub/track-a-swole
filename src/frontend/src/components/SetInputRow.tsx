import { Input } from '@/components/ui/input';

interface SetInputRowProps {
  setNumber: number;
  weight: string;
  reps: string;
  onWeightChange: (value: string) => void;
  onRepsChange: (value: string) => void;
  disabled?: boolean;
}

export default function SetInputRow({ setNumber, weight, reps, onWeightChange, onRepsChange, disabled = false }: SetInputRowProps) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm font-medium text-muted-foreground w-12">Set {setNumber}</span>
      <div className="flex-1 flex gap-2">
        <div className="flex-1">
          <Input
            type="number"
            placeholder="Weight"
            value={weight}
            onChange={(e) => onWeightChange(e.target.value)}
            disabled={disabled}
            min="0"
            step="0.5"
          />
        </div>
        <div className="flex-1">
          <Input
            type="number"
            placeholder="Reps"
            value={reps}
            onChange={(e) => onRepsChange(e.target.value)}
            disabled={disabled}
            min="0"
          />
        </div>
      </div>
    </div>
  );
}
