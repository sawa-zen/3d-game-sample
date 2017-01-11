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
    this.position.x = 40;
    this.position.y = 20;
    Camera._instance = this;
  }

  /**
   * 毎フレームの更新をかけます。
   */
  update(targetPosition) {
    this.lookAt(targetPosition);
    this.position.x = targetPosition.x + 40;
    this.position.y = targetPosition.y + 20;
    this.position.z = targetPosition.z;
  }
}
