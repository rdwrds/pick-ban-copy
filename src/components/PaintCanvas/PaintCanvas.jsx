import { useEffect, useRef, useState } from "react";
import "./PaintCanvas.css";
import { fabric } from "fabric";

const PaintCanvas = () => {
  const IN_GAME_MINIMAP = "https://loldodgegame.com/lol-guessr/map.png";
  const RED_MINION_ICON =
    "https://raw.communitydragon.org/latest/game/assets/characters/ha_chaosminionmelee/hud/redmelee_circle.png";

  const canvasRef = useRef(null);
  const imageRef = useRef(null);

  const [canvas, setCanvas] = useState(null);

  useEffect(() => {
    console.log(imageRef.current);
    const image = fabric.Image.fromURL(IN_GAME_MINIMAP, (img) => {
      img.scaleToWidth(canvas.width);
      img.scaleToHeight(canvas.height);
      canvas.add(img);
      img.selectable = false;
    });

    const canvas = new fabric.Canvas("canvas", {
      //cant set size of canvas with CSS, gotta do it here
      isDrawingMode: false,
      height: 400,
      width: 400,
      backgroundImage: image,
    });

    // const brush = new PencilBrush(canvas);
    // brush.color = "red";
    // brush.width = 1;
    // canvas.freeDrawingBrush = brush;

    setCanvas(canvas);

    //console.log(canvas.toJSON());

    return () => {
      //canvas.dispose();
    };
  }, []);

  const handleClick = (e) => {
    console.log(canvas);

    imageRef.current.width = "50px";

    const image = fabric.Image.fromURL(RED_MINION_ICON, (img) => {
      img.scaleToWidth(canvas.width / 10);
      img.scaleToHeight(canvas.height / 10);
      canvas.add(img);
    });
  };

  const style = { backgroundImage: `url(${IN_GAME_MINIMAP})` };

  return (
    <div className="canvas-wrapper">
      <button className="btn" onClick={handleClick}>
        X
      </button>
      <button
        className="btn-draw"
        onClick={() => {
          canvas.isDrawingMode = !canvas.isDrawingMode;
        }}
      >
        draw
      </button>
      <canvas id="canvas" className="paint-canvas" ref={canvasRef}>
        <img id="imag" src={IN_GAME_MINIMAP} ref={imageRef} />
      </canvas>
    </div>
  );
};
export default PaintCanvas;
