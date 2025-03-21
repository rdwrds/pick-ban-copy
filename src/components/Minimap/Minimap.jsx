import { useContext } from "react";
import "./Minimap.css";
import { PickContext } from "../PickProvider";
import WEIRD_CHAMP_NAMES from "../../data/minimap_champ_icons";
import PaintCanvas from "../PaintCanvas/PaintCanvas";

const Minimap = () => {
  const CHAMP_MINIMAP_DATA_API =
    "https://raw.communitydragon.org/latest/game/assets/characters/CHAMP/hud/CHAMP_circle.png";

  const HD_IN_GAME_MINIMAP = "https://puu.sh/j5JRu/bbfa70a9eb.jpg";
  const IN_GAME_MINIMAP = "https://loldodgegame.com/lol-guessr/map.png";
  //https://raw.communitydragon.org/latest/game/assets/maps/info/map11/2dlevelminimap_base_baron1.png

  const RED_MINION_ICON =
    "https://raw.communitydragon.org/latest/game/assets/characters/ha_chaosminionmelee/hud/redmelee_circle.png";
  const BLUE_MINION_ICON =
    "https://raw.communitydragon.org/latest/game/assets/characters/ha_orderminionmelee/hud/bluemelee_circle.png";

  const CONTROL_TRINKET_ICON =
    "https://static.wikia.nocookie.net/leagueoflegends/images/4/44/Control_Ward_item_old.png";
  const YELLOW_TRINKET_ICON =
    "https://raw.communitydragon.org/latest/game/assets/characters/yellowtrinket/hud/yellowtrinket_square.png";
  const BLUE_TRINKET_ICON =
    "https://raw.communitydragon.org/latest/game/assets/characters/bluetrinket/hud/bluetrinket_square.png";

  //we wont need dispatch
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
    <div className="minimap">
      <PaintCanvas />
      <div className="minion-icon-container">
        <div className="minion-icons">
          <img className="minimap-trinket-icon" src={BLUE_MINION_ICON} />
          <div className="ward-icons">
            <img className="minimap-trinket-icon" src={YELLOW_TRINKET_ICON} />
            <img className="minimap-trinket-icon" src={CONTROL_TRINKET_ICON} />
            <img className="minimap-trinket-icon" src={BLUE_TRINKET_ICON} />
          </div>
          <img className="minimap-trinket-icon" src={RED_MINION_ICON} />
        </div>
      </div>

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
                  //any champ with a weird name SHOULD be correct by default
                  //therefore, never running this code unless the API changes.
                  onError={(e) => {
                    if (e.target.src.includes("circle.png")) {
                      e.target.src = e.target.src.replace("circle", "circle_0");
                    } else if (e.target.src.includes("circle_0.png")) {
                      console.log(src);
                    }
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
                  src={src}
                  //any champ with a weird name SHOULD be correct by default
                  //therefore, never running this code unless the API changes.
                  onError={(e) => {
                    if (e.target.src.includes("circle.png")) {
                      e.target.src = e.target.src.replace("circle", "circle_0");
                    } else if (e.target.src.includes("circle_0.png")) {
                      console.log(src);
                    }
                  }}
                />
              )
            );
          })}
        </div>
      </div>
    </div>
  );
};
export default Minimap;
