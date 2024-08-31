import * as THREE from "three";
export const testString: string = "hello";

export interface SceneProperties {
  width: number;
  height: number;
  visibleAreaWidth: number; //in meters across, width and height
}

export function buildSceneAndAdjustCamera(
  camera: THREE.PerspectiveCamera,
  sceneProps: SceneProperties
): THREE.Scene {
  const floorWidth = sceneProps.visibleAreaWidth;
  const floorHeight: number = sceneProps.visibleAreaWidth / 2;

  camera.aspect = sceneProps.width / sceneProps.height;
  camera.fov = 50;
  camera.near = 0.1;
  camera.far = 1000;
  camera.updateProjectionMatrix(); //important for camera changes to take effect!!

  const scene = new THREE.Scene();

  //add light to the scene
  const dLight = new THREE.DirectionalLight(0xffffff, 2);
  dLight.castShadow = true;
  dLight.position.set(0, 10, 0);
  dLight.target.position.set(0, 0, -3);

  // dLight.position.set(0, 13, 0);
  // dLight.target.position.set(0,0,-10);

  //Set up shadow properties for the light
  dLight.shadow.mapSize.width = 1000; // default
  dLight.shadow.mapSize.height = 1000; // default
  dLight.shadow.camera.near = 1; // default
  dLight.shadow.camera.far = 500; // default
  scene.add(dLight);
  scene.add(dLight.target);

  const ambientLight = new THREE.AmbientLight(0xffffff, 2); // soft white light
  scene.add(ambientLight);

  const roomObj = new THREE.Object3D();

  // //common vars
  const wallWidth = 0.2;
  const wallHeight = 20;
  //add background wall
  const backGeo = new THREE.BoxGeometry(floorWidth, wallHeight, wallWidth);
  const backMaterial = new THREE.MeshStandardMaterial({ color: "#FFFFFF" });
  const backWall = new THREE.Mesh(backGeo, backMaterial);
  backWall.translateZ(-(floorHeight / 2));
  backWall.translateY(wallHeight / 2 - 0.1);
  backWall.translateX(floorWidth / 2);
  backWall.translateZ(floorHeight / 2);
  roomObj.add(backWall);

  //add side walls
  const sideGeo = new THREE.BoxGeometry(wallWidth, wallHeight, floorHeight);
  const sideMaterial = new THREE.MeshStandardMaterial({ color: "#FFFFFF" });
  const leftWall = new THREE.Mesh(sideGeo, sideMaterial);
  const rightWall = new THREE.Mesh(sideGeo, sideMaterial);
  leftWall.translateX(-floorWidth / 2);
  rightWall.translateX(floorWidth / 2);
  leftWall.translateY(wallHeight / 2 - 0.1);
  rightWall.translateY(wallHeight / 2 - 0.1);
  rightWall.translateX(floorWidth / 2);
  rightWall.translateZ(floorHeight / 2);
  leftWall.translateX(floorWidth / 2);
  leftWall.translateZ(floorHeight / 2);
  roomObj.add(leftWall); //to 0 0 0
  roomObj.add(rightWall); //to 0 0 0

  //add floor
  const geometry = new THREE.BoxGeometry(floorWidth, wallWidth, floorHeight);
  const material = new THREE.MeshStandardMaterial({ color: "#FFFFFF" });
  const floor = new THREE.Mesh(geometry, material);
  floor.castShadow = false;
  floor.receiveShadow = true;
  floor.translateY(-wallWidth / 2);
  floor.translateX(floorWidth / 2);
  floor.translateZ(floorHeight / 2);
  roomObj.add(floor);
  // scene.add( floor ); //to 0 0 0

  scene.add(roomObj);

  //add half floor for debugging
  // const debugGeo = new THREE.BoxGeometry( sceneProps.visibleArea.w, wallWidth, sceneProps.visibleArea.h / 2 );
  // const debugMaterial = new THREE.MeshStandardMaterial( { color: '#a83256'} );
  // const debugFloor = new THREE.Mesh( debugGeo, debugMaterial );
  // debugFloor.castShadow = false;
  // debugFloor.receiveShadow = true;
  // debugFloor.translateY(-wallWidth);
  // debugFloor.translateZ(0);
  // scene.add( debugFloor ); //to 0 0 0

  //adjust camera position
  camera.position.x = 0;
  // camera.position.z = Math.max(sceneProps.visibleArea.w, sceneProps.visibleArea.h) / (2 * Math.tan(THREE.MathUtils.degToRad(75) / 2)) - 6;
  camera.position.z = floorHeight * 1.55;
  camera.position.y = floorHeight / 1.1;
  // camera.position.y = 5;
  // camera.position.copy(cameraPosition);
  // camera.rotation.x = -0.2;
  // camera.rotation.y = 0;
  // camera.rotation.z = 0;
  camera.lookAt(new THREE.Vector3(0, 0, -floorHeight / 2));
  camera.translateX(floorWidth / 2);
  camera.translateZ(floorHeight / 2);
  camera.updateProjectionMatrix(); //important for camera changes to take effect!!

  return scene;
}
