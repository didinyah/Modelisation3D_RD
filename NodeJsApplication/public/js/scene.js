var scene = new THREE.Scene(); // c'est créer le repère du monde
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );  // capteur de cette scène (caméra perspective ou orthographique)
var renderer = new THREE.WebGLRenderer();  // on créé l'objet renderer qui créé l'objet canvas qui donne la taille qu'on lui a donné, puis on récupère le dom et on le met dans le document
// y'a d'autres renderer où on a pas accès à un truc openGL.
renderer.setSize( window.innerWidth, window.innerHeight ); 
document.body.appendChild( renderer.domElement );

// now : scène vide, on veut remplir notre scène, plusieurs manières pour représenter des formes, ce qu'on veut c'est représenter des surfaces.

// on créé plusieurs points, on veut la rendre continue donc on relie les points, c'est un ensemble de points de coordonnées et on relie 2 points consécutifs par une arête
// on a créé un objet continu, et le point qui est à mi chemin c'est le mélange de 2 autres points

var axisHelper = new THREE.AxisHelper( 1 ); // 1 = unité de distance
scene.add( axisHelper );

camera.position.z = 100; // = recule la caméra car elle est initialisée à (0,0,0)


// le truc suivant sert à voir le point source de lumière !
var geoampoule = new THREE.SphereGeometry( 0.5, 50, 50 );
var materialampoule = new THREE.MeshBasicMaterial( { color: 0xffffff , opacity : 0.5 , transparent : true} );
var ampoule = new THREE.Mesh( geoampoule, materialampoule );
scene.add( ampoule );

function drawDrawing(data) {
    /*var geometry2 = new THREE.BoxGeometry( 1, 1, 1 ); // geometry = ensemble des points et de la manière dont ils sont connectés
    var materialcube2 = new THREE.MeshBasicMaterial( { color: 0x0e3456 } ); // quelque soit l'endroit où je vais regarder l'objet, il aura cette couleur là
    var cube2 = new THREE.Mesh( geometry2, materialcube2 );
    scene.add( cube2 );

    cube2.position.x = -5;
    cube2.position.y = 3;
    cube2.position.z = -2;*/
    
    var material = new THREE.LineBasicMaterial( { color: 0xffffff, linewidth: 4 } );
    for(var i=0; i<data.length; i++) {
        var geometry = new THREE.Geometry();
        var figureActu = data[i];
        for(var j=0; j<figureActu.length; j++) {
            var pointActu = figureActu[j];
            geometry.vertices.push(new Vector3(pointActu.x, pointActu.y, 0));
        }
        var line = new THREE.Line(geometry, material);
        scene.add(line);
    }
}

function render() { // c'est le rendu, ce qui va se passer lorsque l'on lance le fichier, qui va s'exécuter en continu
    requestAnimationFrame( render );
    renderer.render( scene, camera ); // = fais moi le rendu de cette scène là avec le point de vue de cette caméra, projeter dans le plan image, remplir l'intérieur des pixels, etc..
}

render();

var controls = new THREE.OrbitControls(camera); // on peut se servir de la souris pour bouger la caméra grâce à la fonction en dessous

function animate() {
   requestAnimationFrame(animate);
   renderer.render(scene, camera);
   controls.update();
}
animate();