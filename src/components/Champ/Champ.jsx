import { useContext, useEffect, useState } from "react";
import PickProvider, { PickContext } from "../PickProvider";
import "./Champ.css";

const Champ = ({ champ, id, dimStyle, picked }) => {
  const CHAMP_ICON_API =
    "https://cdn.communitydragon.org/latest/champion/generic/square";

  const { state, dispatch } = useContext(PickContext);

  const handleChampClick = (e) => {
    const inBlue = state.blueChamps.includes(champ);
    const inRed = state.redChamps.includes(champ);

    if (inBlue) {
      dispatch({ type: "REMOVE_BLUE_CHAMP", payload: { champ } });
      return;
    }

    if (inRed) {
      dispatch({ type: "REMOVE_RED_CHAMP", payload: { champ } });
      return;
    }

    if (state.currentTeam === "blue") {
      if (inBlue || inRed) {
        alert(`${champ} already picked`);
        return;
      }
      //pass the ID and the champ b/c there could be
      //conflicts getting the image w/ just the name as text
      dispatch({ type: "ADD_BLUE_CHAMP", payload: { id, champ } });
    } else {
      dispatch({ type: "ADD_RED_CHAMP", payload: { id, champ } });
    }
  };

  if (champ) {
    return (
      <div className="champ-wrapper">
        <img
          className="champ"
          onClick={handleChampClick}
          src={CHAMP_ICON_API.replaceAll("generic", id)}
          style={dimStyle}
        ></img>
        <p className="name">{champ}</p>
      </div>
    );
  } else {
    return <div className="champ"></div>;
  }
};
export default Champ;
