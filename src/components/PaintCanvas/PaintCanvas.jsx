import { useContext, useEffect, useRef, useState, Fragment } from "react";
import "./PaintCanvas.css";
import fog_of_war from "../../assets/base_sr_fog.png";
import blue_turret from "../../assets/blue_turret.png";
import red_turret from "../../assets/red_turret.png";
import { PickContext } from "../PickProvider";
import { STRUCTURES, CAMPS, BUFFS } from "../../data/locations.js";
import { CanvasButtonBar, ImgBar, ChampBar } from "../../components";
const PaintCanvas = () => {
  const IN_GAME_MINIMAP =
    "https://raw.communitydragon.org/latest/game/assets/maps/info/map11/2dlevelminimap_base_baron1.png";
  const NEUTRAL_TOWER =
    "https://raw.communitydragon.org/latest/game/assets/ux/minimap/icons/icon_ui_tower_minimap.png";
  const canvasRef = useRef(null);
  const imageRef = useRef(null);
  const fogRef = useRef(null);

  const { state, _ } = useContext(PickContext);

  const [canvas, setCanvas] = useState(null);
  const [fabricLoaded, setFabricLoaded] = useState(false);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "/pick-ban-copy/fabric.js"; // Adjust path as needed
    script.async = true;

    script.onload = () => {
      console.log("Fabric.js loaded");
      setFabricLoaded(true); // Set fabricLoaded to true once Fabric is loaded
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script); // Clean up script when component is unmounted
    };
  }, []);

  useEffect(() => {
    if (!fabricLoaded) return;

    initFogOfWar(canvas);
    initJungleCamps(canvas);
  }, [canvas]);

  useEffect(() => {
    if (!fabricLoaded) return; // Wait for fabric to be loaded

    console.log(imageRef.current);
    const image = window.fabric.Image.fromURL(IN_GAME_MINIMAP, (img) => {
      img.scaleToWidth(canvas.width);
      img.scaleToHeight(canvas.height);
      canvas.add(img);
      img.selectable = false;
      img.erasable = false;
    });

    const canvas = new window.fabric.Canvas("canvas", {
      //cant set size of canvas with CSS, gotta do it here
      isDrawingMode: false,
      height: 360,
      width: 360,
      backgroundImage: image,
    });

    const brush = new window.fabric.PencilBrush(canvas);
    // brush.color = "red";
    // brush.width = 4;
    // brush.shadow = new window.fabric.Shadow("rgb(255,255,255) 0px 0px 4px");

    canvas.freeDrawingBrush = brush;

    setCanvas(canvas);
  }, [fabricLoaded]);

  const addIconsToCanvas = (obj_array, image, canvas) => {
    obj_array.map((struct) => {
      const { x, y } = struct;

      //needs to be 533/535 b/c thats the size of the IMAGE
      //THE DOTS WERE PLACED AND ALIGNED TO
      //the fog width does not matter in comparison.
      const scaleX = x * (canvas.width / 533) - 20;
      const scaleY = y * (canvas.height / 535) - 20;

      const tower = new window.fabric.Image.fromURL(image, (img) => {
        img.originX = "center";
        img.originY = "center";
        img.left = scaleX;
        img.top = scaleY;
        img.scaleToWidth(canvas.width / 15);
        img.scaleToHeight(canvas.height / 15);
        img.fill = "red";
        canvas.add(img);
      });
    });
  };

  //add clippaths for icons that grant vision
  const addClipsToCanvas = (obj_array, canvas) => {
    console.log(fogRef.current);

    const fog_img = new window.fabric.Image(fogRef.current, {
      scaleX: canvas.width / fogRef.current.width,
      scaleY: canvas.height / fogRef.current.height,
      selectable: false,
      erasable: false,
    });

    const clipPaths = obj_array.map((struct) => {
      const { x, y } = struct;

      //the hardcoded offset has no effect on the positions
      const scaleX = x * (canvas.width / 533);
      const scaleY = y * (canvas.height / 535);

      const circ = new window.fabric.Circle({
        originX: "left",
        originY: "top",
        top: scaleY,
        left: scaleX,
        radius: 28,
        inverted: true,
        absolutePositioned: true,
      });

      return circ;
    });

    //offset the clip group to make it look good...
    //lost a week to this..
    const clipGroup = new window.fabric.Group(clipPaths, {
      top: -10,
      left: -5,
      inverted: true,
      absolutePositioned: true,
      originX: "left",
      originY: "top",
    });

    fog_img.clipPath = clipGroup;

    canvas.add(fog_img);

    console.log(fog_img);

    canvas.renderAll();
    canvas.bringToFront(fog_img);
  };

  const initFogOfWar = (canvas) => {
    addIconsToCanvas(STRUCTURES.BLUE_SIDE, blue_turret, canvas);
    addIconsToCanvas(STRUCTURES.RED_SIDE, red_turret, canvas);

    //4-7-25 - until we implement a way to continuously add clippaths,
    //we gotta combine the arrays and do the clips at once
    const combinedArrays = STRUCTURES.RED_SIDE.concat(STRUCTURES.BLUE_SIDE);
    addClipsToCanvas(combinedArrays, canvas);
  };

  const initJungleCamps = (canvas) => {
    const BUFF =
      "https://raw.communitydragon.org/latest/game/assets/ux/minimap/icons/red.png";
    const CAMP =
      "https://raw.communitydragon.org/latest/game/assets/ux/minimap/icons/smallcamp.png";
    addIconsToCanvas(CAMPS, CAMP, canvas);
    addIconsToCanvas(BUFFS, BUFF, canvas);
  };

  const handleClick = (e, ASSET_URL) => {
    const image = window.fabric.Image.fromURL(ASSET_URL, (img) => {
      //should be  /17
      img.scaleToWidth(canvas.width / 17);
      img.scaleToHeight(canvas.height / 17);
      //spawn the image away from the corner
      img.top = 100;
      img.left = 100;
      img.selectable = true;
      img.lockRotation = true;
      img.lockScalingX = true;
      img.lockScalingY = true;
      img.hasControls = false;
      img.erasable = true;

      canvas.add(img);

      canvas.setActiveObject(img);
    });

    //initFogOfWar(canvas);
  };

  return (
    <div className="canvas-wrapper">
      <ImgBar handleClick={handleClick} />
      <ChampBar handleClick={handleClick} />
      <CanvasButtonBar canvas={canvas} />
      <canvas id="canvas" className="paint-canvas" ref={canvasRef}>
        <img id="fog" src={fog_of_war} ref={fogRef} />
        <img id="imag" src={IN_GAME_MINIMAP} ref={imageRef} />
      </canvas>
    </div>
  );
};
export default PaintCanvas;
