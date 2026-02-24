# Specification

## Summary
**Goal:** Fix the History section in Track-A-Swole so that completed workout sessions are properly fetched and displayed.

**Planned changes:**
- Fix the backend `getWorkoutHistory` query to correctly return completed sessions for the authenticated Principal in reverse-chronological order.
- Fix the frontend `useQueries.ts` history hook to correctly call the backend actor method and map the response to the expected shape.
- Fix the `WorkoutHistory` page to fetch and render completed sessions as `HistorySessionCard` components, including loading, error, and empty states.

**User-visible outcome:** Navigating to the History section now displays all past completed workout sessions, each showing date, name, and exercise count, along with appropriate loading, empty, and error states.
