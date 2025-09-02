//select the element
let toolArr=document.querySelectorAll(".tool");
let toolBar=document.querySelector(".toolbar");
let pencilElement=document.querySelector("#pencil");
let eraserElement=document.querySelector("#eraser");
let stickyElement=document.querySelector("#sticky");
let uploadElement=document.querySelector("#upload");
let downloadElement=document.querySelector("#download");
let undoElement=document.querySelector("#undo");
let redoElement=document.querySelector("#redo");
//add the event listeners
// *****toolsSelector************
let currentTool = null;
for(let i=0;i<toolArr.length;i++){
    toolArr[i].addEventListener("click",function(){
        const toolname=toolArr[i].id;

        if(toolname=="pencil"){
            console.log("pencil");
            currentTool = "pencil";
            tool.strokeStyle="black";
            tool.lineWidth = 1;
        }
        else if(toolname=="eraser"){
            console.log("eraser");
            currentTool = "eraser";
            tool.strokeStyle="white";
            tool.lineWidth=10;
        }
        else if(toolname=="sticky"){
            console.log("sticky");
            currentTool = "sticky";
            createStickyNote();
        }
        else if(toolname=="upload"){
            console.log("upload");
            currentTool = "upload";
            uploadFile();
        }
        else if(toolname=="download"){
            console.log("download");
            currentTool = "download";
            downloadFile();
        }
        else if(toolname=="undo"){
            console.log("undo");
            currentTool = "undo";
            undo();

        }
        else if(toolname=="redo"){
            console.log("redo");
            currentTool = "redo";
            redo();
        }
    });
};

//canvas setup
let canvasElement = document.querySelector("#board");
canvasElement.width = window.innerWidth;
canvasElement.height = window.innerHeight;
//draw on the canvas
let tool=canvasElement.getContext("2d");
let undoStack = [];
let redoStack = [];
let isDrawing = false;
canvasElement.addEventListener("mousedown",function(e){
    let eidx=e.clientX;
    let eidy=e.clientY;
    let toolBarHeight=getYdelta();
    tool.beginPath();
    tool.moveTo(eidx,eidy-toolBarHeight);
    let pointdesc={
        x: eidx,
        y: eidy-toolBarHeight,
        desc:"md"
    }
    undoStack.push(pointdesc);
    isDrawing = true;
})
canvasElement.addEventListener("mousemove",function(e){
    if(isDrawing){
        let eidx=e.clientX;
        let eidy=e.clientY;
        let toolBarHeight=getYdelta();
        tool.lineTo(eidx,eidy-toolBarHeight);
        let pointdesc={
            x: eidx,
            y: eidy-toolBarHeight,
            desc:"mm"
        }
        undoStack.push(pointdesc);
        tool.stroke();
    }
});

canvasElement.addEventListener("mouseup",function(e){
    isDrawing = false;
});
function getYdelta(){
    return toolBar.getBoundingClientRect().height;
}


// ************creating Outershell*******
function createOuterShell(){
    let stickyDiv=document.createElement("div");
let navDiv=document.createElement("div");
let closeDiv=document.createElement("button");
let minimizeDiv=document.createElement("button");

//class styling
stickyDiv.setAttribute("class","sticky");
navDiv.setAttribute("class","nav");
closeDiv.setAttribute("class","close");
minimizeDiv.setAttribute("class","minimize");

//text content
closeDiv.textContent="X";
minimizeDiv.textContent="-";
//html structure
stickyDiv.appendChild(navDiv);

navDiv.appendChild(minimizeDiv);
navDiv.appendChild(closeDiv);
document.body.appendChild(stickyDiv);
//event listeners
let isMinimized = false;
closeDiv.addEventListener("click",function(){
    document.body.removeChild(stickyDiv);
});
minimizeDiv.addEventListener("click",function(){
     let content = stickyDiv.lastChild;  // the textarea or img
    if (!content || content === navDiv) return; // safety check

    if(isMinimized){
        content.style.display = "block";
        minimizeDiv.textContent = "-";
    } else {
        content.style.display = "none";
        minimizeDiv.textContent = "+";
    }
    isMinimized = !isMinimized;
});
//drag and drop
let isStickydown = false;
let initialX, initialY;

navDiv.addEventListener("mousedown",function(e){
    isStickydown = true;
    initialX = e.clientX;
    initialY = e.clientY;

});
navDiv.addEventListener("mousemove",function(e){
    if(isStickydown){
        let finalX = e.clientX;
        let finalY = e.clientY;
        //distance
        let dx = finalX - initialX;
        let dy=finalY - initialY;
        //move sticky
        let {top,left} = stickyDiv.getBoundingClientRect();
        stickyDiv.style.left = left + dx + "px";
        stickyDiv.style.top = top + dy + "px";
        initialX = finalX;
        initialY = finalY;

    }
});

navDiv.addEventListener("mouseup",function(){
    isStickydown = false;
});
return stickyDiv;


}
function createStickyNote(){
    //  <div class="sticky">
    //     <div class="nav">
    //         <button class="close">X</button>
    //         <div class="minimize">min</div>
    //     </div>
    //     <textarea class="textarea" id=""></textarea>
    // </div>
    let stickyDiv=createOuterShell();
    let textArea=document.createElement("textarea");
    textArea.setAttribute("class","textarea");
    stickyDiv.appendChild(textArea);

}
//*************upload*******************/
let INPUTButton=document.querySelector(".input-tag");
function uploadFile(){
    //1.input tag->
    // 2.click image icon
    INPUTButton.click();
    //3.browse and select file
    INPUTButton.addEventListener("change",function(e){
        let data=INPUTButton.files[0];
        //add ui
        let img=document.createElement("img");
        //img->url
        img.src=URL.createObjectURL(data);
        //append
        img.setAttribute("class","uploaded-img");
        let stickyDiv=createOuterShell();
        stickyDiv.appendChild(img);


    });

}
//*****downloader****************** */
function downloadFile() {
    let link = document.createElement("a");
    link.download = "canvas.png";
    link.href = canvasElement.toDataURL();
    link.click();
    // Clean up
    link.remove();
}

// *******redo******

function redo() {
    // Implement redo functionality
    if(redoStack.length>0){
        let pointdesc = redoStack.pop();
        undoStack.push(pointdesc);
        let {x,y,desc} = pointdesc;
        if(desc==="md"){
            tool.beginPath();
            tool.moveTo(x, y);
        }
        else if(desc==="mm"){
            tool.lineTo(x, y);
            tool.stroke();
        }
    }

}
//****undo */
function undo() {
    // Implement undo functionality
    tool.clearRect(0, 0, canvasElement.width, canvasElement.height);
    if(undoStack.length>0){
        redoStack.push(undoStack.pop());
        for(let i=0;i<undoStack.length;i++){
            let {x,y,desc} = undoStack[i];
           if(desc==="md"){
               tool.beginPath();
               tool.moveTo(x, y);
           }
           else if(desc==="mm"){
           tool.lineTo(x, y);
           tool.stroke();
        }
    }
}
}
