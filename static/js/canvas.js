canvasElements = {
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

function init() {
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
        changeMarkerBtn.addEventListener('click', changeDrawingColor)
    }

    document.querySelector(".clear").addEventListener('click', clearCanvas)

}

function changeDrawingColor(event) {
    if (event.target.classList.contains("pen")) {
       beforeRubber = canvasElements.currentColor
        canvasElements.currentColor = beforeRubber;
    }else {
    canvasElements.currentColor = event.target.dataset.colour;
    }
}

function changeDrawingSize(event) {
    canvasElements.currentSize = event.target.dataset.size;
}

function clearCanvas(event) {
    let context = document.querySelector("canvas").getContext("2d");
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    canvasElements.clickDrag = []
    canvasElements.clickX = []
    canvasElements.clickY = []
    canvasElements.drawColors = []
    canvasElements.drawSizes = []
}

function startDrawing(event) {
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

function endDrawing() {
    canvasElements.paint = false;
}

function addClick(x, y, dragging) {
    canvasElements.clickX.push(x);
    canvasElements.clickY.push(y);
    canvasElements.clickDrag.push(dragging);
    canvasElements.drawColors.push(canvasElements.currentColor)
    canvasElements.drawSizes.push(canvasElements.currentSize);
}

function draw() {
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

init();