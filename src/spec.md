# Specification

## Summary
**Goal:** Transform the exercise library from storing just exercise names to storing complete exercise templates with default values for 3 sets (weight and reps per set) and comments, which pre-populate when adding exercises to workout sessions.

**Planned changes:**
- Modify backend Exercise data model to store templates with 3 sets (each with weight and reps) and a single comments field
- Update AddExerciseForm to include input fields for exercise name, 3 sets with weight/reps inputs per set, and a comments text area
- Enhance ExercisePicker and session creation flow to pre-populate selected exercises with their template default values when adding to workout sessions
- Update ExerciseTracker to display pre-populated template values, allow editing during workout, and include a 'Done' button that saves completed exercises to the session history
- Modify ExerciseListItem to display full template data (name, 3 sets with weight/reps, comments) in the library view and support inline editing of template defaults

**User-visible outcome:** Users can build a personal exercise library with complete templates (including default weights, reps for 3 sets, and comments), which automatically pre-populate when adding exercises to workout sessions. During workouts, users can edit these pre-populated values and click 'Done' to save completed exercises to their session history.
