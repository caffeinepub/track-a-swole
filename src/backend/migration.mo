import Map "mo:core/Map";
import Nat "mo:core/Nat";

module {
  type OldExercise = {
    id : Nat;
    name : Text;
  };

  type OldActor = {
    exerciseLibrary : Map.Map<Nat, OldExercise>;
  };

  type Set = {
    weight : Nat;
    reps : Nat;
  };

  type NewExercise = {
    id : Nat;
    name : Text;
    sets : [Set];
    comments : Text;
  };

  type NewActor = {
    exerciseLibrary : Map.Map<Nat, NewExercise>;
  };

  public func run(old : OldActor) : NewActor {
    let newExerciseLibrary = old.exerciseLibrary.map<Nat, OldExercise, NewExercise>(
      func(_id, oldExercise) {
        let defaultSets : [Set] = [defaultSet(), defaultSet(), defaultSet()];
        { oldExercise with sets = defaultSets; comments = "" };
      }
    );
    { exerciseLibrary = newExerciseLibrary };
  };

  func defaultSet() : Set {
    { weight = 0; reps = 0 };
  };
};
