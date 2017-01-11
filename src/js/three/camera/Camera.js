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

    this._xDistance = 30;
    this._yDistance = 15;

    this.position.x = this._xDistance;
    this.position.y = this._yDistance;
    Camera._instance = this;
  }

  /**
   * 毎フレームの更新をかけます。
   */
  update(targetPosition) {
    let lookAtPositon = targetPosition.clone().add(new THREE.Vector3(0, 3, 0));
    this.lookAt(lookAtPositon);
    this.position.x = targetPosition.x + this._xDistance;
    this.position.y = targetPosition.y + this._yDistance;
    this.position.z = targetPosition.z;
  }
}
