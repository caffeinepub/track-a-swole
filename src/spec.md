# Specification

## Summary
**Goal:** Persist active workout session state across page refreshes so users don't lose their workout progress.

**Planned changes:**
- Save session name, exercise IDs, and all set data (weight, reps, comments) to localStorage whenever data changes in the ActiveWorkout page
- Restore session state from localStorage on page load, prioritizing localStorage over URL params when both exist
- Clear localStorage session data after successfully saving the workout to the backend

**User-visible outcome:** Users can refresh the page during an active workout and continue exactly where they left off with all their entered data intact. After saving a completed workout, the session is cleared and ready for a new workout.
