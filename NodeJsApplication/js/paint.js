var my_canvas = document.getElementById("mycanvas");
var context = my_canvas.getContext("2d");
var points = [];
var figures = [];
var isHandDrawing = true;
var mouseClicked = false;

window.onload = window.onresize = function() {
    my_canvas = document.getElementById("mycanvas");
    my_canvas.width = window.innerWidth;
    my_canvas.height = window.innerHeight;
}

//dessine un point
function drawPoint(x, y)
{
    context.moveTo(x-5, y);
    context.lineTo(x+5, y);
    context.moveTo(x, y-5);
    context.lineTo(x, y+5);
}

//dessine les tracé a main levée
function handDrawing()
{
    if(points.length > 0)
    {
        context.beginPath();
        context.setLineDash([1,1]);
        context.moveTo(points[0].x, points[0].y);
        for(i=1; i < points.length; i++)
                context.lineTo(points[i].x, points[i].y);
        context.stroke();
    }
}

//dessine les tracé droit
function straightsDrawing()
{
    if(points.length > 0)
    {
        context.beginPath();
        drawPoint(points[0].x, points[0].y);
        for(i=1; i < points.length; i++)
                drawPoint(points[i].x, points[i].y);
        context.stroke();

        context.beginPath();		
        context.setLineDash([1,4]);
        context.moveTo(points[0].x, points[0].y);
        for(i=1; i < points.length; i++)
                context.lineTo(points[i].x, points[i].y);
        context.stroke();
    }
}

//dessine le tracé en cours
function drawCurrentPoints()
{
    if(isHandDrawing)
		handDrawing();
	else
		straightsDrawing();
}

//dessine la scene
function draw()
{
    context.clearRect(0, 0, my_canvas.width, my_canvas.height);
    context.setLineDash([]);
    context.beginPath();
    for(i=0; i < figures.length; i++)
    {
        context.moveTo(figures[i][0].x, figures[i][0].y);
        for(j=1; j < figures[i].length; j++)
        {
            context.lineTo(figures[i][j].x, figures[i][j].y);
        }
    }
    context.stroke();
    drawCurrentPoints();
}


//magnétisme sur les points
function magnetism(pt)
{
	var distMagn = 25;
    for(i=0; i < points.length; i++)
	{
			var dist = Math.sqrt(Math.pow(points[i].x - pt.x, 2) + Math.pow(points[i].y - pt.y, 2));
			if(dist < distMagn)
				return points[i];
	}
    for(i=0; i < figures.length; i++)
    {
        for(j=0; j < figures[i].length; j++)
        {
			var dist = Math.sqrt(Math.pow(figures[i][j].x - pt.x, 2) + Math.pow(figures[i][j].y - pt.y, 2));
			if(dist < distMagn)
				return figures[i][j];
        }
    }
	return pt;
}


//ajoute un point au click
function moveMouse(event)
{
	if(isHandDrawing)
	{
		if(mouseClicked)
		{
			var newPoint = {x:event.clientX, y:event.clientY};
			points.push(newPoint);
			draw();
		}
	}
}

//ajoute un point au click
function clickMouse(event)
{
	var newPoint = {x:event.clientX, y:event.clientY};
	if(isHandDrawing)
	{
		if(!mouseClicked)
		{
			mouseClicked = true;
			newPoint = magnetism(newPoint);
			draw();
		}
		else
		{
			mouseClicked = false;
		points.push(newPoint);
			validateBtn();
		}
	}
	else
	{
		newPoint = magnetism(newPoint);
		points.push(newPoint);
		draw();
	}
}

//sauvegarde le tracé en cours
function validateBtn()
{
    if(points.length>0) {
       figures.push(points);
        points = []; 
    }
    draw();
}

//détruit le tracé en cours
function returnBtn()
{
    points = [];	
    draw();
}

// Ferme un polygone et valide
//innutile si magnétisme
/*function closeBtn()
{
    // au moins un triangle
    if(points.length > 2) {
        points.push(points[0]);
        draw();
    }
}*/

function deleteFigureBtn()
{
    if(figures.length > 0) {
        figures.pop();
    }
    else {
        figures = [];
    }
    draw();
}

function deleteBtn()
{
    figures = [];
    draw();
}

function toggleHandDrawing()
{
	isHandDrawing = $("#handcb").prop( "checked" );
	mouseClicked = false;
}

// Ajout des évenements
$("#mycanvas").on("mousemove", moveMouse);
$("#mycanvas").on("click", clickMouse);
$("#validatebtn").on('click', validateBtn);
$("#returnbtn").on('click', returnBtn);
//$("#closebtn").on('click', closeBtn);
$("#deletefigurebtn").on('click', deleteFigureBtn);
$("#deletebtn").on('click', deleteBtn);
$("#handcb").change(toggleHandDrawing);