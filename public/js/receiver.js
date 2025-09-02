// Draw events
socket.on("draw", (pointdesc) => {
  tool.strokeStyle = pointdesc.color;
  tool.lineWidth = pointdesc.width;
  if (pointdesc.desc === "md") {
    tool.beginPath();
    tool.moveTo(pointdesc.x, pointdesc.y);
  } else if (pointdesc.desc === "mm") {
    tool.lineTo(pointdesc.x, pointdesc.y);
    tool.stroke();
  }
});

// Undo / Redo
socket.on("undo", (stack) => {
  undoStack = stack;
  undo();
});

socket.on("redo", (stack) => {
  redoStack = stack;
  redo();
});

// Clear canvas
socket.on("clearCanvas", () => {
  tool.clearRect(0, 0, canvasElement.width, canvasElement.height);
});

// Sticky notes
// Create sticky from others
// Sticky notes
// Create sticky from others
// Create sticky when server says so

socket.on("sticky:create", (data) => {
  if (document.getElementById(data.id)) return; // avoid duplicates

  let sticky = createOuterShell(data.id);
  sticky.style.left = data.left + "px";
  sticky.style.top = data.top + "px";

  let textArea = document.createElement("textarea");
  textArea.className = "textarea";
  textArea.value = data.text || "";
  sticky.appendChild(textArea);

  textArea.addEventListener("input", () => {
    socket.emit("sticky:update", { id: data.id, text: textArea.value });
  });
});

// Realtime move
socket.on("sticky:move", ({ id, left, top }) => {
  let sticky = document.getElementById(id);
  if (sticky) {
    sticky.style.left = left + "px";
    sticky.style.top = top + "px";
  }
});

// Update text/minimize
socket.on("sticky:update", (data) => {
  let sticky = document.getElementById(data.id);
  if (!sticky) return;

  if (data.text !== undefined) {
    sticky.querySelector("textarea").value = data.text;
  }

  if (data.minimized !== undefined) {
    let content = sticky.querySelector("textarea");
    if (content) {
      content.style.display = data.minimized ? "none" : "block";
      sticky.querySelector(".minimize").textContent = data.minimized ? "+" : "-";
    }
  }
});

// Delete
socket.on("sticky:delete", (id) => {
  let sticky = document.getElementById(id);
  if (sticky) sticky.remove();
});
