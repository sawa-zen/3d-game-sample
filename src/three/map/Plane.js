import * as THREE from 'three';
import Loader from '../../loader/Loader';

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
    let geometry = new THREE.PlaneGeometry(300, 300, 30, 30);
    for (let i = 0; i < geometry.vertices.length; i++) {
      let vertex = geometry.vertices[i];
      let length = new THREE.Vector2(vertex.x, vertex.y).length();
      vertex.z = (20 - (0.1 * length)) + Math.random();
    }
    geometry.computeVertexNormals();
    geometry.computeFaceNormals();
    geometry.normalsNeedUpdate = true;
    geometry.uvsNeedUpdate = true;

    // Material
    let texture = Loader.instance.getTexture('sand');
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(24, 24);
    let material = new THREE.MeshPhongMaterial({
      map: texture,
      fog: false,
      shininess: 0
    });

    // Mesh
    let mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = -90 * Math.PI / 180;
    mesh.rotation.z = 90 * Math.PI / 180;
    mesh.receiveShadow = true;
    this.add(mesh);
  }
}
