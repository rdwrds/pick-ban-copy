import { useContext, useEffect, useRef, useState, Fragment } from "react";
import "./PaintCanvas.css";
import fog_of_war from "../../assets/base_sr_fog.png";
import blue_turret from "../../assets/blue_turret.png";
import red_turret from "../../assets/red_turret.png";
import blue_nexus from "../../assets/blue_nexus.png";
import red_nexus from "../../assets/red_nexus.png";
import red_inhib from "../../assets/red_inhib.png";
import blue_inhib from "../../assets/blue_inhib.png";
import { PickContext } from "../PickProvider";
import { CanvasContext } from "../../App.jsx";
import {
  STRUCTURES,
  CAMPS,
  BUFFS,
  BARON_PIT,
  DRAGON_PIT,
  BASE_VISION,
} from "../../data/locations.js";
import { CanvasButtonBar, ImgBar, ChampBar } from "../../components";

const PaintCanvas = ({
  id,
  canvasHeight,
  canvasWidth,
  dialog,
  canvasToLoad,
}) => {
  console.log(canvasToLoad);

  const clipGroupRef = useRef(null);

  const IN_GAME_MINIMAP =
    "https://raw.communitydragon.org/latest/game/assets/maps/info/map11/2dlevelminimap_base_baron1.png";
  const NEUTRAL_TOWER =
    "https://raw.communitydragon.org/latest/game/assets/ux/minimap/icons/icon_ui_tower_minimap.png";
  const canvasRef = useRef(null);
  const imageRef = useRef(null);
  const fogRef = useRef(null);

  const { state, _ } = useContext(PickContext);

  const { canvas, setCanvas } = useContext(CanvasContext);
  const [fabricLoaded, setFabricLoaded] = useState(false);
  const [fogState, setFogState] = useState(null);
  const [clipGroupState, setClipGroupState] = useState(null);
  const [mapsLoaded, setMapsLoaded] = useState(false);

  //load fabric
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "/pick-ban-copy/fabric.js"; // Adjust path as needed
    script.async = true;

    script.onload = () => {
      console.log("Fabric.js loaded");
      setFabricLoaded(true);
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  //load the default canvas
  useEffect(() => {
    if (!fabricLoaded) return; // Wait for fabric to be loaded

    const image = window.fabric.Image.fromURL(IN_GAME_MINIMAP, (img) => {
      img.scaleToWidth(canvas.width);
      img.scaleToHeight(canvas.height);
      img.name = "minimap";

      canvas.setBackgroundImage(img);
      img.selectable = false;
      img.erasable = false;
    });

    const canvas = new window.fabric.Canvas(id, {
      //cant set size of canvas with CSS, gotta do it here
      isDrawingMode: false,
      height: canvasHeight,
      width: canvasWidth,
      backgroundImage: image,
    });

    const brush = new window.fabric.PencilBrush(canvas);
    brush.color = "red";
    brush.width = 5;
    brush.shadow = new window.fabric.Shadow("rgb(255,255,255) 0px 0px 2px");

    canvas.freeDrawingBrush = brush;

    console.log("THISCANVASSS");
    console.log(canvas);

    setCanvas(canvas);
  }, [fabricLoaded]);

  //initialize assets
  useEffect(() => {
    if (!fabricLoaded) return;

    if (canvasToLoad) {
      setMapsLoaded(true);
    } else {
      initFogOfWar(canvas);
      initJungleCamps(canvas);
      setMapsLoaded(true);
    }
  }, [canvas]);

  //load custom canvas
  useEffect(() => {
    console.log("maps loaded!");

    console.log("canvas save?: " + (canvasToLoad ? "yes" : "no"));

    if (canvasToLoad) {
      const maps = [
        "minimap",
        "http://localhost:5173/pick-ban-copy/src/assets/base_sr_fog.png",
      ];

      canvas.loadFromJSON(
        canvasToLoad,
        () => {
          //for some reason, setting the H/W and then scaling it doenst make it work well
          // canvas.backgroundImage.height = canvasHeight;
          // canvas.backgroundImage.width = canvasHeight;
          //canvasToLoad = canvasToLoad;

          canvas.backgroundImage.scaleToHeight(canvasHeight);
          canvas.backgroundImage.scaleToWidth(canvasWidth);
          canvas.renderAll();

          // canvas.height = canvasToLoad.height;
          // canvas.width = canvasToLoad.width;
        },
        (jsonObj, canvasObj) => {
          canvasObj.scaleToHeight(canvas.height / 19);
          canvasObj.scaleToWidth(canvas.width / 19);

          const x = canvasObj.left;
          const y = canvasObj.top;

          canvasObj.left = x * (canvasHeight / 360);
          canvasObj.top = y * (canvasHeight / 360);

          if (
            canvasObj.src ===
            "http://localhost:5173/pick-ban-copy/src/assets/base_sr_fog.png"
          ) {
            console.log("RAHHH");
            console.log(canvasObj.clipPath);

            canvasObj.scaleToHeight(canvas.height);
            canvasObj.scaleToWidth(canvas.width);

            // canvasObj.clipGroup.scaleToHeight(800);
            // canvasObj.clipGroup.scaleToWidth(800);
            canvasObj.clipPath.scaleToHeight(800);
            canvasObj.clipPath.scaleToWidth(800);
            console.log(fogRef);

            setFogState(canvasObj);
            setClipGroupState(canvasObj.clipPath);
            setCanvas(canvas);
          }
        }
      );

      //canvas.renderAll();
    }
  }, [mapsLoaded]);

  const addIconsToCanvas = (obj_array, image, canvas) => {
    obj_array.map((struct) => {
      const { x, y } = struct;

      //needs to be 533/535 b/c thats the size of the IMAGE
      //THE DOTS WERE PLACED AND ALIGNED TO
      //the fog width does not matter in comparison.
      const scaleX = x * (canvas.width / 533) - canvasWidth * 0.055;
      const scaleY = y * (canvas.height / 535) - canvasHeight * 0.055;

      const tower = new window.fabric.Image.fromURL(image, (img) => {
        img.originX = "center";
        img.originY = "center";
        img.left = scaleX;
        img.top = scaleY;
        //controls are used to scale/rotate images
        //so still need to lock X/Y regardless
        img.hasControls = false;
        img.lockMovementX = true;
        img.lockMovementY = true;
        img.scaleToWidth(canvas.width / 17);
        img.scaleToHeight(canvas.height / 17);
        img.fill = "red";
        canvas.add(img);
      });
    });
  };

  //add clippaths for icons that grant vision
  const addClipsToCanvas = (obj_array, canvas) => {
    const fog_img = new window.fabric.Image(fogRef.current, {
      scaleX: canvas.width / fogRef.current.width,
      scaleY: canvas.height / fogRef.current.height,
      name: "fog_image",
      selectable: false,
      erasable: false,
    });

    const clipPaths = obj_array.map((struct) => {
      const { x, y } = struct;

      //the hardcoded offset has no effect on the positions
      let scaleX = x * (canvas.width / 533) - canvasWidth * 0.055;
      let scaleY = y * (canvas.height / 535) - canvasWidth * 0.055;
      //scale tower vision from 360px canvas to input size
      let rad = 28.8 * (canvasHeight / 360);

      const circ = new window.fabric.Circle({
        originX: "center",
        originY: "center",
        top: scaleY,
        left: scaleX,
        radius: rad,
        absolutePositioned: true,
      });

      return circ;
    });

    const clipGroup = new window.fabric.Group(clipPaths, {
      top: 0,
      left: 0,
      inverted: true,
      absolutePositioned: true,
      //the reason the clips kept moving is
      //bc the height and width were calculated
      //each time.
      //now we force it to the canvas size
      height: canvasHeight,
      width: canvasWidth,
      originX: "left",
      originY: "top",
      selectable: false,
    });

    //copy these values to state so other objects can
    //manipulate them
    //can cause issues with state != the clip groups below
    if (fogState) {
      console.log("fog loaded");
    } else {
      console.log("fog not loaded");
      setFogState(fog_img);

      setClipGroupState(clipGroup);
    }

    fog_img.clipPath = clipGroup;
    console.log(fog_img.clipPath);
    console.log(clipGroup);

    canvas.add(fog_img);

    canvas.renderAll();
    canvas.bringToFront(fog_img);
    setClipGroupState(clipGroup);
  };

  const initFogOfWar = (canvas) => {
    addIconsToCanvas(STRUCTURES.BLUE_SIDE, blue_turret, canvas);
    addIconsToCanvas(STRUCTURES.RED_SIDE, red_turret, canvas);

    addIconsToCanvas(STRUCTURES.BLUE_SIDE_NEXUS, blue_nexus, canvas);
    addIconsToCanvas(STRUCTURES.RED_SIDE_NEXUS, red_nexus, canvas);

    addIconsToCanvas(STRUCTURES.BLUE_SIDE_INHIBITORS, blue_inhib, canvas);
    addIconsToCanvas(STRUCTURES.RED_SIDE_INHIBITORS, red_inhib, canvas);

    //4-7-25 - until we implement a way to continuously add clippaths,
    //we gotta combine the arrays and do the clips at once
    const combinedArrays = STRUCTURES.RED_SIDE.concat(
      STRUCTURES.BLUE_SIDE
      //BASE_VISION
    );

    addClipsToCanvas(combinedArrays, canvas);
  };

  const initJungleCamps = (canvas) => {
    const BUFF =
      "https://raw.communitydragon.org/latest/game/assets/ux/minimap/icons/red.png";
    const CAMP =
      "https://raw.communitydragon.org/latest/game/assets/ux/minimap/icons/smallcamp.png";

    const BARON =
      "https://raw.communitydragon.org/latest/game/assets/ux/minimap/icons/baron.png";
    const DRAGON =
      "https://raw.communitydragon.org/latest/game/assets/ux/minimap/icons/dragon_ocean.png";

    addIconsToCanvas(CAMPS, CAMP, canvas);
    addIconsToCanvas(BUFFS, BUFF, canvas);

    addIconsToCanvas(BARON_PIT, BARON, canvas);
    addIconsToCanvas(DRAGON_PIT, DRAGON, canvas);
  };

  //canvasToLoad isnt valid here for some reason

  const handleClick = (e, ASSET_URL) => {
    const image = window.fabric.Image.fromURL(ASSET_URL, (img) => {
      img.originX = "center";
      img.originY = "center";
      //should be  /17
      img.scaleToWidth(canvas.width / 19);
      img.scaleToHeight(canvas.height / 19);
      //spawn the image away from the corner
      img.top = 100;
      img.left = 100;
      img.selectable = true;
      img.lockRotation = true;
      img.lockScalingX = true;
      img.lockScalingY = true;
      img.hasControls = false;
      img.erasable = true;

      const circClip = new window.fabric.Circle({
        originX: "center",
        originY: "center",
        top: 100,
        left: 100,
        radius: 28.8 * (canvasHeight / 360),
        inverted: true,
        absolutePositioned: true,
      });

      console.log(canvasToLoad);

      //i chatgpt'd this function,
      //simply setting the clips top/left to the images t/l
      //-doesnt work b/c groups share unique coordinates
      //-compared to the canvas
      img.on("moving", (e) => {
        img.set({ left: e.pointer.x, top: e.pointer.y });
        img.setCoords();

        //img is not persisting when we swap the save
        // console.log(img);

        const center = img.getCenterPoint();

        const invMatrix = window.fabric.util.invertTransform(
          clipGroupState.calcTransformMatrix()
        );
        console.log("clipGroupState: " + clipGroupState);

        // console.log(invMatrix);
        const localCenter = window.fabric.util.transformPoint(
          center,
          invMatrix
        );

        let toMove =
          clipGroupState._objects[clipGroupState._objects.indexOf(circClip)] ||
          circClip;
        // console.log(fogRef);

        // console.log(canvas);
        // console.log(clipGroupState._objects.indexOf(circClip));
        //  console.log(
        //   clipGroupState._objects[clipGroupState._objects.indexOf(circClip)]
        // );

        if (canvasToLoad) {
          //if theres already a clip in the array
          if (clipGroupState._objects.includes(circClip)) {
            // console.log("bruh");

            toMove =
              clipGroupState._objects[
                clipGroupState._objects.indexOf(circClip)
              ];
          }
        }

        //5/10 3:37pm - the circClip and its location are all correct,
        //but the fog clip path isnt updated in the dialog canvas
        //so there must be an issue related to the fogclip
        toMove.set({ left: localCenter.x, top: localCenter.y });
        toMove.setCoords();
        img.set({ dirty: true });

        canvas.renderAll();
      });

      img.on("mousedown", (e) => {
        console.log(canvas);
        console.log(canvasToLoad);
      });

      console.log(clipGroupState);

      clipGroupState.addWithUpdate(circClip);

      canvas.add(img);
      canvas.renderAll();
      canvas.setActiveObject(img);
    });
  };

  //TODO: 4/24: render control components into
  // side bar when in dialog canvas

  if (dialog) {
    return (
      <div className="canvas-wrapper">
        <div className="map-controls">
          <ImgBar handleClick={handleClick} />
          <ChampBar handleClick={handleClick} />
        </div>
        <canvas id={id} className="paint-canvas" ref={canvasRef}>
          <img
            id="fog"
            src={fog_of_war}
            ref={(element) => {
              console.log(fogRef);

              fogRef.current = element;
            }}
          />
          <img id="imag" src={IN_GAME_MINIMAP} ref={imageRef} />
        </canvas>
        <div className="canvas-controls">
          <CanvasButtonBar canvas={canvas} />
        </div>
      </div>
    );
  } else {
    return (
      <div className="canvas-wrapper">
        <div className="map-controls">
          <ImgBar handleClick={handleClick} />
          {/*all the champs and their icons load,
      but when giving them vision, the circClip
      duplicates on error
      - find a way to handle the names w/o error
      so that the clips dont duplicate*/}
          <ChampBar handleClick={handleClick} />
          <CanvasButtonBar canvas={canvas} />
        </div>
        <canvas id={id} className="paint-canvas" ref={canvasRef}>
          <img
            id="fog"
            src={fog_of_war}
            ref={(element) => {
              console.log(fogRef);
              fogRef.current = element;
            }}
          />
          <img id="imag" src={IN_GAME_MINIMAP} ref={imageRef} />
        </canvas>
      </div>
    );
  }
};
export default PaintCanvas;
