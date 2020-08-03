canvasElements = {
    paint: false,
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
}

function startDrawing(event) {
    let mouseX = event.pageX - this.offsetLeft;
    let mouseY = event.pageY - this.offsetTop;

    canvasElements.paint = true;
    addClick(mouseX, mouseY);
    draw();

}

function checkIfDrawing(event) {
    if (canvasElements.paint) {
        addClick(event.pageX - this.offsetLeft, event.pageY - this.offsetTop, true);
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