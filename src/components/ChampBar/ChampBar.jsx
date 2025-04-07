import WEIRD_CHAMP_NAMES from "../../data/minimap_champ_icons";
import { useContext } from "react";
import { PickContext } from "../PickProvider";

const ChampBar = ({ handleClick }) => {
  const CHAMP_MINIMAP_DATA_API =
    "https://raw.communitydragon.org/latest/game/assets/characters/CHAMP/hud/CHAMP_circle.png";

  const { state, _ } = useContext(PickContext);
  const getChampMinimapIcon = (champ) => {
    const weird_name = WEIRD_CHAMP_NAMES[champ];

    //format the src
    let src = CHAMP_MINIMAP_DATA_API.replaceAll(
      "CHAMP",
      champ.toLowerCase().replaceAll(/[.'\s]/g, "")
    );

    //if the champ has a unique name/file path, replace it
    if (weird_name) {
      src = CHAMP_MINIMAP_DATA_API.replace(
        "CHAMP/hud/CHAMP_circle.png",
        `${weird_name.name.toLowerCase()}/hud/${weird_name.path}`
      );
    }

    return src;
  };

  return (
    <div className="icon-container">
      <div className="minimap-icons">
        {state.blueChamps.map((champ) => {
          //needs the global flag or its gg

          const src = getChampMinimapIcon(champ);

          return (
            champ && (
              <img
                className="minimap-champ-icon"
                src={src}
                onClick={(e) => {
                  console.log("eep");
                  handleClick(e, src);
                }}
                //any champ with a weird name SHOULD be correct by default
                //therefore, never running this code unless the API changes.
                onError={(e) => {
                  if (e.target.src.includes("circle.png")) {
                    e.target.src = e.target.src.replace("circle", "circle_0");
                  } else if (e.target.src.includes("circle_0.png")) {
                    console.log(src);
                  }
                  e.target.onclick = (event) =>
                    handleClick(event, e.target.src);
                }}
              />
            )
          );
        })}
      </div>
      <div className="minimap-icons">
        {state.redChamps.map((champ) => {
          //needs the global flag or its gg

          const src = getChampMinimapIcon(champ);

          return (
            champ && (
              <img
                className="minimap-champ-icon"
                onClick={(e) => {
                  handleClick(e, src);
                }}
                src={src}
                //any champ with a weird name SHOULD be correct by default
                //therefore, never running this code unless the API changes.
                onError={(e) => {
                  if (e.target.src.includes("circle.png")) {
                    e.target.src = e.target.src.replace("circle", "circle_0");
                  } else if (e.target.src.includes("circle_0.png")) {
                    console.log(src);
                  }
                  e.target.onclick = (event) =>
                    handleClick(event, e.target.src);
                }}
              />
            )
          );
        })}
      </div>
    </div>
  );
};

export default ChampBar;
