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
    super(45, window.innerWidth / window.innerHeight, 1, 500);

    this._maxDistance = 25;
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

    // ターゲットとカメラを結ぶベクトル
    let targetToCamera = this.position.clone().sub(lookAtPositon);
    // 距離を算出
    let distance = targetToCamera.length();

    if(distance > this._maxDistance) {
      targetToCamera = targetToCamera.normalize().multiplyScalar(this._maxDistance);
    }

    let newPosition = targetToCamera.add(targetPosition);

    if(newPosition.y < this._yDistance) {
      newPosition.y = this._yDistance;
    }

    this.position.copy(newPosition);
    this.lookAt(lookAtPositon);
  }
}
