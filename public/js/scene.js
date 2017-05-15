var flexibiliteScore = 0.85 // flexibilité de reconnaissance des formes
var colors = ["aqua", "blue", "fuchsia", "lime", "red", "silver", "teal", "maroon", "olive", "purple", "yellow", "green"];
var scene = new THREE.Scene(); // c'est créer le repère du monde
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );  // capteur de cette scène (caméra perspective ou orthographique)
var renderer = new THREE.WebGLRenderer();  // on créé l'objet renderer qui créé l'objet canvas qui donne la taille qu'on lui a donné, puis on récupère le dom et on le met dans le document
// y'a d'autres renderer où on a pas accès à un truc openGL.
renderer.setSize( window.innerWidth, window.innerHeight ); 
document.body.appendChild( renderer.domElement );

// now : scène vide, on veut remplir notre scène, plusieurs manières pour représenter des formes, ce qu'on veut c'est représenter des surfaces.

var allDrawingsRendered = [];
var allFiguresSent = [];
var axisHelper = new THREE.AxisHelper( 1 ); // 1 = unité de distance
scene.add( axisHelper );

camera.position.x = 155;
camera.position.y = -215;
camera.position.z = 400; // = recule la caméra car elle est initialisée à (0,0,0)

// le truc suivant sert à voir le point source de lumière !
/*var geoampoule = new THREE.SphereGeometry( 0.5, 50, 50 );
var materialampoule = new THREE.MeshBasicMaterial( { color: 0xffffff , opacity : 0.5 , transparent : true} );
var ampoule = new THREE.Mesh( geoampoule, materialampoule );
scene.add( ampoule );*/

var gui = new dat.GUI();
var parameters = {
    reset : function() { 
        if (allDrawingsRendered.length > 0) {
            for(var i=0; i<allDrawingsRendered.length; i++) {
                scene.remove(allDrawingsRendered[i]);
            }
        }
        allDrawingsRendered = [];
        allFiguresSent = [];
    },
    // pour ajouter une forme au détecteur de figures
    ajoutForme : function() { 
        if (allDrawingsRendered.length > 0) {
            controls.enabled = false;
            $('#myModal').modal('show');
        }
    }
};
var reset = gui.add(parameters, 'reset');
var ajoutforme = gui.add(parameters, 'ajoutForme');

// Le détecteur de formes dessinées
var detector = new ShapeDetector(ShapeDetector.defaultShapes);

//Création du dessin en 3D
function drawDrawing(data, shape) {
	//Parcours de chaque figure
	for(var i=0; i<data.length; i++) {
		var figureActu = data[i].figure; //Figure courante
		var prof = data[i].depth; //Profondeur désirée
		
		allFiguresSent.push(figureActu);
		
		if(shape != null && shape[i].pattern=="circle" && shape[i].score > flexibiliteScore){ //Si la forme est reconnue en tant que cercle
			//Création d'une sphere selon la profondeur et de la couleur du dessin en 2D
			var geometry = new THREE.SphereGeometry(prof, 32, 32 );
			var material = new THREE.MeshBasicMaterial( {color: colors[(data[i].color)%colors.length]} );
			var sphere = new THREE.Mesh( geometry, material );
			
			sphere.position.set(pointInit.x, (pointInit.y)*-1, 0);
			scene.add( sphere );
			allDrawingsRendered.push(sphere);
		} else if (shape != null && shape[i].pattern=="square" && shape[i].score > flexibiliteScore){ //Si c'est un carré
			var g = createGeometry(figureActu, 4, prof); //Création de la forme 3D
			var m = new THREE.MeshBasicMaterial({ color: colors[(data[i].color)%colors.length], wireframe: false });
			m.side = THREE.DoubleSide; //Pour avoir la couleur des deux côtés des faces
			var square = new THREE.Mesh(g, m);
			scene.add(square);
			allDrawingsRendered.push(square);
		} else if (shape != null && shape[i].pattern=="triangle" && shape[i].score > flexibiliteScore){ //Si c'est un triangle 
			var g = createGeometry(figureActu, 3, prof);//Création de la forme 3D
			var m = new THREE.MeshBasicMaterial({ color: colors[(data[i].color)%colors.length], wireframe: false });
			m.side = THREE.DoubleSide;
			var triangle = new THREE.Mesh(g, m);
			scene.add(triangle);
			allDrawingsRendered.push(triangle);
		} else { //Si la figure n'est pas reconnue
			var material = new THREE.LineBasicMaterial( { color: colors[(data[i].color)%colors.length], linewidth: 4 } );
			var geometry = new THREE.Geometry();
			var geometry3D = new THREE.Geometry();
	
			//On créé une ligne entre chaque point de la face
			for(var j=0; j<figureActu.length; j++) {
				var pointActu = figureActu[j];
				geometry.vertices.push(new THREE.Vector3(pointActu.x, (pointActu.y)*-1, 0));
			}
			var line = new THREE.Line(geometry, material);
			scene.add(line);
			allDrawingsRendered.push(line);
	
			//Création des points de la face en profondeur
			for(var j=0; j<figureActu.length; j++) {
				var pointActu = figureActu[j];
				geometry3D.vertices.push(new THREE.Vector3(pointActu.x, (pointActu.y)*-1, prof));
			}
			var line = new THREE.Line(geometry3D, material);
			scene.add(line);
			allDrawingsRendered.push(line);
	
			//Création des lignes entre les deux faces
			for(var j=0; j<figureActu.length; j++) {
				var geometryFill = new THREE.Geometry();
				var pointActu = figureActu[j];
	    
				geometryFill.vertices.push(new THREE.Vector3(pointActu.x, (pointActu.y)*-1, 0));
				geometryFill.vertices.push(new THREE.Vector3(pointActu.x, (pointActu.y)*-1, prof));
				var line = new THREE.Line(geometryFill, material);
				scene.add(line);
				allDrawingsRendered.push(line);
			}
		}
	}
}

