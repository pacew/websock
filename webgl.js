import * as THREE from 'https://unpkg.com/three/build/three.module.js';

var scene;

function line(color, from, to) {
  var mat = new THREE.LineBasicMaterial({ color: color });
  var geo = new THREE.BufferGeometry().setFromPoints([from, to]);
  scene.add (new THREE.Line(geo, mat));
}

function do_graphics() {
  var renderer = new THREE.WebGLRenderer();

  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  var camera = new THREE.PerspectiveCamera( 
    45, window.innerWidth / window.innerHeight, 1, 500 );
  camera.up.set (0, 0, 1);
  camera.position.set(-15, -5, 5);
  camera.lookAt(0, 0, 0);

  scene = new THREE.Scene();

  var mat, geo;
  var pts;

  var psize = 100;
  for (var grid = -psize; grid <= psize; grid += 10) {
    line (0x444444,
	  new THREE.Vector3(grid, -psize, 0),
	  new THREE.Vector3(grid, psize, 0))
    line (0x444444,
	  new THREE.Vector3(-psize, grid, 0),
	  new THREE.Vector3(psize, grid, 0))
  }

  line(0xff0000, 
       new THREE.Vector3(0, 0, 0),
       new THREE.Vector3(psize, 0, 0))

  line(0x00ff00, 
       new THREE.Vector3(0, 0, 0),
       new THREE.Vector3(0, psize, 0))

  line(0x0000ff, 
       new THREE.Vector3(0, 0, 0),
       new THREE.Vector3(0, 0, psize))




  renderer.render( scene, camera );
}


document.addEventListener('DOMContentLoaded', function(){
  do_graphics();
});
