import PaintCanvas from "../PaintCanvas/PaintCanvas";

const CanvasDialog = ({ dialogOpen }) => {
  return (
    <dialog open={dialogOpen} className="canvas-dialog">
      <PaintCanvas
        id={"dialog-canvas"}
        canvasHeight={800}
        canvasWidth={800}
        dialog={true}
      />
    </dialog>
  );
};
export default CanvasDialog;
