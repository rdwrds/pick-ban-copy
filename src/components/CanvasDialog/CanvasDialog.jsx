import PaintCanvas from "../PaintCanvas/PaintCanvas";

const CanvasDialog = ({ dialogOpen, setDialogOpen, canvasToLoad }) => {
  return (
    <dialog open={dialogOpen} className="canvas-dialog">
      <button
        type="button"
        onClick={(e) => {
          setDialogOpen(false);
        }}
      >
        button
      </button>
      <PaintCanvas
        id={"dialog-canvas"}
        canvasHeight={800}
        canvasWidth={800}
        dialog={true}
        canvasToLoad={canvasToLoad}
      />
    </dialog>
  );
};
export default CanvasDialog;
