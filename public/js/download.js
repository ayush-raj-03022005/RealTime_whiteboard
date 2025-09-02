function downloadFile() {
  let link = document.createElement("a");
  link.download = "canvas.png";
  link.href = canvasElement.toDataURL();
  link.click();
  link.remove();
}
