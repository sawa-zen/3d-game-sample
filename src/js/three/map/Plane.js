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
    let geometry = new THREE.PlaneGeometry(200, 200, 10, 10);
    for (var i = 0; i < geometry.vertices.length; i++) {
      var vertex = geometry.vertices[i];
      vertex.z = Math.random() * 10;
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
