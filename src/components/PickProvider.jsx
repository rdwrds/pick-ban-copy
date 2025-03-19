import { createContext, useReducer } from "react";

export const PickContext = createContext();

const initialState = {
  blueChamps: ["", "", "", "", ""],
  redChamps: ["", "", "", "", ""],
  bluePick: 0,
  redPick: 0,
  currentPick: 0,
  currentTeam: "blue",
};

//TODO: make this work of art
//change the current pick if we take a champ out of the draft
// (or dont cuz thats now how league works)
function reducer(state, action) {
  const bluePickOrder = [0, 3, 4, 7, 8];
  const teamToSwap = bluePickOrder.includes(state.currentPick + 1)
    ? "blue"
    : "red";

  switch (action.type) {
    case "ADD_BLUE_CHAMP":
      return {
        blueChamps: state.blueChamps.map((pick, index) => {
          return index === state.bluePick ? action.payload.champ : pick;
        }),
        redChamps: state.redChamps,
        bluePick: state.bluePick + 1,
        redPick: state.redPick,
        currentPick: state.currentPick + 1,
        //swap the team
        currentTeam: bluePickOrder.includes(state.currentPick + 1)
          ? "blue"
          : "red",
      };
    case "REMOVE_BLUE_CHAMP":
      return {
        blueChamps: state.blueChamps.map((pick, index) => {
          return pick === action.payload.champ ? "" : pick;
        }),
        redChamps: state.redChamps,
        bluePick: state.bluePick - 1,
        redPick: state.redPick,
        currentPick: state.currentPick - 1,
        //swap the team
        currentTeam: "blue",
      };
    case "ADD_RED_CHAMP":
      return {
        redChamps: state.redChamps.map((pick, index) => {
          return index === state.redPick ? action.payload.champ : pick;
        }),
        blueChamps: state.blueChamps,
        bluePick: state.bluePick,
        redPick: state.redPick + 1,
        currentPick: state.currentPick + 1,
        currentTeam: bluePickOrder.includes(state.currentPick + 1)
          ? "blue"
          : "red",
      };
    case "REMOVE_RED_CHAMP":
      return {
        redChamps: state.redChamps.map((pick, index) => {
          return pick === action.payload.champ ? "" : pick;
        }),
        blueChamps: state.blueChamps,
        bluePick: state.bluePick,
        redPick: state.redPick - 1,
        currentPick: state.currentPick - 1,
        //swap the team
        currentTeam: "red",
      };
  }
}

const PickProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <PickContext.Provider value={{ state, dispatch }}>
      {children}
    </PickContext.Provider>
  );
};
export default PickProvider;
