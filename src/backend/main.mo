import Text "mo:core/Text";
import Array "mo:core/Array";
import Order "mo:core/Order";
import Int "mo:core/Int";
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Runtime "mo:core/Runtime";



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

  let exerciseLibrary = Map.empty<Nat, ExerciseTemplate>();
  let workoutSessions = Map.empty<Nat, WorkoutSession>();
  var nextExerciseId = 0;
  var nextSessionId = 0;

  //--------------------------------------------------------------------------
  // Exercise Library Management

  public shared ({ caller }) func addExercise(name : Text) : async Nat {
    let id = nextExerciseId;
    let defaultSets : [Set] = Array.tabulate<Set>(3, func(_) { { weight = 0; reps = 0 } });

    let exercise : ExerciseTemplate = {
      id;
      name;
      sets = defaultSets;
      comments = "";
    };
    exerciseLibrary.add(id, exercise);
    nextExerciseId += 1;
    id;
  };

  public shared ({ caller }) func editExercise(id : Nat, newName : Text) : async () {
    switch (exerciseLibrary.get(id)) {
      case (null) { Runtime.trap("Exercise not found") };
      case (?existingExercise) {
        let updatedExercise : ExerciseTemplate = {
          id = existingExercise.id;
          name = newName;
          sets = existingExercise.sets;
          comments = existingExercise.comments;
        };
        exerciseLibrary.add(id, updatedExercise);
      };
    };
  };

  public shared ({ caller }) func deleteExercise(id : Nat) : async () {
    if (not exerciseLibrary.containsKey(id)) {
      Runtime.trap("Exercise not found");
    };
    exerciseLibrary.remove(id);
  };

  public query ({ caller }) func getAllExercises() : async [ExerciseTemplate] {
    exerciseLibrary.values().toArray().sort(ExerciseTemplate.compareByName);
  };

  public query ({ caller }) func getExerciseLibrarySize() : async Nat {
    exerciseLibrary.size();
  };

  //--------------------------------------------------------------------------
  // Workout Session Management

  public shared ({ caller }) func createWorkoutSession(name : Text, date : Int) : async Nat {
    let id = nextSessionId;
    let session : WorkoutSession = {
      id;
      name;
      date;
      exercises = [];
      isCompleted = false;
    };
    workoutSessions.add(id, session);
    nextSessionId += 1;
    id;
  };

  public shared ({ caller }) func addExerciseToSession(
    sessionId : Nat,
    exerciseId : Nat,
    weight : Float,
    reps : Nat,
    sets : Nat,
    comments : Text,
  ) : async () {
    switch (workoutSessions.get(sessionId)) {
      case (null) { Runtime.trap("Session not found") };
      case (?session) {
        switch (exerciseLibrary.get(exerciseId)) {
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
            workoutSessions.add(sessionId, updatedSession);
          };
        };
      };
    };
  };

  public shared ({ caller }) func removeExerciseFromSession(sessionId : Nat, exerciseIndex : Nat) : async () {
    switch (workoutSessions.get(sessionId)) {
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
        workoutSessions.add(sessionId, updatedSession);
      };
    };
  };

  public query ({ caller }) func getSessionExercises(sessionId : Nat) : async [WorkoutExercise] {
    switch (workoutSessions.get(sessionId)) {
      case (null) { Runtime.trap("Session not found") };
      case (?session) { session.exercises };
    };
  };

  public query ({ caller }) func getWorkoutSessionsByDate() : async [WorkoutSession] {
    workoutSessions.values().toArray();
  };

  //--------------------------------------------------------------------------
  // Workout History

  public query ({ caller }) func getWorkoutHistory() : async [WorkoutSessionHistory] {
    let sessions = workoutSessions.values().toArray();
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

  //--------------------------------------------------------------------------
  // Utility Functions

  public query ({ caller }) func getNextExerciseId() : async Nat {
    nextExerciseId;
  };

  public query ({ caller }) func getNextSessionId() : async Nat {
    nextSessionId;
  };
};
