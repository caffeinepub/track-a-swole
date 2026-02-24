import { useParams, useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useWorkoutSession } from '@/hooks/useQueries';
import CompletedExerciseDisplay from '@/components/CompletedExerciseDisplay';
import { Loader2, ArrowLeft, Calendar } from 'lucide-react';

export default function SessionDetail() {
  const { sessionId } = useParams({ from: '/history/$sessionId' });
  const navigate = useNavigate();
  const { data: session, isLoading } = useWorkoutSession(BigInt(sessionId));

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Session not found</p>
      </div>
    );
  }

  const date = new Date(Number(session.date));

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate({ to: '/history' })}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">{session.name}</h1>
          <div className="flex items-center gap-2 text-muted-foreground mt-1">
            <Calendar className="h-4 w-4" />
            <span>{date.toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Workout Summary</CardTitle>
          <CardDescription>
            {session.exercises.length} exercise{session.exercises.length === 1 ? '' : 's'} completed
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {session.exercises.length > 0 ? (
            session.exercises.map((exercise, index) => (
              <CompletedExerciseDisplay key={index} exercise={exercise} />
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>No exercises recorded for this session.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
