function getCanvasPos(e) {
  const rect = canvasElement.getBoundingClientRect();
  let clientX, clientY;

  if (e.touches) { // Touch event
    clientX = e.touches[0].clientX;
    clientY = e.touches[0].clientY;
  } else { // Mouse event
    clientX = e.clientX;
    clientY = e.clientY;
  }

  return {
    x: clientX - rect.left,
    y: clientY - rect.top
  };
}

function startDrawing(e) {
  e.preventDefault(); // prevent scrolling on touch
  const { x, y } = getCanvasPos(e);

  tool.beginPath();
  tool.moveTo(x, y);

  const pointdesc = {
    x,
    y,
    desc: "md",
    color: tool.strokeStyle,
    width: tool.lineWidth,
  };
  undoStack.push(pointdesc);
  socket.emit("draw", pointdesc);

  isDrawing = true;
}

function draw(e) {
  if (!isDrawing) return;
  e.preventDefault();

  const { x, y } = getCanvasPos(e);

  tool.lineTo(x, y);
  tool.stroke();

  const pointdesc = {
    x,
    y,
    desc: "mm",
    color: tool.strokeStyle,
    width: tool.lineWidth,
  };
  undoStack.push(pointdesc);
  socket.emit("draw", pointdesc);
}

function stopDrawing() {
  isDrawing = false;
}

// --- Mouse Events ---
canvasElement.addEventListener("mousedown", startDrawing);
canvasElement.addEventListener("mousemove", draw);
canvasElement.addEventListener("mouseup", stopDrawing);
canvasElement.addEventListener("mouseleave", stopDrawing);

// --- Touch Events ---
canvasElement.addEventListener("touchstart", startDrawing, { passive: false });
canvasElement.addEventListener("touchmove", draw, { passive: false });
canvasElement.addEventListener("touchend", stopDrawing);
canvasElement.addEventListener("touchcancel", stopDrawing);
