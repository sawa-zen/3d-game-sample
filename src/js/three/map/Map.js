import * as THREE from 'three';
import Loader from '../../loader/Loader';

/**
 * マップクラスです。
 */
export default class Map extends THREE.Object3D {

  /** インスタンス */
  static get instance() {
    return Map._instance || new Map();
  }

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
    let texture = Loader.instance.getTexture('tile');
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

    Map._instance = this;
  }

  /**
   * ターゲット真下のfaceを取得します。
   */
  getUnderFace(target) {
    var rayStartPos = target.position.clone().add(new THREE.Vector3(0, 5, 0));
    var ray = new THREE.Raycaster(rayStartPos, new THREE.Vector3(0, -1, 0).normalize());
    return ray.intersectObjects(this.children)[0];
  }
}
