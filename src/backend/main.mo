import Text "mo:core/Text";
import Array "mo:core/Array";
import Order "mo:core/Order";
import Int "mo:core/Int";
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Migration "migration";

(with migration = Migration.run)
actor {
  type ExerciseTemplate = {
    id : Nat;
    name : Text;
    sets : [Set];
    comments : Text;
  };

  type Set = {
    weight : Nat;
    reps : Nat;
  };

  module ExerciseTemplate {
    public func compareById(ex1 : ExerciseTemplate, ex2 : ExerciseTemplate) : Order.Order {
      Nat.compare(ex1.id, ex2.id);
    };

    public func compareByName(ex1 : ExerciseTemplate, ex2 : ExerciseTemplate) : Order.Order {
      Text.compare(ex1.name, ex2.name);
    };
  };

  type WorkoutExercise = {
    exerciseId : Nat;
    exerciseName : Text;
    weight : Float;
    reps : Nat;
    sets : Nat;
    comments : Text;
  };

  module WorkoutExercise {
    public func compareByExerciseId(ex1 : WorkoutExercise, ex2 : WorkoutExercise) : Order.Order {
      Nat.compare(ex1.exerciseId, ex2.exerciseId);
    };
  };

  type WorkoutSession = {
    id : Nat;
    name : Text;
    date : Int;
    exercises : [WorkoutExercise];
    isCompleted : Bool;
  };

  type WorkoutSessionHistory = {
    id : Nat;
    name : Text;
    date : Int;
    exercises : [WorkoutExercise];
    isCompleted : Bool;
  };

  module WorkoutSessionHistory {
    public func compareByDate(s1 : WorkoutSessionHistory, s2 : WorkoutSessionHistory) : Order.Order {
      Int.compare(s1.date, s2.date);
    };
  };

  let users = Map.empty<Principal, Nat>();
  let exerciseLibrary = Map.empty<Principal, Map.Map<Nat, ExerciseTemplate>>();
  let workoutSessions = Map.empty<Principal, Map.Map<Nat, WorkoutSession>>();
  var nextExerciseId = 0;
  var nextSessionId = 0;

  //--------------------------------------------------------------------------
  // User Management

  func ensureUserExists(caller : Principal) {
    if (not users.containsKey(caller)) {
      users.add(caller, 0);
      exerciseLibrary.add(caller, Map.empty<Nat, ExerciseTemplate>());
      workoutSessions.add(caller, Map.empty<Nat, WorkoutSession>());
    };
  };

  //--------------------------------------------------------------------------
  // Exercise Library Management

  public shared ({ caller }) func addExercise(name : Text) : async Nat {
    ensureUserExists(caller);
    let id = nextExerciseId;
    let defaultSets : [Set] = Array.tabulate<Set>(3, func(_) { { weight = 0; reps = 0 } });

    let exercise : ExerciseTemplate = {
      id;
      name;
      sets = defaultSets;
      comments = "";
    };

    switch (exerciseLibrary.get(caller)) {
      case (null) { Runtime.trap("User not found after creation") };
      case (?userExercises) {
        userExercises.add(id, exercise);
        nextExerciseId += 1;
        id;
      };
    };
  };

  public shared ({ caller }) func editExercise(id : Nat, newName : Text) : async () {
    ensureUserExists(caller);
    switch (exerciseLibrary.get(caller)) {
      case (null) { Runtime.trap("User not found") };
      case (?userExercises) {
        switch (userExercises.get(id)) {
          case (null) { Runtime.trap("Exercise not found") };
          case (?existingExercise) {
            let updatedExercise : ExerciseTemplate = {
              id = existingExercise.id;
              name = newName;
              sets = existingExercise.sets;
              comments = existingExercise.comments;
            };
            userExercises.add(id, updatedExercise);
          };
        };
      };
    };
  };

  public shared ({ caller }) func deleteExercise(id : Nat) : async () {
    ensureUserExists(caller);
    switch (exerciseLibrary.get(caller)) {
      case (null) { Runtime.trap("User not found") };
      case (?userExercises) {
        if (not userExercises.containsKey(id)) {
          Runtime.trap("Exercise not found");
        };
        userExercises.remove(id);
      };
    };
  };

  public query ({ caller }) func getAllExercises() : async [ExerciseTemplate] {
    ensureUserExists(caller);
    switch (exerciseLibrary.get(caller)) {
      case (null) { Runtime.trap("User not found") };
      case (?userExercises) {
        userExercises.values().toArray().sort(ExerciseTemplate.compareByName);
      };
    };
  };

  public query ({ caller }) func getExerciseLibrarySize() : async Nat {
    ensureUserExists(caller);
    switch (exerciseLibrary.get(caller)) {
      case (null) { Runtime.trap("User not found") };
      case (?userExercises) { userExercises.size() };
    };
  };

  //--------------------------------------------------------------------------
  // Workout Session Management

  public shared ({ caller }) func createWorkoutSession(name : Text, date : Int) : async Nat {
    ensureUserExists(caller);
    let id = nextSessionId;
    let session : WorkoutSession = {
      id;
      name;
      date;
      exercises = [];
      isCompleted = false;
    };

    switch (workoutSessions.get(caller)) {
      case (null) { Runtime.trap("User not found") };
      case (?userSessions) {
        userSessions.add(id, session);
        nextSessionId += 1;
        id;
      };
    };
  };

  public shared ({ caller }) func addExerciseToSession(
    sessionId : Nat,
    exerciseId : Nat,
    weight : Float,
    reps : Nat,
    sets : Nat,
    comments : Text,
  ) : async () {
    ensureUserExists(caller);
    switch (workoutSessions.get(caller)) {
      case (null) { Runtime.trap("User not found") };
      case (?userSessions) {
        switch (userSessions.get(sessionId)) {
          case (null) { Runtime.trap("Session not found") };
          case (?session) {
            switch (exerciseLibrary.get(caller)) {
              case (null) { Runtime.trap("User exercises not found") };
              case (?userExercises) {
                switch (userExercises.get(exerciseId)) {
                  case (null) { Runtime.trap("Exercise not found") };
                  case (?exercise) {
                    let workoutExercise : WorkoutExercise = {
                      exerciseId;
                      exerciseName = exercise.name;
                      weight;
                      reps;
                      sets;
                      comments;
                    };
                    let updatedSession : WorkoutSession = {
                      id = session.id;
                      name = session.name;
                      date = session.date;
                      exercises = session.exercises.concat([workoutExercise]);
                      isCompleted = session.isCompleted;
                    };
                    userSessions.add(sessionId, updatedSession);
                  };
                };
              };
            };
          };
        };
      };
    };
  };

  public shared ({ caller }) func removeExerciseFromSession(sessionId : Nat, exerciseIndex : Nat) : async () {
    ensureUserExists(caller);
    switch (workoutSessions.get(caller)) {
      case (null) { Runtime.trap("User not found") };
      case (?userSessions) {
        switch (userSessions.get(sessionId)) {
          case (null) { Runtime.trap("Session not found") };
          case (?session) {
            if (exerciseIndex >= session.exercises.size()) {
              Runtime.trap("Exercise index out of bounds");
            };
            let filteredExercises = session.exercises.filter(
              func(_) { true }
            );
            let updatedSession : WorkoutSession = {
              id = session.id;
              name = session.name;
              date = session.date;
              exercises = filteredExercises;
              isCompleted = session.isCompleted;
            };
            userSessions.add(sessionId, updatedSession);
          };
        };
      };
    };
  };

  public query ({ caller }) func getSessionExercises(sessionId : Nat) : async [WorkoutExercise] {
    ensureUserExists(caller);
    switch (workoutSessions.get(caller)) {
      case (null) { Runtime.trap("User not found") };
      case (?userSessions) {
        switch (userSessions.get(sessionId)) {
          case (null) { Runtime.trap("Session not found") };
          case (?session) { session.exercises };
        };
      };
    };
  };

  public query ({ caller }) func getWorkoutSessionsByDate() : async [WorkoutSession] {
    ensureUserExists(caller);
    switch (workoutSessions.get(caller)) {
      case (null) { Runtime.trap("User not found") };
      case (?userSessions) {
        userSessions.values().toArray();
      };
    };
  };

  //--------------------------------------------------------------------------
  // Workout History

  public query ({ caller }) func getWorkoutHistory() : async [WorkoutSessionHistory] {
    ensureUserExists(caller);
    switch (workoutSessions.get(caller)) {
      case (null) { Runtime.trap("User not found") };
      case (?userSessions) {
        let sessions = userSessions.values().toArray();
        let completedSessions = sessions.filter(func(session) { session.isCompleted });
        let sessionHistories = completedSessions.map(
          func(session) {
            {
              id = session.id;
              name = session.name;
              date = session.date;
              exercises = session.exercises;
              isCompleted = session.isCompleted;
            };
          }
        );
        sessionHistories.sort(WorkoutSessionHistory.compareByDate);
      };
    };
  };

  //--------------------------------------------------------------------------
  // Utility Functions

  public query ({ caller }) func getNextExerciseId() : async Nat {
    nextExerciseId;
  };

  public query ({ caller }) func getNextSessionId() : async Nat {
    nextSessionId;
  };

  //--------------------------------------------------------------------------
  // User Count (for testing/demo purposes)

  public query ({ caller }) func getUserCount() : async Nat {
    users.size();
  };
};
