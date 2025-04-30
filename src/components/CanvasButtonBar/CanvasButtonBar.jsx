import "./CanvasButtonBar.css";

const CanvasButtonBar = ({ canvas }) => {
  const handleWidthChange = (e) => {
    console.log(e.target.value);
    console.log(canvas.freeDrawingBrush);
    canvas.freeDrawingBrush.width = e.target.value;
  };

  return (
    <div className="button-bar">
      <label className="pen-width-label" for="pen-width">
        Pen Size
      </label>
      <input
        type="range"
        className="pen-width"
        min="0"
        max={"10"}
        onChange={handleWidthChange}
      />

      <input type="color" className="pen-color" />
      <button
        className="map-btn"
        onClick={() => {
          canvas.isDrawingMode = !canvas.isDrawingMode;
        }}
      >
        draw
      </button>
      <button
        className="map-btn"
        onClick={() => {
          const eraser = new window.fabric.EraserBrush(canvas);
          eraser.width = 10;

          //eraser erases but still draws, w/e
          eraser.color = null;
          eraser.stroke = null;
          eraser.shadow = null;
          eraser.opacity = 0;
          canvas.freeDrawingBrush = null;
          canvas.freeDrawingBrush = eraser;
          canvas.isDrawingMode = true;
        }}
      >
        erase
      </button>

      <button
        className="map-btn"
        onClick={() => {
          const toRemove = canvas.getActiveObject();
          if (toRemove) {
            console.log(toRemove.type);

            if (toRemove.type === "activeSelection") {
              toRemove.getObjects().map((obj) => {
                canvas.remove(obj);
              });
            }

            console.log(toRemove);

            canvas.remove(toRemove);
          }
        }}
      >
        garbage
      </button>
    </div>
  );
};
export default CanvasButtonBar;
