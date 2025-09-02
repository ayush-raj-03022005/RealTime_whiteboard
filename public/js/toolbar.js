// let currentTool = "pencil";
let pencilColor = "#000000";
let pencilWidth = 2;
let eraserWidth = 10;

// Select toolbar buttons
let toolArr = document.querySelectorAll(".tool");

// Pencil options
let pencilOptions = document.getElementById("pencil-options");
let pencilWidthSlider = document.getElementById("pencil-width");
let colorOptions = document.querySelectorAll(".color");

// Eraser options
let eraserOptions = document.getElementById("eraser-options");
let eraserWidthSlider = document.getElementById("eraser-width");

// Loop over toolbar tools
for (let i = 0; i < toolArr.length; i++) {
  toolArr[i].addEventListener("click", function () {
    const toolname = toolArr[i].id;

    if (toolname === "pencil") {
      currentTool = "pencil";
      tool.strokeStyle = pencilColor;
      tool.lineWidth = pencilWidth;

      // toggle pencil options
      pencilOptions.classList.toggle("hidden");
      eraserOptions.classList.add("hidden");

    } else if (toolname === "eraser") {
      currentTool = "eraser";
      tool.strokeStyle = "white";
      tool.lineWidth = eraserWidth;

      // toggle eraser options
      eraserOptions.classList.toggle("hidden");
      pencilOptions.classList.add("hidden");

    } else if (toolname === "sticky") {
      createStickyNote();
      pencilOptions.classList.add("hidden");
      eraserOptions.classList.add("hidden");

    } else if (toolname === "upload") {
      uploadFile();
      pencilOptions.classList.add("hidden");
      eraserOptions.classList.add("hidden");

    } else if (toolname === "download") {
      downloadFile();
      pencilOptions.classList.add("hidden");
      eraserOptions.classList.add("hidden");

    } else if (toolname === "undo") {
      undo();
      socket.emit("undo", undoStack);
      pencilOptions.classList.add("hidden");
      eraserOptions.classList.add("hidden");

    } else if (toolname === "redo") {
      redo();
      socket.emit("redo", redoStack);
      pencilOptions.classList.add("hidden");
      eraserOptions.classList.add("hidden");

    } else if (toolname === "clear") {
      tool.clearRect(0, 0, canvasElement.width, canvasElement.height);
      socket.emit("clearCanvas");
      pencilOptions.classList.add("hidden");
      eraserOptions.classList.add("hidden");
    }
  });
}

// 🎨 Pencil color change
colorOptions.forEach((colorEl) => {
  colorEl.addEventListener("click", () => {
    pencilColor = colorEl.dataset.color;
    if (currentTool === "pencil") {
      tool.strokeStyle = pencilColor;
    }
  });
});

// ✏️ Pencil width
pencilWidthSlider.addEventListener("input", (e) => {
  pencilWidth = e.target.value;
  if (currentTool === "pencil") {
    tool.lineWidth = pencilWidth;
  }
});

// 🧽 Eraser width
eraserWidthSlider.addEventListener("input", (e) => {
  eraserWidth = e.target.value;
  if (currentTool === "eraser") {
    tool.lineWidth = eraserWidth;
  }
});
