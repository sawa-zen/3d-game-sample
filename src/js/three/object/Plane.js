import * as THREE from 'three';

/**
 * 地面クラスです。
 */
export default class Plane extends THREE.Object3D {

  /**
   * コンストラクター
   * @constructor
   */
  constructor() {
    super();

    // Geometry
    let geometry = new THREE.PlaneGeometry(200, 200, 10, 10);

    // Material
    let texture = THREE.ImageUtils.loadTexture("images/texture/tile.png");
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(24, 24);
    let material = new THREE.MeshPhongMaterial({
      map: texture
    });

    // Mesh
    let mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = -90 * Math.PI / 180;
    mesh.rotation.z = 90 * Math.PI / 180;
    mesh.receiveShadow = true;
    this.add(mesh);
  }
}
