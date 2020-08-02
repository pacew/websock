import * as THREE from 'https://unpkg.com/three/build/three.module.js';

window.t = THREE;

var scene;

function line(color, from, to) {
  var mat = new THREE.LineBasicMaterial({ color: color });
  var geo = new THREE.BufferGeometry().setFromPoints([from, to]);
  scene.add (new THREE.Line(geo, mat));
}

var links = []

function dtor(x) {
  return (x/360.0 * 2 * Math.PI);
}

function set_ang(link, ang) {
  link.mesh.rotateOnAxis(link.axis, ang);
}

function make_seg(color, xsize, ysize, zsize) {
  var geo = new THREE.Geometry();
  
  geo.vertices.push(
    new THREE.Vector3(-xsize,  ysize, 0),
    new THREE.Vector3(-xsize, -ysize, 0),
    new THREE.Vector3( xsize, -ysize, 0),
    new THREE.Vector3( xsize,  ysize, 0),
    new THREE.Vector3(-xsize,  ysize, zsize),
    new THREE.Vector3(-xsize, -ysize, zsize),
    new THREE.Vector3( xsize, -ysize, zsize),
    new THREE.Vector3( xsize,  ysize, zsize),

  );
  
  geo.faces.push(new THREE.Face3(0, 1, 4));
  geo.faces.push(new THREE.Face3(4, 1, 5));
  geo.faces.push(new THREE.Face3(1, 2, 6));
  geo.faces.push(new THREE.Face3(6, 5, 1));
  geo.faces.push(new THREE.Face3(7, 6, 2));
  geo.faces.push(new THREE.Face3(2, 3, 7));
  geo.faces.push(new THREE.Face3(3, 0, 4));
  geo.faces.push(new THREE.Face3(4, 7, 3));
  geo.faces.push(new THREE.Face3(4, 5, 6));
  geo.faces.push(new THREE.Face3(6, 7, 4));

  
  geo.computeBoundingSphere();
  geo.computeBoundingBox();
  geo.computeFaceNormals();
  geo.computeFlatVertexNormals();
  geo.computeMorphNormals();
  geo.computeVertexNormals();

  var mat = new THREE.MeshLambertMaterial({color: color});
  var mesh = new THREE.Mesh(geo, mat);
  return (mesh);
}

function make_link (parent, color, size, size2, axis) {
  var link = {}
  link.parent = parent;
  link.ang = 0;
  link.size = size;
  link.axis = axis;
  link.mesh = make_seg (color, size2, size2, link.size);
  link.end = link.mesh.matrix.clone();
  link.end.multiply (new THREE.Matrix4().makeTranslation(0, 0, link.size));
  if (parent) {
    link.mesh.applyMatrix4(link.parent.end);
    parent.mesh.add(link.mesh);
  }
  links.push(link);
  return (link);
}

function do_graphics() {
  var renderer = new THREE.WebGLRenderer();

  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  var camera = new THREE.PerspectiveCamera( 
    45, window.innerWidth / window.innerHeight, .010, 10);
  camera.up.set (0, 0, 1);
  camera.position.set(-2, -0.5, 1);
  camera.lookAt(0, 0, .5);

  scene = new THREE.Scene();


  var light1 = new THREE.SpotLight(0xffffff);
  light1.position.set(-10, -20, 10);
  scene.add(light1);

  var light2 = new THREE.SpotLight(0xffffff);
  light2.position.set(-20, 100, 5);
  scene.add(light2);

  var light3 = new THREE.SpotLight(0xffffff);
  light3.position.set(20, 100, 5);
  scene.add(light3);



  var mat, geo;
  var pts;

  var psize = 10;
  for (var grid = -psize; grid <= psize; grid += 1) {
    var from = -psize;
    var to = psize;
    if (grid == 0)
      to = 0;
    line (0x444444,
	  new THREE.Vector3(grid, from, 0),
	  new THREE.Vector3(grid, to, 0))
    line (0x444444,
	  new THREE.Vector3(from, grid, 0),
	  new THREE.Vector3(to, grid, 0))
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

  var r = 0.050;
  var geo, mat, link, prev, m;

  var base = make_link (null, 0xff0000, .4, .1, new THREE.Vector3(0, 0, 1));
  scene.add(base.mesh);

  link = make_link (base, 0x00ff00, .560, .050, new THREE.Vector3(0, 1, 0));
  link = make_link (link, 0x0000ff, .40, .050, new THREE.Vector3(0, 1, 0));

  set_ang (links[0], dtor(-20));
  set_ang (links[1], dtor(-20));
  set_ang (links[2], dtor(20));

  var animate = function () {
    requestAnimationFrame( animate );
    
    //link1.mesh.rotation.z += 0.02;
    //link2.mesh.rotation.z += 0.01;
    
    renderer.render( scene, camera );
  };
  
  animate();
}


document.addEventListener('DOMContentLoaded', function(){
  do_graphics();
});