// Fonction qui va renvoyer la liste des points d'angle
function listerVertices(edges, listDelta) {
    var i = 0;
    var listVertices = [];

    //Il s'agit là de trouver tous les angles que nous allons utiliser
    //Il s'avère que certains angles sont les mêmes que d'autres à 1px près par exemple, nous les éliminons afin de n'en garder qu'un
    while (i < edges){
        var elem = listDelta[i];
        var ok = true;

        for(var j = 0; j < listVertices.length && ok == true; j++){
            var vertCourant = listVertices[j];
            //Test des angles deux à deux avec ceux que nous avons déjà gardé, afin de ne pas en avoir un en double
            if(Math.abs(vertCourant[0] - elem[0]) < 20 && Math.abs(vertCourant[1] - elem[1]) < 20){
                listDelta.splice(i, 1);
                ok = false;
            }
        }

        if(ok){
            listVertices.push(elem);
            i++;
        }
    }
    
    return listVertices;
}


//Fonction qui créé une forme en 3D selon la forme en 2D, le nombre d'angles de la forme, la profondeur voulue
function createGeometry(forme, edges, depth){
	var geometry = new THREE.Geometry()
			
	var erreur = 0.0001;
	var listDelta = [];
			
	//Boucle de reconnaissance des angles de la forme
	for(var i = 1; i < forme.length-1; i++){
		//Pour chaque point on prend celui d'avant et celui d'après
		var figuAvant = forme[i-1];
		var figuApres = forme[i+1];
		var figuCourante = forme[i];
		
		//Coordonnées calculées du point
		var deltaX = (figuApres.x + figuAvant.x)/2;
		var deltaY = (figuApres.y + figuAvant.y)/2;
		
		//Coordonnées réelles du point
		var reelX = figuCourante.x;
		var reelY = figuCourante.y;
			
		//Si la différence entre calculée et réelle est trop grande, il y a un angle, ce n'est pas une ligne
		if(Math.abs(reelX - deltaX) > erreur || Math.abs(reelY - deltaY) > erreur){
			//On ajoute les coordonnées de l'angle à la liste, ainsi qu'un indicateur de confiance pour la validité de l'angle, et le numéro de l'angle
			listDelta.push([reelX, reelY, Math.abs(reelX - deltaX)+Math.abs(reelY - deltaY), listDelta.length]);
		}
	};
		
	//De même que la boucle, sauf qu'on traite le dernier et le premier point du tableau
	var figuAvant = forme[forme.length-2];
	var figuApres = forme[0];
	var figuCourante = forme[forme.length-1];
		
	var deltaX = (figuApres.x + figuAvant.x)/2;
	var deltaY = (figuApres.y + figuAvant.y)/2;
				
	var reelX = figuCourante.x;
	var reelY = figuCourante.y;
				
	if(Math.abs(reelX - deltaX) > erreur || Math.abs(reelY - deltaY) > erreur){
		listDelta.push([reelX, reelY, Math.abs(reelX - deltaX)+Math.abs(reelY - deltaY), listDelta.length]);
	}
		
	var figuAvant = forme[forme.length-1];
	var figuApres = forme[1];
	var figuCourante = forme[0];
				
	var deltaX = (figuApres.x + figuAvant.x)/2;
	var deltaY = (figuApres.y + figuAvant.y)/2;
				
	var reelX = figuCourante.x;
	var reelY = figuCourante.y;
			
	if(Math.abs(reelX - deltaX) > erreur || Math.abs(reelY - deltaY) > erreur){
		listDelta.push([reelX, reelY, Math.abs(reelX - deltaX)+Math.abs(reelY - deltaY), listDelta.length]);
	}
	
	//Les angles sont triés par l'indicateur pour ne garder que les meilleurs angles, qui vont correspondre aux vrais angles
	listDelta.sort(
		function(x, y)
		{
			return x[2] < y[2];
		}
	);
	
	//console.log(listDelta);
        
	var listVertices = listerVertices(edges, listDelta);
	
	//Retriage des angles selon leur ordre afin de pouvoir créer les faces
	listVertices.sort(
		function(x, y)
		{
			return x[3] > y[3];
		}
	);
	
	//Création des vertices de la face avant
	for(var i = 0; i < listVertices.length; i++){
		var elem = listVertices[i];
		geometry.vertices.push(new THREE.Vector3(elem[0],elem[1]*(-1),0));
	}
	//Création des vertices de la face arrière
	for(var i = 0; i < listVertices.length; i++){
		var elem = listVertices[i];
		geometry.vertices.push(new THREE.Vector3(elem[0],elem[1]*(-1),depth));
	}
	//Création des faces selon les vertices créés
	for(var i = 0; i < edges-2; i++){
		geometry.faces.push(new THREE.Face3(0, i+1, i+2));
		geometry.faces.push(new THREE.Face3(edges, edges+i+1, edges+i+2));
	}
	
	//Calcul des triangles à créer pour compléter la figure 3D, en fonction du nombre d'angles
	geometry.faces.push(new THREE.Face3(0, 1, edges+1));
	geometry.faces.push(new THREE.Face3(0, edges-1, edges*2-1));
	geometry.faces.push(new THREE.Face3(0, edges, edges+1));
	geometry.faces.push(new THREE.Face3(0, edges, edges*2-1));
	
	for(var i = 1; i < edges-1; i++){
		geometry.faces.push(new THREE.Face3(i, 1+i, edges+1+i));
		geometry.faces.push(new THREE.Face3(i, edges+i, edges+1+i));
	}
	
	return geometry;
}

