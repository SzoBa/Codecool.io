import {socket} from './socket.js'

let canvasElements = {
    paint: false,
    drawColors: [],
    currentColor: "black",
    currentSize: "small",
    drawSizes: [],
    clickX: [],
    clickY: [],
    clickDrag: [],
    beforeRubber: "black"
}

export function init(ownerId, userId) {
    addSocketFunctionality();
    if (ownerId === userId) {
        addAllEventListeners()
    }
}

export function addAllEventListeners() {
    let canvas = document.querySelector("canvas");
    canvas.addEventListener('mousedown', startDrawing)
    canvas.addEventListener('mousemove', checkIfDrawing)
    canvas.addEventListener('mouseup', endDrawing)
    canvas.addEventListener('mouseleave', endDrawing)
    let colorBoxes = document.querySelectorAll(".color-box")
    for (let colorBox of colorBoxes) {
        colorBox.addEventListener('click', changeDrawingColor)
    }
    let sizeBoxes = document.querySelectorAll('.size-box')
    for (let sizeBox of sizeBoxes) {
        sizeBox.addEventListener('click', changeDrawingSize)
    }
    let changeMarkerBtns = document.querySelectorAll(".change-marker")
    for (let changeMarkerBtn of changeMarkerBtns) {
        changeMarkerBtn.addEventListener('click', changeDrawingColor);
    }
    document.querySelector(".clear").addEventListener('click', clearCanvas);
}

export function removeAllEventListeners() {
    let canvas = document.querySelector("canvas");
    canvas.removeEventListener('mousedown', startDrawing)
    canvas.removeEventListener('mousemove', checkIfDrawing)
    canvas.removeEventListener('mouseup', endDrawing)
    canvas.removeEventListener('mouseleave', endDrawing)
    let colorBoxes = document.querySelectorAll(".color-box")
    for (let colorBox of colorBoxes) {
        colorBox.removeEventListener('click', changeDrawingColor)
    }
    let sizeBoxes = document.querySelectorAll('.size-box')
    for (let sizeBox of sizeBoxes) {
        sizeBox.removeEventListener('click', changeDrawingSize)
    }
    let changeMarkerBtns = document.querySelectorAll(".change-marker")
    for (let changeMarkerBtn of changeMarkerBtns) {
        changeMarkerBtn.removeEventListener('click', changeDrawingColor);
    }
    document.querySelector(".clear").removeEventListener('click', clearCanvas);
}

function addSocketFunctionality() {
    socket.addEventListener('user-draw', function (data) {
        canvasElements = JSON.parse(data)
        draw()
    })
}

function displayCurrentColour() {
    let currentColourBox = document.querySelector('.current-color')
    currentColourBox.style.background = canvasElements.currentColor
}

function changeDrawingColor(event) {
    if (event.target.classList.contains("rubber")) {
        canvasElements.beforeRubber = canvasElements.currentColor
        canvasElements.currentColor = event.target.dataset.colour;
    } else if (event.target.classList.contains("pen")) {
        canvasElements.currentColor = canvasElements.beforeRubber;
    } else {
        canvasElements.currentColor = event.target.dataset.colour;
    }
    displayCurrentColour()
}

export function changeDrawingSize(event) {
    canvasElements.currentSize = event.target.dataset.size;
}

export function clearCanvas() {
    let context = document.querySelector("canvas").getContext("2d");
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    canvasElements.clickDrag = []
    canvasElements.clickX = []
    canvasElements.clickY = []
    canvasElements.drawColors = []
    canvasElements.drawSizes = []
    socket.emit('drawing', JSON.stringify({data: canvasElements, roomId: localStorage.getItem('room_id')}))
}

export function startDrawing(event) {
    // let mouseX = event.pageX - document.querySelector('.card').offsetLeft;
    // let mouseY = event.pageY - document.querySelector('.card').offsetTop;
    let cRect = document.querySelector("canvas").getBoundingClientRect();
    let canvasX = Math.round(event.clientX - cRect.left);
    let canvasY = Math.round(event.clientY - cRect.top);
    canvasElements.paint = true;
    addClick(canvasX, canvasY);
    draw();

}

function checkIfDrawing(event) {
    let cRect = document.querySelector("canvas").getBoundingClientRect();
    let canvasX = Math.round(event.clientX - cRect.left);
    let canvasY = Math.round(event.clientY - cRect.top);
    if (canvasElements.paint) {
        addClick(canvasX, canvasY, true);
        draw();
    }
}

export function endDrawing() {
    canvasElements.paint = false;
}

export function addClick(x, y, dragging) {
    canvasElements.clickX.push(x);
    canvasElements.clickY.push(y);
    canvasElements.clickDrag.push(dragging);
    canvasElements.drawColors.push(canvasElements.currentColor);
    canvasElements.drawSizes.push(canvasElements.currentSize);
    socket.emit('drawing', JSON.stringify({data: canvasElements, roomId: localStorage.getItem('room_id')}))
}

export function draw() {
    let context = document.querySelector("canvas").getContext("2d");
    context.clearRect(0, 0, context.canvas.width, context.canvas.height); // Clears the canvas

    context.lineJoin = "round";

    for (let i = 0; i < canvasElements.clickX.length; i++) {
        context.beginPath();
        if (canvasElements.clickDrag[i] && i) {
            context.moveTo(canvasElements.clickX[i - 1], canvasElements.clickY[i - 1]);
        } else {
            context.moveTo(canvasElements.clickX[i] - 1, canvasElements.clickY[i]);
        }
        let radius
        if (canvasElements.drawSizes[i] === "small") {
            radius = 2;
        } else if (canvasElements.drawSizes[i] === "normal") {
            radius = 5;
        } else if (canvasElements.drawSizes[i] === "large") {
            radius = 10;
        } else if (canvasElements.drawSizes[i] === "huge") {
            radius = 20;
        } else {
            radius = 0;
        }
        context.lineTo(canvasElements.clickX[i], canvasElements.clickY[i]);
        context.closePath();
        context.lineWidth = radius;
        context.strokeStyle = canvasElements.drawColors[i];
        context.stroke();
    }
}

// init(localStorage.getItem('owner_id'), localStorage.getItem('user_id'));