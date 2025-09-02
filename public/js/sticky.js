function createOuterShell(id) {
  let stickyDiv = document.createElement("div");
  let navDiv = document.createElement("div");
  let closeDiv = document.createElement("button");
  let minimizeDiv = document.createElement("button");

  stickyDiv.setAttribute("class", "sticky");
  stickyDiv.id = id || "sticky-" + Date.now();
  stickyDiv.style.position = "absolute"; 
  stickyDiv.style.left = "100px";
  stickyDiv.style.top = "100px";

  navDiv.setAttribute("class", "nav");
  closeDiv.setAttribute("class", "close");
  minimizeDiv.setAttribute("class", "minimize");

  closeDiv.textContent = "X";
  minimizeDiv.textContent = "-";

  stickyDiv.appendChild(navDiv);
  navDiv.appendChild(minimizeDiv);
  navDiv.appendChild(closeDiv);
  document.body.appendChild(stickyDiv);

  // --- Close ---
  closeDiv.addEventListener("click", () => {
    stickyDiv.remove();
    socket.emit("sticky:delete", stickyDiv.id);
  });

  // --- Minimize ---
  let isMinimized = false;
  minimizeDiv.addEventListener("click", function () {
    let content = stickyDiv.querySelector("textarea");
    if (!content) return;
    content.style.display = isMinimized ? "block" : "none";
    minimizeDiv.textContent = isMinimized ? "-" : "+";
    isMinimized = !isMinimized;
    socket.emit("sticky:update", { id: stickyDiv.id, minimized: isMinimized });
  });

  // --- Dragging (mouse + touch) ---
  let offsetX, offsetY, isDragging = false;

  function startDrag(e) {
    isDragging = true;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    offsetX = clientX - stickyDiv.offsetLeft;
    offsetY = clientY - stickyDiv.offsetTop;
    stickyDiv.style.zIndex = Date.now(); 
  }

  function drag(e) {
    if (!isDragging) return;
    e.preventDefault();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    let left = clientX - offsetX;
    let top = clientY - offsetY;

    stickyDiv.style.left = left + "px";
    stickyDiv.style.top = top + "px";

    // Realtime emit
    socket.emit("sticky:move", { id: stickyDiv.id, left, top });
  }

  function stopDrag() {
    isDragging = false;
  }

  // Mouse
  navDiv.addEventListener("mousedown", startDrag);
  document.addEventListener("mousemove", drag);
  document.addEventListener("mouseup", stopDrag);

  // Touch
  navDiv.addEventListener("touchstart", startDrag, { passive: false });
  document.addEventListener("touchmove", drag, { passive: false });
  document.addEventListener("touchend", stopDrag);
  document.addEventListener("touchcancel", stopDrag);

  return stickyDiv;
}

function createStickyNote() {
  let stickyDiv = createOuterShell();
  stickyDiv.id = "sticky-" + Date.now();

  let textArea = document.createElement("textarea");
  textArea.setAttribute("class", "textarea");
  stickyDiv.appendChild(textArea);

  textArea.addEventListener("input", () => {
    socket.emit("sticky:update", { id: stickyDiv.id, text: textArea.value });
  });

  // Broadcast new sticky creation
  socket.emit("sticky:create", { id: stickyDiv.id, left: 100, top: 100, text: "" , creator: socket.id });
}
