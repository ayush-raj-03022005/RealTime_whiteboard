function undo() {
  tool.clearRect(0, 0, canvasElement.width, canvasElement.height);
  if (undoStack.length > 0) {
    redoStack.push(undoStack.pop());
    for (let i = 0; i < undoStack.length; i++) {
      let { x, y, desc, color, width } = undoStack[i];
      tool.strokeStyle = color || "black";
      tool.lineWidth = width || 1;
      if (desc === "md") {
        tool.beginPath();
        tool.moveTo(x, y);
      } else if (desc === "mm") {
        tool.lineTo(x, y);
        tool.stroke();
      }
    }
  }
}

function redo() {
  if (redoStack.length > 0) {
    let pointdesc = redoStack.pop();
    undoStack.push(pointdesc);
    tool.strokeStyle = pointdesc.color || "black";
    tool.lineWidth = pointdesc.width || 1;
    if (pointdesc.desc === "md") {
      tool.beginPath();
      tool.moveTo(pointdesc.x, pointdesc.y);
    } else if (pointdesc.desc === "mm") {
      tool.lineTo(pointdesc.x, pointdesc.y);
      tool.stroke();
    }
  }
}
