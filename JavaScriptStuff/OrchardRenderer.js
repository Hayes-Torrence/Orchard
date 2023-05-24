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

			var orchard = Orchard("test");


			//define two camera arangements: one for horizontal, one for vertical,
			//when flip between the two just jump between those two camera orientations.



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

				var testRow3 = Row("The Ottomans",-10, 10);
				var testRow4 = Row("the Byzantines", -10, 10 );
				var testRow5 = Row("Hungary", -10, 10);


				orchard.addRow_(testRow3);
			//	orchard.addRow_(testRow4);
			//	orchard.addRow_(testRow5);


				var testTree = Tree("Sulyman", 9);
				var testLeaf = Leaf("Sulyman executed the grandvizir", 7);
				

				var testTree2 = Tree("Osman", -10);
				var testLeaf2 = Leaf("Osman entered the singularity and emerged unscathed", 1);


				testTree.AddLeaf_(testLeaf);
				testTree2.AddLeaf_(testLeaf2);
				testTree2.AddLeaf_(Leaf("Armed with knowledge gleaned from the time snakes, osman set out to forge his new empire"), 3);




				testRow3.AddTree_(testTree);
				testRow3.AddTree_(testTree2);
				testRow3.AddTree_(Tree("Mehmed", 1));
				testRow3.AddTree_(Tree("TimeSnake Osman", 1));



				console.log(testRow3);

				testRow3.trees_[0].AddLeaf_(Leaf("TimeSnake Osman attempted to steal the gem of will from osman", 7));



				testRow4.AddTree_(Tree("Palageous IV", 7));
				testRow4.AddTree_(Tree("Palageous III", 3));

				testRow4.trees_[0].AddLeaf_(Leaf("Bro got boddied ", 4));
				testRow4.trees_[1].AddLeaf_(Leaf("Bro looks forward to the reign of his son and name bearer", 3));

				testRow5.AddTree_(Tree("mathias Corvinius", -4));
				testRow5.trees_[0].AddLeaf_(Leaf("Matias balled out in civ multiplayer", 6));




				//drawRow(testRow3);

				console.log(testRow3);
				console.log(testRow3.trees_[0]);
				console.log(orchard.name);
				

				drawConnection(testTree, testTree2);
				//drawConnection(testRow4.trees_[0], testRow4.trees_[0]);
			
				

				renderer = new THREE.WebGLRenderer( { antialias: true } );
				renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setSize( window.innerWidth, window.innerHeight );
				document.body.appendChild( renderer.domElement );

				//drawRow(testRow3);

				//processRow(testRow3);
				
				drawOrchard(orchard);

				stats = new Stats();
				document.body.appendChild( stats.dom );

				//

				const gui = new GUI();
				gui.add(orchard, 'horizontal_').onChange( value =>{
					console.log("onChange");
					ChangeView();
				});
				

				//

				window.addEventListener( 'resize', onWindowResize );


				//raycasting code
				//TODO: finish raycasting implementation
				window.addEventListener( 'mousedown', onClick);
				window.addEventListener( 'pointermove', onPointerMove );

			}

			function onPointerMove( event ) {

				// calculate pointer position in normalized device coordinates
				// (-1 to +1) for both components

				pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
				pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

			}

			function onClick(event){
				//used to click on elements of the scene

				pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
				pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;



				raycaster.setFromCamera( pointer, camera );

				// calculate objects intersecting the picking ray

				intersects = raycaster.intersectObjects( scene.children );
				handleIntersection(intersects);



			}


			function drawOrchard(orchard){
				//Boot strapper that starts and handles the whole process of drawing an orchard:
					//currently just want to be able to display multiple rows


				//processRow's
				//use the returned array to figure some stuff out:
					//whats the date with the most nodes present: that's our max width


				//use the new row objects allong with the determined info to draw out each node
				let biggestSpacer = 4;
				let spacerX = 4;
				let spacerIncrement = 7;
				let spacerY = 3;
				for(let k = 0 ; k < orchard.rows_.length ; k++){
					const orderedRow = processRow(orchard.rows_[k]);


					console.log("row[k]");
					console.log(orchard.rows_[k]); 	
					spacerX = spacerX + biggestSpacer;
					biggestSpacer = 0;
					//reset it to 0 so if have say 3 rows, and the first one has a ton of
					//horizonallity, but the second and 3rd dont, dont need so much space between
					//rows 2 & 3

					// right now instead of processing out how much to 
					//seperate out trees by, using these place holders

					for(let i = 0 ; i < orderedRow.length ; i++){
						//for each entry in orderedRow
							//print out a new tree,
							//if more than one node exists 
							if(orderedRow[i].length > 2){

								for(let j = 1 ; j <orderedRow[i].length ; j++){
									//plants tree, then increases the space between nodes of same row
									plantTree(orderedRow[i][j], spacerX);
									spacerX = spacerX + spacerIncrement;
								}
								if(spacerX > biggestSpacer){
									//primitive way to implement spacing between multiple rows
									biggestSpacer = spacerX;
								}
								spacerX = 4; //resets spacer amount back to original
								continue;	//jumps back up to top loop
							}
							plantTree(orderedRow[i][1], spacerX);
									//if just one tree at a plant date, just plant that one
					//this tickles my brain a little bit as to: I feel like we could just do this
					//durring the processing step. But that's an efficiency, not 
					//an implementation.
					//TODO: Consolidate how many loops and loops within loops I need
					}
					
					

				}
			}

			function plantTree(tree, spacerX){
				//adds tree object to scene
				//adds pointer to underlying tree object for use in displaying info

				console.log("plantTree: " + tree.name_);
				console.log("spacerX: " + spacerX);

				const treeGeometry = new THREE.BoxGeometry( 2, 2, 1 ); 
   				const treeMaterial = new THREE.MeshBasicMaterial( {color: 0x00ff00} ); 
    			const cube = new THREE.Mesh( treeGeometry, treeMaterial ); 
				cube.tree_ = tree;

				cube.translateOnAxis(new THREE.Vector3(0,1,0).normalize(), tree.plantDate_);
				cube.translateOnAxis(new THREE.Vector3(1,0,0).normalize(), spacerX);
				//TODO: figure if this is passing pointers (if js even does that)
				//and if it's not see if can improve memory efficiency
    			scene.add( cube );
			}


			function processRow(row){
				//Version 1 implementation -> messy

				//takes a row of trees, loads it into an array, 

				const rowP = [];
				let currentPlantDate; //TODO: better varaible name


				rowP.push([row.trees_[0].plantDate_, row.trees_[0]]);
				//not sure how efficient splice is as an opperation,
				//but efficiency is a concern for the next draft

				for(let i = 1 ; i < row.trees_.length ; i++){
					//itterates across all the trees in a row



					currentPlantDate = row.trees_[i].plantDate_; //


					/*
					console.log("********");
					console.log("i loop: " + i);
					console.log("row.trees_[i].plantDate_");
					console.log(row.trees_[i].plantDate_);
					console.log("________________");
					console.log("rowP.length: ");
					console.log(rowP.length);
					console.log("--------");
					console.log("currentPlantDate: ");
					console.log(currentPlantDate);
					*/

					for(let j = 0 ; j < rowP.length ; j++){
						//itterates through rowP to find where to insert element,
						//once it finds a duplicate plant date, or one where the next is greater,
						//and the current is lesser, sticks it there

						if(j > 6){
							//TODO: remove this once confident in safety of code
							break;
							//breaks to make sure I don't accidentally infinite loop again
						}

						if(rowP[j][0] === currentPlantDate){
							//

							rowP[j].push(row.trees_[i]);
							break; 
						}
						else if(rowP[j][0] > currentPlantDate){
							//if we find a plant date bigger than the current we stick the current one
							//before that

							rowP.splice(j, 0 , [row.trees_[i].plantDate_, row.trees_[i]]);
							break;

						}
						else if(j === rowP.length-1){
							//if we're on the last index, and no other input breaks first,
							//sticks this entry on to the end of the list
							rowP.push([row.trees_[i].plantDate_, row.trees_[i]]);
							break;
						}
					}
				}

				console.log("rowP: ");
				console.log(rowP);
				//so now we have a 2d array where the first entry is the plant date,
				//and all the subsequent values are trees planted at that date
				return rowP;
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

			function addTreeTest(tree){
				//adds tree object to scene
				//adds pointer to underlying tree object for use in displaying info

				const treeGeometry = new THREE.BoxGeometry( 2, 2, 1 ); 
   				const treeMaterial = new THREE.MeshBasicMaterial( {color: 0x00ff00} ); 
    			const cube = new THREE.Mesh( treeGeometry, treeMaterial ); 
				cube.translateOnAxis(new THREE.Vector3(0,1,0).normalize(), tree.plantDate_);
				cube.tree_ = tree;
				//TODO: figure if this is passing pointers (if js even does that)
				//and if it's not see if can improve memory efficiency
    			scene.add( cube );
			}





			function drawConnection(Tree1, Tree2){
				//method that draws a connecting line between two trees

				const material = new THREE.LineBasicMaterial( { color: 0x0000ff } );

				const points = [];

				//points.push(new THREE.Vector3())

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






		


			function Orchard(name){
				//creates a new orchard object

				//dummy implementation of orientation_:
					//currently 1 = vertical, 0 = horizontal

				const orch = {
					name_: name,
					horizontal_: false, 
					rows_: [],
					connections_: [],
					addRow_: function(row){
						this.rows_.push(row);
					},
					isHorizontal_: function(){
						if(this.horizontal_ === true){
							return true;
						}
						return false;
					},
					isVertical_: function(){
						//artifact of previous "orientation_" implementation
						if(this.horizontal_ === false){
							return true;
						}
						return false;
					}

				}
				return orch;
			}

			function HorizontalView(){

				//This implementation vs actually changing the coordinates could have some
				//unplesant effects once I'm actually rending images and text in the thing.
				//but for now is fast and effective

				//rotates the camera 90 degrees and sets the boolean flags in orchard appropriatly
				if(orchard.isVertical_){
					camera.rotateOnAxis(new THREE.Vector3(0,0,1), Math.PI/2 );
					orchard.horizontal_ = true;
				}
			}

			function ChangeView(){
				//rotates the camera 90 degrees and sets the boolean flags in orchard appropriatly

				//TODO: Currently only effects the value of orchard.horizontal_ in the local scope?
				//somehow?
				//So instead of jumping back and forth between two states, we rotate in 1/4 circle 
				//increments. Need to determine why this is happening, and stop it	

				console.log("var: " + orchard.horizontal_);

				if(orchard.horizontal_ === true){
					console.log("if");
					camera.rotateOnAxis(new THREE.Vector3(0,0,1), Math.PI/2 );
					orchard.horizontal_ = false;
				}
				if(!orchard.horizontal_ === false){
					console.log("else");
					camera.rotateOnAxis(new THREE.Vector3(0,0,1), -Math.PI/2 );
					orchard.horizontal_ = true;
				}

				console.log("orchard: " + orchard.horizontal_);
				console.log("----------------------------------")
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
				return row;
			}


			function Tree(nameStr, PlantDate){
				//creates a new Tree Object
				//contians a content String, and a visible date
				//what if this was just a 3Js object,
				//and we added additional fields on?
				

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
		
			function Connection(Leaf1, Leaf2, Content){
				//in my head, a row is too ordered, it implies some sort of heirarchy,
				//but I think in reality the implementaion I'm going for is far less ordered,
				//what I really want a row to contain is a list of tree's


				//These connections are meant to pull out some of the "connected-ness"
				// a row is assumed to have. All a row is, is a collection of tree's that share
				//some kind of commonality.
				//A connection object is a connection between any two tree's:
				//they can be in the same row, they can be in different rows.
				//TODO: should connections exist on a tree level or a leaf level?
				//I think they should exist as tree to tree conections that can interface with leafs.

				//a connection is just a statement that two trees are connected.
				//future implementations could include the ability to define, mid use
				//new kinds of connection: black means heriditary, dotted means divorce, etc.
				//connections should be effected by the view window.

				//connections need to be housed at the orchard level to allow them interact w/ different
				//rows.


				//TODO: determine how to implement visible date:
				//If connections are between tree's but the actual info that creates a connection
				//lives on the leaf level, then should probably just pull from the leaf's visible date
				//that being said, I don't believe a leaf has any way of pointing at the 
				//tree it lives on, so it might get messy to just hand it leaves.
				//of course that could be fixed by giving leaves a pointer towards the parent tree,
				//but then things become more circualar, and I have to ask if theres a better way.
				const connec = {
					leaf1_: Leaf1,
					leaf2_: Leaf2,
					content_: Content
				}


				return connec;

			}






			function onWindowResize() {

				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();

				renderer.setSize( window.innerWidth, window.innerHeight );

			}

			function animate() {

				requestAnimationFrame( animate );

				//Spin();
				//WEEEEEEEEEEEEEEEEEEEEEEE

				render();
			
				stats.update();

			}


			function Spin(){
				//rotates the camera 90 degrees and sets the boolean flags in orchard appropriatly
				if(orchard.isVertical_){
					
					camera.rotateOnAxis(new THREE.Vector3(0,0,1), .01 );

				}


			}


			function handleIntersection(intersects){
				//handles behavior for what to do when mouse moves over a node:
				//should also add a method for what to do when click on intersected object

				//at the moment can only change things when you intersect,
				//no way to "undo" change when move mouse away from tree.

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


				renderer.render( scene, camera );

			}










			

		</script>

	</body>
</html>
