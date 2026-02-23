import { createRouter, createRoute, createRootRoute, RouterProvider, Outlet } from '@tanstack/react-router';
import Layout from './components/Layout';
import ExerciseLibrary from './pages/ExerciseLibrary';
import CreateSession from './pages/CreateSession';
import ActiveWorkout from './pages/ActiveWorkout';
import WorkoutHistory from './pages/WorkoutHistory';
import SessionDetail from './pages/SessionDetail';
import Home from './pages/Home';

const rootRoute = createRootRoute({
  component: Layout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Home,
});

const exercisesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/exercises',
  component: ExerciseLibrary,
});

const createSessionRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/create-session',
  component: CreateSession,
});

const workoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/workout/$sessionId',
  component: ActiveWorkout,
  validateSearch: (search: Record<string, unknown>): { exerciseIds?: string } => {
    return {
      exerciseIds: typeof search.exerciseIds === 'string' ? search.exerciseIds : undefined,
    };
  },
});

const historyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/history',
  component: WorkoutHistory,
});

const sessionDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/history/$sessionId',
  component: SessionDetail,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  exercisesRoute,
  createSessionRoute,
  workoutRoute,
  historyRoute,
  sessionDetailRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
