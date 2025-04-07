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

  //we wont need dispatch
  const { state, _ } = useContext(PickContext);

  return (
    <div className="minimap">
      <PaintCanvas />
    </div>
  );
};
export default Minimap;
