var my_canvas = document.getElementById("canvas");
var context = my_canvas.getContext("2d");
var points = [];

var figures = [];

function drawPoint(x, y)
{
	context.moveTo(x-5, y);
	context.lineTo(x+5, y);
	context.moveTo(x, y-5);
	context.lineTo(x, y+5);
}


function drawCurrentPoints()
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

function printMousePos(event)
{
	var newPoint = {x:event.clientX, y:event.clientY};
	points.push(newPoint);
	draw();
}

function validateBtn()
{
	figures.push(points);
	points = [];	
	draw();
}

function returnBtn()
{
	points = [];	
	draw();
}

function deleteBtn()
{
	figures = [];
	draw();
}

document.addEventListener("click", printMousePos);
document.getElementById('validatebtn').addEventListener('click', validateBtn);
document.getElementById('returnbtn').addEventListener('click', returnBtn);
document.getElementById('deletebtn').addEventListener('click', deleteBtn);