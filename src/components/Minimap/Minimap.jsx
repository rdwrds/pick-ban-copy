import { useContext } from "react";
import "./Minimap.css";
import { PickContext } from "../PickProvider";
import WEIRD_CHAMP_NAMES from "../../data/minimap_champ_icons";
import PaintCanvas from "../PaintCanvas/PaintCanvas";

//this component is redundant
const Minimap = () => {
  const CHAMP_MINIMAP_DATA_API =
    "https://raw.communitydragon.org/latest/game/assets/characters/CHAMP/hud/CHAMP_circle.png";

  const HD_IN_GAME_MINIMAP = "https://puu.sh/j5JRu/bbfa70a9eb.jpg";
  const IN_GAME_MINIMAP = "https://loldodgegame.com/lol-guessr/map.png";
  //https://raw.communitydragon.org/latest/game/assets/maps/info/map11/2dlevelminimap_base_baron1.png

  const RED_MINION_ICON =
    "https://raw.communitydragon.org/latest/game/assets/characters/ha_chaosminionmelee/hud/redmelee_circle.png";

  return (
    <PaintCanvas
      id={"canvas"}
      canvasHeight={360}
      canvasWidth={360}
      dialog={false}
    />
  );
};
export default Minimap;
