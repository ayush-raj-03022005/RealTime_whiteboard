let INPUTButton = document.querySelector(".input-tag");

function uploadFile() {
  INPUTButton.click();
  INPUTButton.addEventListener("change", function () {
    let data = INPUTButton.files[0];
    let img = document.createElement("img");
    img.src = URL.createObjectURL(data);
    img.setAttribute("class", "uploaded-img");
    let stickyDiv = createOuterShell();
    stickyDiv.id = "sticky-" + Date.now();
    stickyDiv.appendChild(img);
    socket.emit("sticky:create", { id: stickyDiv.id, type: "image" });
  });
}
