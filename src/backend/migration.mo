import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";

module {
  type OldActor = {
    exerciseLibrary : Map.Map<Nat, {
      id : Nat;
      name : Text;
      sets : [{
        weight : Nat;
        reps : Nat;
      }];
      comments : Text;
    }>;
    workoutSessions : Map.Map<Nat, {
      id : Nat;
      name : Text;
      date : Int;
      exercises : [{
        exerciseId : Nat;
        exerciseName : Text;
        weight : Float;
        reps : Nat;
        sets : Nat;
        comments : Text;
      }];
      isCompleted : Bool;
    }>;
  };

  type NewActor = {
    exerciseLibrary : Map.Map<Principal, Map.Map<Nat, {
      id : Nat;
      name : Text;
      sets : [{
        weight : Nat;
        reps : Nat;
      }];
      comments : Text;
    }>>;
    workoutSessions : Map.Map<Principal, Map.Map<Nat, {
      id : Nat;
      name : Text;
      date : Int;
      exercises : [{
        exerciseId : Nat;
        exerciseName : Text;
        weight : Float;
        reps : Nat;
        sets : Nat;
        comments : Text;
      }];
      isCompleted : Bool;
    }>>;
  };

  public func run(_old : OldActor) : NewActor {
    let emptyPrinicipalMap = Map.empty<Principal, Map.Map<Nat, { id : Nat; name : Text; sets : [{
                          weight : Nat;
                          reps : Nat;
    }]; comments : Text }>>();
    let emptySessionMap = Map.empty<Principal, Map.Map<Nat, {
      id : Nat;
      name : Text;
      date : Int;
      exercises : [{
        exerciseId : Nat;
        exerciseName : Text;
        weight : Float;
        reps : Nat;
        sets : Nat;
        comments : Text;
      }];
      isCompleted : Bool;
    }>>();
    {
      exerciseLibrary = emptyPrinicipalMap;
      workoutSessions = emptySessionMap;
    };
  };
};
