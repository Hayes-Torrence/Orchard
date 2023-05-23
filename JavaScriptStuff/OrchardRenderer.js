<!DOCTYPE html>
<html lang="en">
	<head>
		<title>three.js webgl - buffergeometry - indexed</title>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0">
		<link type="text/css" rel="stylesheet" href="main.css">
	</head>
	<body>

		<div id="container"></div>
		<div id="info"><a href="https://threejs.org" target="_blank" rel="noopener">three.js</a> webgl - buffergeometry - indexed</div>

		<!-- Import maps polyfill -->
		<!-- Remove this when import maps will be widely supported -->
		<script async src="https://unpkg.com/es-module-shims@1.6.3/dist/es-module-shims.js"></script>

		<script type="importmap">
			{
				"imports": {
					"three": "../build/three.module.js",
					"three/addons/": "./jsm/"
				}
			}
		</script>

		<script type="module">

			import * as THREE from 'three';

			import Stats from 'three/addons/libs/stats.module.js';
			import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

			let camera, scene, renderer, stats;

			let mesh;

			var raycaster = new THREE.Raycaster();
			var pointer = new THREE.Vector2();
			var intersects;
			const orchard = [];//array of Rows (for now)




			init();
			animate();

			function init() {

				//

				camera = new THREE.PerspectiveCamera( 27, window.innerWidth / window.innerHeight, 1, 3500 );
				camera.position.z = 64;

				scene = new THREE.Scene();
				scene.background = new THREE.Color( 0x050505 );

				//

				const light = new THREE.HemisphereLight();
				scene.add( light );

				//

			

				const indices = [];

				const vertices = [];
				const normals = [];
				const colors = [];

				const _color = new THREE.Color();


				

				// generate vertices, normals and color data for a simple grid geometry



				// generate indices (data for element array buffer)


				//Make a new geometry, add it to the scene
/*
				addTreeTest(-10);
				addTreeTest(4);
				addTreeTest(10);
*/
				var testRow3 = Row("The Ottomans",-10, 10);
				var testTree = Tree("Sulyman", 9);
				var testLeaf = Leaf("Sulyman executed the grandvizir", 7);

				var testTree2 = Tree("Osman", -10);
				var testLeaf2 = Leaf("Osman entered the singularity and emerged unscathed", 1);


				testRow3.AddTree_(testTree);
				testTree.AddLeaf_(testLeaf);
				

				testRow3.AddTree_(testTree2);
				testTree2.AddLeaf_(testLeaf2);

				drawRow(testRow3);

				console.log(testRow3);
				console.log(testRow3.trees_[0]);
				console.log(orchard[0].name);
				

				drawConnection(testTree, testTree2);

				renderer = new THREE.WebGLRenderer( { antialias: true } );
				renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setSize( window.innerWidth, window.innerHeight );
				document.body.appendChild( renderer.domElement );

				//

				stats = new Stats();
				document.body.appendChild( stats.dom );

				//

				const gui = new GUI();
				//gui.add( material, 'wireframe' );

				//

				window.addEventListener( 'resize', onWindowResize );


				//raycasting code
				//TODO: finish raycasting implementation
				window.addEventListener( 'pointermove', onPointerMove );

			}

			function onPointerMove( event ) {

				// calculate pointer position in normalized device coordinates
				// (-1 to +1) for both components

				pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
				pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

			}


			function drawRow(row){
							
				//itterates through a row, 
					//checks each tree to see if they should currently be visible.
						//for each visible tree renders the appropriate object.
						//to improve efficiency of future events, can have this rigged where instead of
						//alwasy having to itterate through everything just wait for a listener
						//to see a change in the viewing window that could update something

				const visibleTrees = [];

				for(let i = 0 ; i < row.trees_.length ; i++){

					//for each visible tree: create a new Tree rendering object at plantDate
					//currently only varies accross Y axis.
					console.log("i: " + i);
					console.log("PlantDate: " + row.trees_[i].plantDate_);
					addTreeTest(row.trees_[i]);;


					
					//draw lines between conected nodes:
					//drawing lines raises the question of how to handle row elements with
					//the same plant Date?
					//Almost want to have a seperate list of "Connections" and then we only
					//connect nodes that we say to connect.
					//in the mean time just make a method that connects two Trees

				};

			}

			function drawConnection(Tree1, Tree2){
				//method that draws a connecting line between two trees

				const material = new THREE.LineBasicMaterial( { color: 0x0000ff } );

				const points = [];

				//points.push(new THREE.Vector3())
				//feels like I need more info: need to store the specific location of each tree?
				//Maybe a method within row that can quickly convert the plant date over into
				//an appropriate vector
				points.push(new THREE.Vector3(0, Tree1.plantDate_, 0));
				points.push(new THREE.Vector3(0, Tree2.plantDate_, 0));



				const geometry = new THREE.BufferGeometry().setFromPoints( points );
				const line = new THREE.Line( geometry, material );
				scene.add(line);

			}


			function viewingWindow(){
				//the part of the orchard that is currently in view -> must be "rendered"

				//currently skeleton implementation
				const window = {
					start: 0,
					end: 2023
				}

				return window;

			}



			function addTreeTest(tree){
				//adds tree object to scene


				//should also add some sort of pointer to the mesh that points to the 
				//underlying tree object so that the intersect method can grab info from there

				const treeGeometry = new THREE.BoxGeometry( 2, 2, 1 ); 
   				const treeMaterial = new THREE.MeshBasicMaterial( {color: 0x00ff00} ); 
    			const cube = new THREE.Mesh( treeGeometry, treeMaterial ); 
				cube.translateOnAxis(new THREE.Vector3(0,1,0).normalize(), tree.plantDate_);
				cube.tree_ = tree;
				//TODO: figure if this is passing pointers (if js even does that)
				//and if it's not see if can improve memory efficiency
    			scene.add( cube );
			}


		


			function Orchard(name){
				//creates a new orchard object

				//dummy implementation of orientation_:
					//currently 1 = vertical, 0 = horizontal

				const orch = {
					name_: name,
					orientation_: 1,
					rows_: [],
					addRow_: function(row){
						rows_.push(row);
					}
				}
				return orch;
			}




			function Row(nameStr, start, end){
				//Creates a new row and adds it to the Orchard Array

				//dummy variables start and end


				const row = {
					start_: start,
					end_: end,
					name_: nameStr,
					trees_: [],
					AddTree_: function(tree){
						this.trees_.push(tree);
					}
				}
				orchard.push(row);
				return row;

			}


			function Tree(nameStr, PlantDate){
				//creates a new Tree Object
				//contians a content String, and a visible date

				const tree = {
					name_: nameStr,
					plantDate_: PlantDate,
					leaves_: [],
					AddLeaf_: function(leaf){
						this.leaves_.push(leaf);
					}
				}
				return tree;
			}

			function Leaf(content, VisibleDate){

				const leaf = {
					content_: content,
					visibleDate_: VisibleDate
				}

				return leaf;
			}
		






			function onWindowResize() {

				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();

				renderer.setSize( window.innerWidth, window.innerHeight );

			}

			//

			function animate() {

				requestAnimationFrame( animate );

				render();
				stats.update();

			}


			function handleIntersection(intersects){
				//handles behavior for what to do when mouse moves over a node:
				//should also add a method for what to do when click on intersected object

				//at the moment can only change things when you intersect,
				//no way to "undo" change when move mouse away from tree.

				//

				for ( let i = 0; i < intersects.length; i ++ ) {
					//loop first checks if there have been any intersected elements


					if( !(intersects[i].object.tree_ === undefined)){
						//next checks to see if any of those intersected objects have a tree_ field
						//if they do prints the content of said tree's leaves to the console.
						const leaves = intersects[i].object.tree_.leaves_;

						for(let j = 0 ; j < leaves.length ; j++){

							console.log(leaves[j].content_);
						}
					}
					


				}

			}



			function render() {

				
				// update the picking ray with the camera and pointer position
				raycaster.setFromCamera( pointer, camera );

				// calculate objects intersecting the picking ray
				intersects = raycaster.intersectObjects( scene.children );

				handleIntersection(intersects);

				renderer.render( scene, camera );

			}










			

		</script>

	</body>
</html>
