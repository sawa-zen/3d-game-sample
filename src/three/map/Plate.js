import * as THREE from 'three';
import Loader from '../../loader/Loader';

/**
 * プレートクラスです。
 */
export default class Plate extends THREE.Object3D {

  /**
   * コンストラクター
   * @constructor
   */
  constructor() {
    super();

    let geometry = new THREE.BoxGeometry(20, 20, 10);

    // Material
    let texture = Loader.instance.getTexture('tile');
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    let material = new THREE.MeshPhongMaterial({
      map: texture,
      fog: false,
      shininess: 0
    });

    let mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    this.add(mesh);
  }
}
