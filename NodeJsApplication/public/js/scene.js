var scene = new THREE.Scene(); // c'est créer le repère du monde
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );  // capteur de cette scène (caméra perspective ou orthographique)
var renderer = new THREE.WebGLRenderer();  // on créé l'objet renderer qui créé l'objet canvas qui donne la taille qu'on lui a donné, puis on récupère le dom et on le met dans le document
// y'a d'autres renderer où on a pas accès à un truc openGL.
renderer.setSize( window.innerWidth, window.innerHeight ); 
document.body.appendChild( renderer.domElement );

// now : scène vide, on veut remplir notre scène, plusieurs manières pour représenter des formes, ce qu'on veut c'est représenter des surfaces.

var allDrawingsRendered = [];
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
    }
};
var reset = gui.add(parameters, 'reset');

function drawDrawing(data) { 
    var material = new THREE.LineBasicMaterial( { color: 0xffffff, linewidth: 4 } );
    for(var i=0; i<data.length; i++) {
        var geometry = new THREE.Geometry();
        var figureActu = data[i];
        for(var j=0; j<figureActu.length; j++) {
            var pointActu = figureActu[j];
	    
	    //Création des points, et création de la 3D (pour l'instant jusqu'à 30 points en plus dans z)
	    for(int i = 0; i < 30; i++){
		geometry.vertices.push(new THREE.Vector3(pointActu.x, (pointActu.y)*-1, i));
	    }
        }
        var line = new THREE.Line(geometry, material);
        scene.add(line);
        allDrawingsRendered.push(line);
    }
}

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