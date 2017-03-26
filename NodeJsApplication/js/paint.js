var my_canvas = document.getElementById("mycanvas");
var context = my_canvas.getContext("2d");
var points = [];
var figures = [];
var isHandDrawing = false;
// On check si on est sur mobile ou pas
var isMobile = false; //initiate as false
//
// device detection
if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) 
    || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) 
{
    isMobile = true;
}

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
function clickMouse(event)
{
	var newPoint = {x:event.clientX, y:event.clientY};
	if(isHandDrawing)
	{
		validateBtn();
		newPoint = magnetism(newPoint);
		points.push(newPoint);
		draw();
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
function cancelBtn()
{
    points = [];	
    draw();
}

function deleteLastPointBtn()
{
    if(points.length > 0) {
        points.pop();
    }
    else {
        points = [];
    }
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

function deleteLastFigureBtn()
{
    if(figures.length > 0) {
        figures.pop();
    }
    else {
        figures = [];
    }
    draw();
}

function clearBtn()
{
    figures = [];
    points = [];
    draw();
}

function toggleHandDrawing()
{
	isHandDrawing = $("#handcb").prop( "checked" );
	mouseClicked = false;
}

function moveTouch(event)
{
	if(isHandDrawing)
	{
            var newPoint = {x:event.pageX, y:event.pageY};
            points.push(newPoint);
            draw();
	}
}

// Ajout des évenements
if (isMobile) {
    console.log("sur portable !");
    $("#mycanvas").bind('touchmove', moveTouch);
    $("#mycanvas").on("mousemove", moveTouch);
}
$("#mycanvas").on("click", clickMouse);
$("#validatebtn").on('click', validateBtn);
$("#returnbtn").on('click', cancelBtn);
$("#deletelastpointbtn").on('click', deleteLastPointBtn);
//$("#closebtn").on('click', closeBtn);
$("#deletefigurebtn").on('click', deleteLastFigureBtn);
$("#deletebtn").on('click', clearBtn);
$("#handcb").change(toggleHandDrawing);