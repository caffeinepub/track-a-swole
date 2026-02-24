import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useWorkoutHistory } from '@/hooks/useQueries';
import HistorySessionCard from '@/components/HistorySessionCard';
import { Loader2, AlertCircle, History } from 'lucide-react';

export default function WorkoutHistory() {
  const { data: history, isLoading, isError, error } = useWorkoutHistory();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Workout History</h1>
        <p className="text-muted-foreground mt-1">Review your past training sessions</p>
      </div>

      {isError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error loading history</AlertTitle>
          <AlertDescription>
            {error instanceof Error ? error.message : 'Failed to load workout history. Please try again.'}
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5 text-amber-500" />
            Past Workouts
          </CardTitle>
          <CardDescription>
            {isLoading 
              ? 'Loading your workout history...'
              : history && history.length > 0
              ? `${history.length} completed workout${history.length === 1 ? '' : 's'}`
              : 'No completed workouts yet'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
            </div>
          ) : history && history.length > 0 ? (
            <div className="space-y-3">
              {history.map((session) => (
                <HistorySessionCard key={Number(session.id)} session={session} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <p className="font-medium">No workout history yet.</p>
              <p className="text-sm mt-1">Complete your first workout to see it here.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
