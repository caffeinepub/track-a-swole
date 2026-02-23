import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dumbbell, Library, Plus, History, TrendingUp } from 'lucide-react';

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4 py-8">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl shadow-xl mb-4">
          <Dumbbell className="h-10 w-10 text-white" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          Welcome to <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">Track-A-Swole</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Your personal workout companion. Track exercises, log sessions, and watch your progress grow.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="border-amber-500/20 hover:border-amber-500/40 transition-colors group">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-500/10 rounded-lg group-hover:bg-amber-500/20 transition-colors">
                <Library className="h-6 w-6 text-amber-500" />
              </div>
              <CardTitle>Exercise Library</CardTitle>
            </div>
            <CardDescription>
              Build your custom exercise collection. Add, edit, and organize all your favorite movements.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/exercises">
              <Button className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700">
                Manage Library
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="border-amber-500/20 hover:border-amber-500/40 transition-colors group">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-500/10 rounded-lg group-hover:bg-amber-500/20 transition-colors">
                <Plus className="h-6 w-6 text-amber-500" />
              </div>
              <CardTitle>New Session</CardTitle>
            </div>
            <CardDescription>
              Start a fresh workout session. Pick your exercises and get ready to crush it.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/create-session">
              <Button className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700">
                Create Session
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="border-amber-500/20 hover:border-amber-500/40 transition-colors group">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-500/10 rounded-lg group-hover:bg-amber-500/20 transition-colors">
                <History className="h-6 w-6 text-amber-500" />
              </div>
              <CardTitle>Workout History</CardTitle>
            </div>
            <CardDescription>
              Review your past sessions and see how far you've come on your fitness journey.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/history">
              <Button variant="outline" className="w-full border-amber-500/30 hover:bg-amber-500/10">
                View History
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="border-amber-500/20 hover:border-amber-500/40 transition-colors group">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-500/10 rounded-lg group-hover:bg-amber-500/20 transition-colors">
                <TrendingUp className="h-6 w-6 text-amber-500" />
              </div>
              <CardTitle>Track Progress</CardTitle>
            </div>
            <CardDescription>
              Monitor your gains with detailed tracking of weights, reps, and personal records.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full border-amber-500/30 hover:bg-amber-500/10" disabled>
              Coming Soon
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gradient-to-br from-amber-500/5 to-orange-600/5 border-amber-500/20">
        <CardHeader>
          <CardTitle className="text-center">Quick Tips</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-amber-500 rounded-full mt-2" />
            <p className="text-sm text-muted-foreground">
              Start by building your exercise library with all the movements you perform at the gym.
            </p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-amber-500 rounded-full mt-2" />
            <p className="text-sm text-muted-foreground">
              Each exercise always has 3 sets. Adjust weight and reps for each set as needed.
            </p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-amber-500 rounded-full mt-2" />
            <p className="text-sm text-muted-foreground">
              Use the comments field to note how you felt, form cues, or anything else worth remembering.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
