var canvas = document.getElementById("paint");
var ctx = canvas.getContext("2d");
var painting = document.getElementById("content");
var stylepaint = getComputedStyle(painting);
var mouse = {x: 0, y: 0};
var dragging = false;
var dragStartLocation;
var fill = document.getElementById("fill");

canvas.width = parseInt(stylepaint.getPropertyValue("width"));
canvas.height = parseInt(stylepaint.getPropertyValue("height"));

var onPaint = function() {
    ctx.lineTo(mouse.x, mouse.y);
    ctx.stroke();
};

var onEraser = function() {
    ctx.lineTo(mouse.x, mouse.y);
    ctx.stroke();
};

var getCoordinateMouse = function(event){
    var x = event.clientX - canvas.getBoundingClientRect().left;
    var y = event.clientY - canvas.getBoundingClientRect().top;
    
    return {x: x, y: y};
};

var takeSnap = function() {
    snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
}

var restoreTakeSnap = function() {
    ctx.putImageData(snapshot, 0, 0);
}

var drawLine = function(position){
    ctx.beginPath();
    ctx.moveTo(dragStartLocation.x, dragStartLocation.y);
    ctx.lineTo(position.x, position.y);
    ctx.stroke();
}

$("#pen").click(function movePen(){
    
    var Circlecolor = document.getElementById("selectColor").value;
    ctx.lineWidth = 4;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.strokeStyle = Circlecolor, 16;
    
    canvas.onmousedown = function downPen(e){
        ctx.beginPath();
        ctx.moveTo(e.pageX - this.offsetLeft, e.pageY - this.offsetTop);
        dragging = true
    }
    
    canvas.onmousemove = function MovePen(e){
        if(dragging === true)
        {
            mouse.x = e.pageX - this.offsetLeft;
            mouse.y = e.pageY - this.offsetTop;   
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
        }
    }
    
    canvas.onmouseup = function upPen(){
        dragging = false;
        ctx.closePath();
    }
});

$("#eraser").click(function(){
    
    var newBackground = document.getElementById("background").value;
    ctx.lineWidth = 4;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.strokeStyle = newBackground, 1;
    
    canvas.onmousedown = function downPen(e){
        ctx.beginPath();
        ctx.moveTo(e.pageX - this.offsetLeft, e.pageY - this.offsetTop);
        dragging = true
    }
    
    canvas.onmousemove = function MovePen(e){
        if(dragging === true)
        {
            mouse.x = e.pageX - this.offsetLeft;
            mouse.y = e.pageY - this.offsetTop;   
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
        }
    }
    
    canvas.onmouseup = function upPen(){
        dragging = false;
        ctx.closePath();
    }
});

$("#line").click(function(){
    ctx.lineWidth = 4;
    
    canvas.onmousedown = function dragStart(event){
        dragging = true;
        dragStartLocation = getCoordinateMouse(event);
        takeSnap();
    }
    
    canvas.onmousemove = function drag(event){
        var position;
        if(dragging === true){
            restoreTakeSnap();
            position = getCoordinateMouse(event);
            drawLine(position);
        }
    }
    canvas.onmouseup = function dragStop(event){
        dragging = false;
        restoreTakeSnap();
        var position = getCoordinateMouse(event);
        drawLine(position);
    }
})

var drawCircle = function(position){
    //Distance between two point
    var radius = Math.sqrt(Math.pow((dragStartLocation.x - position.x), 2) + Math.pow((dragStartLocation.y - position.y), 2));
    ctx.beginPath();
    ctx.arc(position.x, position.y, radius, 0, 2*Math.PI, false);
}

$("#circle").click(function(){
    
    ctx.lineWidth = 4;
    
    var Circlecolor = document.getElementById("selectColor").value;
    ctx.fillStyle = Circlecolor;
    
    canvas.onmousedown = function dragStart(event){
        dragging = true;
        dragStartLocation = getCoordinateMouse(event);
        takeSnap();
    }
    
    canvas.onmousemove = function drag(event){
        var position;
        if(dragging === true){
            restoreTakeSnap();
            position = getCoordinateMouse(event);
            drawCircle(position);
            if(fill.checked){
                ctx.fill();
            }
            else{
                ctx.stroke();
            }
        }
    }
    canvas.onmouseup = function dragStop(event){
        dragging = false;
        restoreTakeSnap();
        var position = getCoordinateMouse(event);
        drawCircle(position);
        if(fill.checked){
            ctx.fill();
        }
        else{
            ctx.stroke();
        }
    }
});

$("#rectangle").click(function(){
    
    ctx.lineWidth = 4;
    var rect = {};
    var Rectanglecolor = document.getElementById("selectColor").value;
    ctx.fillStyle = Rectanglecolor;
    
    canvas.onmousedown = function dragStart(event){
        rect.startX = event.pageX - this.offsetLeft;
        rect.startY = event.pageY - this.offsetTop;
        dragging= true;
        dragStartLocation = getCoordinateMouse(event);
    }
    
    canvas.onmousemove = function drag(event){
        if(dragging === true){
            rect.w = (event.pageX - this.offsetLeft) - rect.startX;
            rect.h = (event.pageY - this.offsetTop) - rect.startY;
        }
    }
    canvas.onmouseup = function dragStop(){
        dragging= false;
        if(fill.checked){
            ctx.fillRect(rect.startX, rect.startY, rect.w, rect.h);
        }
        else{
            ctx.strokeRect(rect.startX, rect.startY, rect.w, rect.h);
        }
    }
}); 

$("#forward").click(function(){
    alert('forward');
})

$("#selectColor").change(function(){
    var newColor = document.getElementById("selectColor").value;
    ctx.strokeStyle = newColor;
});

$("#background").change(function(){
    var newBackground = document.getElementById("background").value;
    document.getElementById("paint").style.backgroundColor = newBackground;
});

$("#clear").click(function() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);   
});

$("#size-select").change(function() {
    var newSize = document.getElementById("size-select").value;
    ctx.lineWidth = newSize;
});