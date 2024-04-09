//import { XR } from './types/islefire-xr-0'

const xr = XR.createCore()
console.log(xr)

// import * as THREE from 'three'
// import './main.css'
// //import {VCOMP as characterCreationScreen} from './screen/charactercreation'
// //import * as LAZY from './lib/lazy-dom'
// import { FlyCamera } from './lib/ixr/flycamera'
// //import { OrbitCamera } from './lib/ixr/orbitcamera'
// //import { FontLoader } from 'three/addons/loaders/FontLoader.js'
// //import { TextGeometry } from 'three/addons/geometries/TextGeometry.js'
// //import defaultfont from '@asset/font/helvetiker_bold.typeface.json' // TODO
// import {VCOMP as weblaunch} from './screen/weblaunch'
// import * as LAZY from './lib/lazy-dom'

// window.addEventListener('load', () => onload())
// window.addEventListener('resize', () => onresize())

// //LAZY.run( characterCreationScreen() );
// LAZY.run( weblaunch() );

// const FOV = 75;
// const MINZ = 0.1;
// const MAXZ = 5000.0;
// const CAMDIST = 50.0;

// interface MouseState {
//   x: number,
//   y: number,
//   pos: THREE.Vector2,
// }
// interface State {
//   clock: THREE.Clock;
//   scene: THREE.Scene;
//   camera: THREE.Camera;
//   renderer: THREE.WebGLRenderer;
//   background: number, // TODO: type
//   mouse: MouseState,
//   fly: FlyCamera | undefined,
//   //orbit: OrbitCamera | undefined,
// }
// const ctx: State = {
//   clock: new THREE.Clock(),
//   scene: new THREE.Scene(),
//   camera: new THREE.PerspectiveCamera( FOV, window.innerWidth/window.innerHeight, MINZ, MAXZ ),
//   renderer: new THREE.WebGLRenderer({antialias: true}),
//   background: 0x0000018,
//   mouse: { x: 0, y: 0, pos: new THREE.Vector2(0,0) },
//   fly: undefined,
//   //orbit: undefined,
// };
// //------------------------------------------------------------------------

// //------------------------------------------------------------------------
// function createTreeModel() {
//   const voxelSize = 1.0;
//   const trunkMaterial = new THREE.MeshPhongMaterial({ color: 0x8B4513 }); // Brown
//   const foliageMaterial = new THREE.MeshPhongMaterial({ color: 0x00a000 }); // Green

//   const trunkDepth = 20;
//   {
//     const trunkWidth = 2;
//     const trunkHeight = 2;
//     const trunkX = -0.5*trunkWidth;
//     const trunkY = -0.5*trunkHeight;
//     const trunkZ = 0;
//     for (let z = 0; z < trunkDepth; z++) {
//         for (let y = 0; y < trunkHeight; y++) {
//             for (let x = 0; x < trunkWidth; x++) {
//                 const cubeGeometry = new THREE.BoxGeometry(voxelSize, voxelSize, voxelSize);
//                 const voxel = new THREE.Mesh(cubeGeometry, trunkMaterial);
//                 voxel.position.set(trunkX + x*voxelSize, trunkY + y*voxelSize, trunkZ + z*voxelSize);
//                 ctx.scene.add(voxel);
//             }
//         }
//     }
//   }

//   // Tree foliage
//   {
//     const foliageWidth = 15;
//     const foliageHeight = 15;
//     const foliageDepth = 15;
//     const foliageX = -0.5*foliageWidth * voxelSize;
//     const foliageY = -0.5*foliageHeight * voxelSize;
//     const foliageZ = trunkDepth;

//     for (let z = 0; z < foliageDepth; z++) {
//         for (let y = 0; y < foliageHeight; y++) {
//             for (let x = 0; x < foliageWidth; x++) {
//                 if (Math.random() > 0.5) {
//                     const cubeGeometry = new THREE.BoxGeometry(voxelSize, voxelSize, voxelSize);
//                     const voxel = new THREE.Mesh(cubeGeometry, foliageMaterial);
//                     voxel.position.set(foliageX + x*voxelSize, foliageY + y*voxelSize, foliageZ + z*voxelSize);
//                     ctx.scene.add(voxel);
//                 }
//             }
//         }
//     }
//   }
// }
// function createDirectionalLight() {
//   const dirLight = new THREE.DirectionalLight( 0x4444ff, 500 );
//   dirLight.position.set( 30, 120, 170 );
//   dirLight.castShadow = true;
//   dirLight.shadow.camera.near = 0.1;
//   dirLight.shadow.camera.far = 500;
//   dirLight.shadow.mapSize.width = 512;
//   dirLight.shadow.mapSize.height = 512;
//   ctx.scene.add(dirLight);
// }
// function createTorus() {
//   const geometry = new THREE.TorusKnotGeometry(10, 3, 300, 16)
//   const material = new THREE.MeshStandardMaterial({color: '#fff'})
//   material.color = new THREE.Color('#2020ff')
//   material.roughness = 0.5

