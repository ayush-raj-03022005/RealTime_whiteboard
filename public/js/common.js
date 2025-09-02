let canvasElement = document.querySelector("#board");
canvasElement.width = window.innerWidth;
canvasElement.height = window.innerHeight;

let tool = canvasElement.getContext("2d");

let undoStack = [];
let redoStack = [];
let isDrawing = false;
let currentTool = null;

let toolBar = document.querySelector(".toolbar");

// Socket.io
const socket = io();

// Utility
function getYdelta() {
  return toolBar.getBoundingClientRect();
}
