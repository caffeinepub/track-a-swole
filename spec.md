# Specification

## Summary
**Goal:** Fix the perpetual loading spinner and broken "Add Exercise" button on the Manage Exercise / Exercise Library page.

**Planned changes:**
- Fix `ExerciseLibrary.tsx` so the loading spinner resolves once the backend query completes or errors, and displays the exercise list or an error message accordingly.
- Fix the "Add Exercise" button in `ExerciseLibrary.tsx` so clicking it opens the `AddExerciseForm` dialog when the user is authenticated.
- Fix `AddExerciseForm.tsx` so submitting valid data calls the backend and updates the exercise list without a page reload.
- Audit and fix exercise-related hooks in `useQueries.ts` to ensure the actor is initialized before canister calls are made, queries are disabled when the actor is not ready, and errors are surfaced rather than causing silent hangs.

**User-visible outcome:** After logging in, the Manage Exercise page loads and displays the exercise list (or an error message). The "Add Exercise" button opens the form, and submitting it successfully adds the exercise to the list.
