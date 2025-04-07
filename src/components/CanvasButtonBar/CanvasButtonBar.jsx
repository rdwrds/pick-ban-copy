import "./CanvasButtonBar.css";

const CanvasButtonBar = ({ canvas }) => {
  return (
    <div className="button-bar">
      <button
        className="btn-draw"
        onClick={() => {
          canvas.isDrawingMode = !canvas.isDrawingMode;
        }}
      >
        draw
      </button>
      <button
        className="btn-draw"
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
        className="btn-draw"
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
