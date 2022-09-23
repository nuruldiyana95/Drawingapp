const canvas = document.querySelector("canvas"),
// guna query selector sebb nak match dengan css selector 
// ctx adalah context 
toolBtns = document.querySelectorAll(".tool"),
fillColor = document.querySelector("#fill-color"),
sizeSlider = document.querySelector("#size-slider"),
colorBtns = document.querySelectorAll(".colors .option"),
colorPicker = document.querySelector("#color-picker"),
clearCanvas = document.querySelector(".clear-canvas"),
saveImg = document.querySelector(".save-image"),
ctx = canvas.getContext("2d");

// bila tekan baru draw 
//yg ni global variabble
//prevmouse ni coordinate untuk mouse punya coordinate
let prevMouseX, prevMouseY, snapshot,
isDrawing = false,
selectedTool = "brush",
brushWidth = 5;
selectedColor = "#000";

// set background canvas color untuk download 
const setCanvasBackground = () => {
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = selectedColor;// set color to selected color
}

// setup size draw board dan ikut drawboard yg boleh nampk
window.addEventListener("load", () => 
{
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    setCanvasBackground();
});
// untuk draw rectangle as image shape
const drawRect = (e) => {
    // kalau fill color tak checked box dia takkan fill color
    if(!fillColor.checked){
    return ctx.strokeRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY); //lukis rect tanpa fill
    }
    ctx.fillRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY);
}

const drawCircle = (e) => {
    ctx.beginPath(); // new path for circle
// arc method for circle 
// radius tu untuk dapatkan radius circle mengikut mouse pointer
    let radius = Math.sqrt(Math.pow((prevMouseX - e.offsetX), 2) + Math.pow((prevMouseY - e.offsetY), 2));
    ctx.arc(prevMouseX, prevMouseY, radius, 0, 2 * Math.PI); // sebab formula circle dia 2PIr
    fillColor.checked ? ctx.fill() : ctx.stroke();//render outline , shortcut if else 
}

const drawTriangle = (e) => {
    ctx.beginPath();
    ctx.moveTo(prevMouseX, prevMouseY);
    ctx.lineTo(e.offsetX, e.offsetY);// first line ikut pointer
    ctx.lineTo(prevMouseX * 2 - e.offsetX, e.offsetY);//bottom line triangle
    ctx.closePath();// close path kalau tak separuh je triangle
    fillColor.checked ? ctx.fill() : ctx.stroke();// kalau tak checked kita stroke biasa 

}


const startDraw = (e) => {
    isDrawing = true;
    prevMouseX = e.offsetX;//pass yang mouse asal ke value baru
    prevMouseY = e.offsetY;
    ctx.beginPath();//untuk setup checkpoint draw
    ctx.lineWidth = brushWidth;//brush size 
    ctx.strokeStyle = selectedColor;//color untuk stroke 
    ctx.fillStyle = selectedColor;// bila choose color untuk fill

    snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);//snapshot image dan tak drag image 
}

// create new line kalaua line to function
// offset x dgn y akan ikut mouse pointer ita
const drawing = (e) => {
if(!isDrawing) return;
ctx.putImageData(snapshot, 0, 0); // letak copied data dekat canvas 
if(selectedTool === "brush" || selectedTool === "eraser"){

    // kalau eraser dia akan change color to white else set kepada stroke
    ctx.strokeStyle = selectedTool === "eraser" ? "#fff" : selectedColor;
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke(); //lukis atau fill line dengan color
} else if(selectedTool === "rectangle"){
    drawRect(e);
}
else if(selectedTool === "circle"){
    drawCircle(e);
}else {
    drawTriangle(e);
}
}
// nak add function click untuk tool button 
toolBtns.forEach(btn => {
    btn.addEventListener("click", () => {
// buang active class dari option sebelum ni dan gantikan 
//dengan clicked option yang baru maksudnya boleh click satu satu
        document.querySelector(".active").classList.remove("active");
        btn.classList.add("active");
        selectedTool = btn.id;
        console.log(selectedTool);
    });
});

// untuk change brush size
sizeSlider.addEventListener("change", () => brushWidth = sizeSlider.value);

colorBtns.forEach(btn => {
    btn.addEventListener("click", () => { // tambah semua color kat button
        //sama macam sebelum ni tapi yg ni untuk selected 
        document.querySelector(".options .selected").classList.remove("selected");
        btn.classList.add("selected");
        // selected kepada selected color value 
        selectedColor = window.getComputedStyle(btn).getPropertyValue("background-color");
    });
});

colorPicker.addEventListener("change", () => {

// untuk pass color pick ke last color btn : slider color rgb tu akan boleh dipick
    colorPicker.parentElement.style.background = colorPicker.value;
    colorPicker.parentElement.click();
});

clearCanvas.addEventListener("click", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);//clear semua canvas
    setCanvasBackground();
});
// save image event
saveImg.addEventListener("click", () => {
    const link = document.createElement("a"); // element 
    link.download = `${Date.now()}.jpg`;//
    link.href = canvas.toDataURL();// canvas ke link href
    link.click();//click untuk download image
});
// mouse down ni signal start lukis, mouse move akan ikut pointer 
// dan mouse up ni signal stop lukis, semua tiga ni kna ada kalau nak buat event lukis 
canvas.addEventListener("mousedown", startDraw);

canvas.addEventListener("mousemove", drawing);

// bila tekan baru draw 
canvas.addEventListener("mouseup", () => isDrawing = false);