import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronRight, Calendar, Dumbbell } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import type { WorkoutSessionHistory } from '@/backend';

interface HistorySessionCardProps {
  session: WorkoutSessionHistory;
}

export default function HistorySessionCard({ session }: HistorySessionCardProps) {
  const navigate = useNavigate();
  const date = new Date(Number(session.date));

  return (
    <Card
      className="p-4 hover:bg-accent/50 transition-colors cursor-pointer border-l-4 border-l-amber-500"
      onClick={() => navigate({ to: '/history/$sessionId', params: { sessionId: session.id.toString() } })}
    >
      <div className="flex items-center justify-between">
        <div className="space-y-1 flex-1">
          <h3 className="font-semibold text-lg">{session.name}</h3>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>{date.toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-1">
              <Dumbbell className="h-3 w-3" />
              <span>
                {session.exercises.length} exercise{session.exercises.length === 1 ? '' : 's'}
              </span>
            </div>
          </div>
        </div>
        <Button variant="ghost" size="icon">
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>
    </Card>
  );
}