function detectDrawing(data) { 
    // On va détecter toutes les figures
    var allFiguresReconnues = [];
    for(var i=0; i<data.length; i++) {
        var figure = data[i].figure;
        var figureReconnue = detector.spot(figure);
        allFiguresReconnues.push(figureReconnue);
    }
    return allFiguresReconnues;
}

function ajoutFigure()
{
    var nomFigure = $("#nomfigure").val();
    if (nomFigure.length >0) {
        // On ajoute la figure créée au détecteur de formes
        console.log("ajout de la forme " + nomFigure + " à la détection");
        var figure = allFiguresSent[0];
        console.log(figure);
        
        detector.learn(nomFigure, figure);
    }
    $("#nomfigure").val("");
    $('#myModal').modal('hide');
}

// quand le modal est fermé, on reprend les contrôles
$("#myModal").on('hidden.bs.modal', function () {
    controls.enabled = true;
});
$("#confirmAjoutFigure").on('click', ajoutFigure);

function render() { // c'est le rendu, ce qui va se passer lorsque l'on lance le fichier, qui va s'exécuter en continu
    requestAnimationFrame( render );
    renderer.render( scene, camera ); // = fais moi le rendu de cette scène là avec le point de vue de cette caméra, projeter dans le plan image, remplir l'intérieur des pixels, etc..
}


render();

var toLook = {x:175, y:-250, z:0};
var controls = new THREE.OrbitControls(camera, toLook); // on peut se servir de la souris pour bouger la caméra grâce à la fonction en dessous

function animate() {
   requestAnimationFrame(animate);
   renderer.render(scene, camera);
   controls.update();
}
animate();