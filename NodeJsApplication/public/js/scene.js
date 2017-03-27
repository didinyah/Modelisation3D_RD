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

var geometry = new THREE.BoxGeometry( 1, 1, 1 ); // geometry = ensemble des points et de la manière dont ils sont connectés
var materialcube = new THREE.MeshLambertMaterial( { color: 0x00fff0 } ); // quelque soit l'endroit où je vais regarder l'objet, il aura cette couleur là
var cube = new THREE.Mesh( geometry, materialcube );
scene.add( cube ); // ne pas oublier de toujours add à la scène

var geometry = new THREE.BoxGeometry( 1, 1, 1 ); // geometry = ensemble des points et de la manière dont ils sont connectés
var materialcube2 = new THREE.MeshBasicMaterial( { color: 0x0e3456 } ); // quelque soit l'endroit où je vais regarder l'objet, il aura cette couleur là
var cube2 = new THREE.Mesh( geometry, materialcube2 );
scene.add( cube2 );

camera.position.z = 5; // = recule la caméra car elle est initialisée à (0,0,0)

cube.position.x = 3; // on peut gérer la position de x, y et z
cube.position.y = 2;

cube2.position.x = -5;
cube2.position.y = 3;
cube2.position.z = -2;

/*var circleGeometry = new THREE.CircleGeometry(1, 40);	// créer un cercle			
var circle = new THREE.Mesh( circleGeometry, material );
scene.add( circle );*/

var geometry = new THREE.SphereGeometry( 2, 50, 50 ); // les 2 paramètres après la taille servent à déterminer le nombre d'arêtes de la sphère (cercle parfait impossible) par défaut à 4.
var materialsphere = new THREE.MeshLambertMaterial( { color: 0x0fff00 } ); // lambert = dépend de la source de lumière, basic non 
var sphere = new THREE.Mesh( geometry, materialsphere );
scene.add( sphere );

sphere.position.x = -3;

var sphereedges = new THREE.EdgesHelper(sphere, 0x000000); // colorer les arêtes de la sphère pour mieux la voir
scene.add(sphereedges);

var pointLight = new THREE.PointLight( 0xffffff ); // pointLight = point source de lumière, tel une ampoule
pointLight.position.set( 10, 10, 10 );
scene.add( pointLight );

// le truc suivant sert à voir le point source de lumière !
var geoampoule = new THREE.SphereGeometry( 0.5, 50, 50 );
var materialampoule = new THREE.MeshBasicMaterial( { color: 0xffffff , opacity : 0.5 , transparent : true} );
var ampoule = new THREE.Mesh( geoampoule, materialampoule );
scene.add( ampoule );

//autre méthode plus simple, existe déjà dans la doc
/*var sphereSize = 1;
var pointLightHelper = new THREE.PointLightHelper( pointLight, sphereSize );
scene.add( pointLightHelper );*/

function render() { // c'est le rendu, ce qui va se passer lorsque l'on lance le fichier, qui va s'exécuter en continu
	requestAnimationFrame( render );
	cube.rotation.x += 0.05; // on fait tourner le cube
	cube.rotation.y += 0.05;
	/*circle.rotation.x += 0.05;
	circle.rotation.y += 0.05;*/
	//sphere.position.z += 0.02; // screamer
	sphere.rotation.x += 0.05;
	sphere.rotation.y += 0.02; // on fait tourner la sphère
	sphere.rotation.z += 0.03;
	cube2.rotation.x += 0.04;
	cube2.rotation.y += 0.04;
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

// interface graphique pour modifier : distance de la pointlight, couleur et intensité
var gui = new dat.GUI();
var parameters = {
   posx : 0,
   posy : 0,
   posz : 0,
   intensity : 10,
   color : '#ffffff'
};
// on ajoute au gui les paramètres pour pouvoir les modifier (et qu'on voit les modifications)
var inte = gui.add(parameters, 'intensity').min(0).max(10).step(0.1);
inte.onChange(function (value) { pointLight.intensity = value });
var valx = gui.add(parameters, 'posx').min(-10).max(10).step(0.5);
valx.onChange(function (value) { pointLight.position.x = value, ampoule.position.x = value; });
var valy = gui.add(parameters, 'posy').min(-10).max(10).step(0.5);
valy.onChange(function (value) { pointLight.position.y = value, ampoule.position.y = value; });
var valz = gui.add(parameters, 'posz').min(-10).max(10).step(0.5);
valz.onChange(function (value) { pointLight.position.z = value, ampoule.position.z = value; });
var color = gui.addColor(parameters, 'color');
color.onChange(function (value) { value=value.replace( '#','0x' ) ; ampoule.material.color.setHex(value); pointLight.color.setHex(value); });

