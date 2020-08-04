canvasElements = {
    paint: false,
    drawColors: [],
    currentColor: "black",
    clickX: [],
    clickY: [],
    clickDrag: []
}

function init() {
    let canvas = document.querySelector("canvas");
    canvas.addEventListener('mousedown', startDrawing)
    canvas.addEventListener('mousemove', checkIfDrawing)
    canvas.addEventListener('mouseup', endDrawing)
    canvas.addEventListener('mouseleave', endDrawing)
    let colorBoxes = document.querySelectorAll(".color-box")
    for (let colorBox of colorBoxes){
        colorBox.addEventListener('click', changeDrawingColor)
    }
}

function changeDrawingColor(event) {
    let colour = event.target.dataset.colour;
    canvasElements.currentColor = colour;
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
}

function draw() {
    let context = document.querySelector("canvas").getContext("2d");
    context.clearRect(0, 0, context.canvas.width, context.canvas.height); // Clears the canvas

    context.strokeStyle = "#df4b26";
    context.lineJoin = "round";
    context.lineWidth = 5;

    for (let i = 0; i < canvasElements.clickX.length; i++) {
        context.beginPath();
        if (canvasElements.clickDrag[i] && i) {
            context.moveTo(canvasElements.clickX[i - 1], canvasElements.clickY[i - 1]);
        } else {
            context.moveTo(canvasElements.clickX[i] - 1, canvasElements.clickY[i]);
        }
        context.lineTo(canvasElements.clickX[i], canvasElements.clickY[i]);
        context.closePath();
        context.stroke();
    }
}

init();