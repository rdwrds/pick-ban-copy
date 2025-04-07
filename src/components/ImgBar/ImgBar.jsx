const ImgBar = ({ handleClick }) => {
  const BLUE_MINION_ICON =
    "https://raw.communitydragon.org/latest/game/assets/characters/ha_orderminionmelee/hud/bluemelee_circle.png";
  const CONTROL_TRINKET_ICON =
    "https://raw.communitydragon.org/latest/game/assets/ux/minimap/icons/minimap_jammer_friendly.png";
  const YELLOW_TRINKET_ICON =
    "https://raw.communitydragon.org/latest/game/assets/ux/minimap/icons/minimap_ward_blue_full.png";
  const BLUE_TRINKET_ICON =
    "https://raw.communitydragon.org/latest/game/assets/characters/bluetrinket/hud/bluetrinket_square.png";
  const RED_MINION_ICON =
    "https://raw.communitydragon.org/latest/game/assets/characters/ha_chaosminionmelee/hud/redmelee_circle.png";

  return (
    <div className="minion-icon-container">
      <div className="minion-icons">
        <img
          className="minimap-trinket-icon"
          onClick={(e) => {
            handleClick(e, BLUE_MINION_ICON);
          }}
          src={BLUE_MINION_ICON}
        />
        <div className="ward-icons">
          <img
            className="minimap-trinket-icon"
            onClick={(e) => {
              handleClick(e, YELLOW_TRINKET_ICON);
            }}
            src={YELLOW_TRINKET_ICON}
          />
          <img
            className="minimap-trinket-icon"
            onClick={(e) => {
              handleClick(e, CONTROL_TRINKET_ICON);
            }}
            src={CONTROL_TRINKET_ICON}
          />
          <img
            className="minimap-trinket-icon"
            onClick={(e) => {
              handleClick(e, BLUE_TRINKET_ICON);
            }}
            src={BLUE_TRINKET_ICON}
          />
        </div>
        <img
          className="minimap-trinket-icon"
          onClick={(e) => {
            handleClick(e, RED_MINION_ICON);
          }}
          src={RED_MINION_ICON}
        />
      </div>
    </div>
  );
};

export default ImgBar;
