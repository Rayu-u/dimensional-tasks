import * as THREE from "three";
import cubeImg from "./../../assets/cube-shape.png";
import sphereImg from "./../../assets/sphere-shape.png";
import pyramidImg from "./../../assets/pyramid-shape.png";

export const shapes = [
  { name: "cube", color: "#FF7043" },
  { name: "sphere", color: "#FFB300" },
  { name: "pyramid", color: "#26A69A" },
];

export const shapeIconImages: { [key: string]: string } = {
  cube: cubeImg,
  sphere: sphereImg,
  pyramid: pyramidImg,
};

export class ObjectCreator {
  cubeGeometry: THREE.BoxGeometry;
  sphereGeometry: THREE.SphereGeometry;
  pyramidGeometry: THREE.CylinderGeometry;

  constructor() {
    this.cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
    this.cubeGeometry.computeBoundingBox();
    let cubeBoundingBox: THREE.Box3 = this.cubeGeometry.boundingBox!;
    let cubeHeight = cubeBoundingBox.max.y - cubeBoundingBox.min.y;
    this.cubeGeometry.translate(0, cubeHeight / 2, 0);

    const sphereScaleMultiplier: number = 1.2;
    this.sphereGeometry = new THREE.SphereGeometry(0.5 * sphereScaleMultiplier);
    this.sphereGeometry.computeBoundingBox();
    let sphereBoundingBox: THREE.Box3 = this.sphereGeometry.boundingBox!;
    let sphereHeight = sphereBoundingBox.max.y - sphereBoundingBox.min.y;
    this.sphereGeometry.translate(0, sphereHeight / 2, 0);

    this.pyramidGeometry = new THREE.CylinderGeometry(0, 0.65, 1, 4, 1);
    this.pyramidGeometry.computeBoundingBox();

    let pyramidBoundingBox: THREE.Box3 = this.pyramidGeometry.boundingBox!;
    let pyramidHeight = pyramidBoundingBox.max.y! - pyramidBoundingBox.min.y!;
    this.pyramidGeometry.translate(0, pyramidHeight / 2, 0);
    this.pyramidGeometry.rotateY(Math.PI / 4);
    this.pyramidGeometry.computeBoundingBox();
  }

  public createObject = (objectType: string) => {
    let object: THREE.Mesh;

    switch (objectType) {
      case "cube":
        const cube = new THREE.Mesh(
          this.cubeGeometry,
          new THREE.MeshStandardMaterial({
            color: shapes[0].color,
          })
        );
        cube.name = "Cube";
        object = cube;
        break;
      case "sphere":
        const sphere = new THREE.Mesh(
          this.sphereGeometry,
          new THREE.MeshStandardMaterial({
            color: shapes[1].color,
          })
        );
        sphere.name = "Sphere";
        object = sphere;
        break;
      case "pyramid":
        const pyramid = new THREE.Mesh(
          this.pyramidGeometry,
          new THREE.MeshStandardMaterial({
            color: shapes[2].color,
          })
        );
        pyramid.name = "Pyramid";

        object = pyramid;
        break;
      default:
        console.log("not a valid object was requested");
    }

    object!.position.x = 2;
    object!.position.z = 2;
    return object!;
  };
}