//   const mesh = new THREE.Mesh(geometry, material)
//   mesh.castShadow = true
//   mesh.receiveShadow = true
//   ctx.scene.add(mesh)
// }
// function createRectLight() {
//   const rectAreaLight = new THREE.RectAreaLight('#fff', 1, 50, 50)
//   rectAreaLight.position.z = 10
//   rectAreaLight.position.y = -40
//   rectAreaLight.position.x = -20
//   rectAreaLight.lookAt(new THREE.Vector3(0, 0, 0))
//   ctx.scene.add(rectAreaLight)
// }
// // function create3dText() {
// //   const loader = new FontLoader();

// //   loader.load( defaultfont, function ( font: any ) {
// //     const geometry = new TextGeometry( 'ISLEFIRE', {
// //       font: font,
// //       size: 80,
// //       depth: 5,
// //       curveSegments: 12,
// //       bevelEnabled: true,
// //       bevelThickness: 10,
// //       bevelSize: 8,
// //       bevelOffset: 0,
// //       bevelSegments: 5
// //     } );
    
// //     ctx.scene.add(geometry);
// //   } );
// // }

// function onload() {
//   //ctx.scene = new THREE.Scene();
//   ctx.scene.background = new THREE.Color(ctx.background);
  
//   //ctx.camera = new THREE.PerspectiveCamera( FOV, w/h, MINZ, MAXZ );
//   const camPos = new THREE.Vector3(CAMDIST, 0, 1.8);
//   const camUp = new THREE.Vector3(0, 0, 1);
//   const camTarget = new THREE.Vector3(0, 0, 2.0);
//   ctx.camera.position.set(camPos.x, camPos.y, camPos.z);
//   ctx.camera.up.set(camUp.x, camUp.y, camUp.z);
//   ctx.camera.lookAt(camTarget);
  
//   //ctx.renderer = new THREE.WebGLRenderer();
//   ctx.renderer.setSize(window.innerWidth, window.innerHeight)
//   ctx.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
//   console.log(ctx.renderer.info)
//   console.log(ctx.renderer.capabilities)
//   ctx.renderer.autoClear = true
//   ctx.renderer.autoClearColor = true
//   ctx.renderer.autoClearDepth = true
//   ctx.renderer.autoClearStencil = true
//   ctx.renderer.shadowMap.enabled = true
//   ctx.renderer.shadowMap.type = THREE.PCFSoftShadowMap
//   ctx.renderer.toneMapping = THREE.ACESFilmicToneMapping
//   ctx.renderer.toneMappingExposure = 1.6

//   createTreeModel();
//   createDirectionalLight();
//   createTorus();
//   createRectLight();
//   //create3dText();

//   LAZY.getlayerdom(0).appendChild(ctx.renderer.domElement); //document.body.appendChild(ctx.renderer.domElement);

//   // document.addEventListener('mousemove', (event) => { 
//   //   ctx.mouse.x = event.clientX/window.innerWidth*2 - 1;
//   //   ctx.mouse.y = event.clientY/window.innerHeight*2 - 1;
//   //   ctx.mouse.pos.x = ctx.mouse.x;
//   //   ctx.mouse.pos.y = ctx.mouse.y;
//   // })

//   ctx.fly = new FlyCamera(ctx.camera, ctx.renderer.domElement);
//   // ctx.orbit = new OrbitCamera(ctx.camera, ctx.renderer.domElement);
//   // ctx.orbit.maxPolarAngle = Math.PI / 2;
//   // ctx.orbit.update();

//   renderframe(); // start frame loop
// }

// function onresize() {
//   //ctx.camera.aspect = window.innerWidth / window.innerHeight;
//   ctx.renderer.setSize(window.innerWidth, window.innerHeight);
// }

// function renderframe() {
//   const delta = ctx.clock.getDelta();
//   if( ctx.fly ) {
//     ctx.fly.movementSpeed = 100.0;
//     ctx.fly.update(delta);
//   } else {
//     //ctx.scene.background = new THREE.Color(ctx.mousex*0xFF);
//     const camTarget = new THREE.Vector3(0, 0, 0);
//     const camUp = new THREE.Vector3(0, 0, 1);
//     //ctx.camera.position.set(CAMDIST*Math.sin(3.1415*ctx.mousex), CAMDIST*Math.cos(3.1415*ctx.mousex), 5.0);
//     ctx.camera.up.set(camUp.x, camUp.y, camUp.z);
//     ctx.camera.lookAt(new THREE.Vector3(
//       camTarget.x + 10.0*Math.cos(ctx.mouse.x), 
//       camTarget.y + 10.0*Math.sin(ctx.mouse.x), 
//       camTarget.z + 10.0*Math.sin(-ctx.mouse.y)));
//   }

//   ctx.renderer.render(ctx.scene, ctx.camera);

//   requestAnimationFrame(renderframe);
// }
