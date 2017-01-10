import * as THREE from 'three';

/**
 * カメラのクラスです。
 */
export default class Camera extends THREE.PerspectiveCamera {

  /** インスタンスを取得します。 */
  static get instance() {
    return Camera._instance || new Camera();
  }

  /**
   * コンストラクターです。
   * @constructor
   */
  constructor() {
    super(45, window.innerWidth / window.innerHeight, 1, 1000);
    Camera._instance = this;
  }

  /**
   * 毎フレームの更新をかけます。
   */
  update() {
    this.lookAt(new THREE.Vector3(0, 0, 0));
  }
}
